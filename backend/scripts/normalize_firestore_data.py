#!/usr/bin/env python3
"""
Normalize Firestore data - Fix installation references in survey responses.

This script:
1. Verifies all installations have numericId and slug fields
2. Finds survey responses using Firestore doc IDs instead of numericId
3. Replaces wrong installationId with correct numericId
4. Adds installationSlug to responses for future flexibility

Run: python scripts/normalize_firestore_data.py
"""

import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase_admin import credentials, initialize_app, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_firestore():
    """Initialize Firebase Admin SDK and return Firestore client"""
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'app/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    initialize_app(cred)
    return firestore.client()

def normalize_data(dry_run=True):
    """
    Normalize Firestore data.

    Args:
        dry_run (bool): If True, only show what would be changed without making changes
    """
    db = init_firestore()

    print("\n" + "="*80)
    print("FIRESTORE DATA NORMALIZATION")
    print("="*80)
    print(f"Mode: {'DRY RUN (no changes)' if dry_run else 'LIVE (will modify Firestore)'}")
    print("="*80 + "\n")

    # Step 1: Get all installations and build mapping
    print("Step 1: Loading installations...")
    installations_ref = db.collection('installations')
    installation_docs = list(installations_ref.stream())

    if not installation_docs:
        print("❌ ERROR: No installations found in Firestore!")
        return

    # Build mapping: Firestore doc ID -> numericId
    doc_id_to_numeric = {}
    doc_id_to_slug = {}
    doc_id_to_name = {}

    print(f"Found {len(installation_docs)} installations:\n")

    missing_fields = False
    for doc in installation_docs:
        inst = doc.to_dict()
        doc_id = doc.id
        name = inst.get('name', 'UNNAMED')
        numeric_id = inst.get('numericId')
        slug = inst.get('slug')

        print(f"  • {name}")
        print(f"    Doc ID:    {doc_id}")
        print(f"    numericId: {numeric_id if numeric_id else '❌ MISSING'}")
        print(f"    slug:      {slug if slug else '❌ MISSING'}")

        if numeric_id:
            doc_id_to_numeric[doc_id] = numeric_id
            doc_id_to_name[doc_id] = name
        else:
            print(f"    ⚠️  WARNING: Missing numericId - cannot fix responses for this installation")
            missing_fields = True

        if slug:
            doc_id_to_slug[doc_id] = slug

        print()

    if missing_fields:
        print("❌ ERROR: Some installations are missing numericId field.")
        print("   Please add numericId manually in Firebase Console first:")
        print("   - Breathing Pavilion: numericId = '1'")
        print("   - Common Ground:      numericId = '2'")
        print("   - Los Circulos:       numericId = '3'")
        print("\n   Then re-run this script.\n")
        return

    # Step 2: Scan survey responses
    print("\n" + "-"*80)
    print("Step 2: Scanning survey responses...")
    print("-"*80 + "\n")

    responses_ref = db.collection('surveyResponses')
    response_docs = list(responses_ref.stream())

    print(f"Found {len(response_docs)} survey responses\n")

    correct_count = 0
    needs_fix = []

    for doc in response_docs:
        response = doc.to_dict()
        response_id = doc.id
        installation_id = response.get('installationId')

        # Check if installationId is a Firestore doc ID (wrong) or numericId (correct)
        if installation_id in doc_id_to_numeric:
            # Wrong - using Firestore doc ID
            correct_numeric_id = doc_id_to_numeric[installation_id]
            installation_name = doc_id_to_name[installation_id]
            needs_fix.append({
                'doc_id': response_id,
                'doc_ref': doc.reference,
                'current_id': installation_id,
                'correct_id': correct_numeric_id,
                'installation_name': installation_name,
                'slug': doc_id_to_slug.get(installation_id),
                'submitted_at': response.get('submittedAt', 'N/A')
            })
        elif installation_id in doc_id_to_numeric.values():
            # Correct - already using numericId
            correct_count += 1
        else:
            # Unknown installationId
            print(f"⚠️  Response {response_id}: Unknown installationId '{installation_id}'")

    print(f"✅ Correct responses:    {correct_count}")
    print(f"❌ Need fixing:          {len(needs_fix)}")

    if not needs_fix:
        print("\n🎉 All survey responses are already correct! No changes needed.\n")
        return

    # Step 3: Show what will be fixed
    print("\n" + "-"*80)
    print("Step 3: Responses that need fixing:")
    print("-"*80 + "\n")

    for item in needs_fix:
        print(f"  Response: {item['doc_id'][:20]}... ({item['submitted_at']})")
        print(f"    Installation: {item['installation_name']}")
        print(f"    Current ID:   {item['current_id']} ❌ (Firestore doc ID)")
        print(f"    Correct ID:   {item['correct_id']} ✅ (numericId)")
        if item['slug']:
            print(f"    Will add slug: {item['slug']}")
        print()

    # Step 4: Apply fixes
    if dry_run:
        print("\n" + "="*80)
        print("DRY RUN COMPLETE - No changes were made")
        print("="*80)
        print(f"\nTo apply these {len(needs_fix)} fixes, run:")
        print("  python scripts/normalize_firestore_data.py --apply")
        print()
    else:
        print("\n" + "-"*80)
        print("Step 4: Applying fixes...")
        print("-"*80 + "\n")

        success_count = 0
        error_count = 0

        for item in needs_fix:
            try:
                update_data = {
                    'installationId': item['correct_id'],
                    'updatedAt': datetime.utcnow().isoformat() + '+00:00'
                }

                # Add slug if available
                if item['slug']:
                    update_data['installationSlug'] = item['slug']

                item['doc_ref'].update(update_data)

                print(f"✅ Fixed: {item['installation_name']} response ({item['doc_id'][:20]}...)")
                success_count += 1

            except Exception as e:
                print(f"❌ Error fixing {item['doc_id']}: {e}")
                error_count += 1

        print("\n" + "="*80)
        print("NORMALIZATION COMPLETE")
        print("="*80)
        print(f"✅ Successfully fixed: {success_count}")
        if error_count > 0:
            print(f"❌ Errors:             {error_count}")
        print("\nNext steps:")
        print("1. Refresh your admin dashboard")
        print("2. Verify KPIs and charts show correct data")
        print("3. Submit a test survey to confirm new responses work\n")

if __name__ == '__main__':
    # Check for --apply flag
    apply_changes = '--apply' in sys.argv or '--live' in sys.argv

    if not apply_changes:
        print("\n⚠️  Running in DRY RUN mode (no changes will be made)")
        print("   To apply changes, run: python scripts/normalize_firestore_data.py --apply\n")
    else:
        print("\n⚠️  LIVE MODE - Changes will be made to Firestore!")
        response = input("   Are you sure? Type 'yes' to continue: ")
        if response.lower() != 'yes':
            print("   Aborted.\n")
            sys.exit(0)
        print()

    normalize_data(dry_run=not apply_changes)
