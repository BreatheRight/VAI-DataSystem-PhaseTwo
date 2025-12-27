#!/usr/bin/env python3
"""
Diagnostic script to check which installations have numericId and slug fields.
Run this to see what needs to be fixed in Firestore.
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.config import init_firebase

def check_installations():
    db = init_firebase()
    installations_ref = db.collection('installations')
    docs = installations_ref.stream()

    print("\n" + "="*80)
    print("INSTALLATION FIELD DIAGNOSTIC")
    print("="*80 + "\n")

    installations = []
    for doc in docs:
        inst = doc.to_dict()
        inst['docId'] = doc.id
        installations.append(inst)

    if not installations:
        print("❌ No installations found in Firestore!")
        return

    print(f"Found {len(installations)} installations:\n")

    for i, inst in enumerate(installations, 1):
        print(f"{i}. {inst.get('name', 'UNNAMED')}")
        print(f"   Firestore Doc ID: {inst['docId']}")
        print(f"   numericId:        {inst.get('numericId', '❌ MISSING')}")
        print(f"   slug:             {inst.get('slug', '❌ MISSING')}")
        print(f"   status:           {inst.get('status', 'N/A')}")
        print(f"   location:         {inst.get('location', 'N/A')}")

        # Check what survey responses reference this installation
        responses_ref = db.collection('surveyResponses')
        # Check by numericId
        if inst.get('numericId'):
            matching_responses = list(responses_ref.where('installationId', '==', inst['numericId']).stream())
            print(f"   Survey responses: {len(matching_responses)} (by numericId)")

        # Check by doc ID (fallback)
        doc_id_responses = list(responses_ref.where('installationId', '==', inst['docId']).stream())
        if doc_id_responses:
            print(f"   ⚠️  {len(doc_id_responses)} responses using Firestore doc ID (WRONG!)")

        print()

    # Summary
    missing_numeric = [i for i in installations if not i.get('numericId')]
    missing_slug = [i for i in installations if not i.get('slug')]

    print("="*80)
    print("SUMMARY")
    print("="*80)
    print(f"✅ Installations with numericId: {len(installations) - len(missing_numeric)}/{len(installations)}")
    print(f"✅ Installations with slug:      {len(installations) - len(missing_slug)}/{len(installations)}")

    if missing_numeric:
        print(f"\n❌ Missing numericId: {', '.join(i['name'] for i in missing_numeric)}")
        print("   → These need numericId added manually in Firestore or via admin UI")

    if missing_slug:
        print(f"\n❌ Missing slug: {', '.join(i['name'] for i in missing_slug)}")
        print("   → These need slug added manually in Firestore or via admin UI")

    print("\n" + "="*80)
    print("RECOMMENDED ACTIONS:")
    print("="*80)
    print("1. Go to Firebase Console → Firestore → installations collection")
    print("2. For each installation missing numericId, add field:")
    print("   - Breathing Pavilion: numericId = \"1\" (string)")
    print("   - Common Ground:      numericId = \"2\" (string)")
    print("   - Los Circulos:       numericId = \"3\" (string)")
    print("3. For each installation missing slug, add field:")
    print("   - Breathing Pavilion: slug = \"breathing-pavilion\" (string)")
    print("   - Common Ground:      slug = \"common-ground\" (string)")
    print("   - Los Circulos:       slug = \"los-circulos\" (string)")
    print("\n")

if __name__ == '__main__':
    check_installations()
