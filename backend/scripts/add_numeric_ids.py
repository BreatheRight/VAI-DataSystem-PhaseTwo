#!/usr/bin/env python3
"""
Add numericId field to all installations in Firestore.
This ensures survey responses use "1", "2", "3" for dashboard filtering.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase_admin import credentials, initialize_app, firestore
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

def add_numeric_ids():
    firebase_key_path = os.getenv('FIREBASE_KEY_PATH', 'app/firebase_key.json')
    cred = credentials.Certificate(firebase_key_path)
    initialize_app(cred)
    db = firestore.client()

    print("\n" + "="*80)
    print("ADD numericId FIELD TO INSTALLATIONS")
    print("="*80 + "\n")

    # Mapping of installation names to numeric IDs
    name_to_numeric_id = {
        "Breathing Pavilion": "1",
        "Common Ground": "2",
        "Los Circulos": "3"
    }

    installations_ref = db.collection('installations')
    docs = list(installations_ref.stream())

    if not docs:
        print("❌ No installations found in Firestore!")
        return

    print(f"Found {len(docs)} installations:\n")

    updates_needed = []

    for doc in docs:
        inst = doc.to_dict()
        doc_id = doc.id
        name = inst.get('name', 'UNNAMED')
        current_numeric_id = inst.get('numericId')

        # Determine what numericId should be
        expected_numeric_id = name_to_numeric_id.get(name)

        if not expected_numeric_id:
            print(f"⚠️  {name} (ID: {doc_id})")
            print(f"    Unknown installation - will assign next available ID")
            existing_ids = [inst.get('numericId') for inst in [d.to_dict() for d in docs] if inst.get('numericId')]
            max_id = max([int(id) for id in existing_ids if id.isdigit()], default=3)
            expected_numeric_id = str(max_id + 1)

        if current_numeric_id == expected_numeric_id:
            print(f"✅ {name} (ID: {doc_id})")
            print(f"    numericId: {current_numeric_id} - Already correct\n")
        else:
            print(f"⚠️  {name} (ID: {doc_id})")
            print(f"    Current:  {current_numeric_id if current_numeric_id else 'MISSING'}")
            print(f"    Will set: {expected_numeric_id}\n")
            updates_needed.append({
                'doc_ref': doc.reference,
                'name': name,
                'doc_id': doc_id,
                'numeric_id': expected_numeric_id
            })

    if not updates_needed:
        print("\n✅ All installations already have correct numericId field!")
        print("\nNext steps:")
        print("1. Run: python scripts/normalize_firestore_data.py")
        print("2. Test survey submission")
        print("3. Refresh Dashboard\n")
        return

    print("-"*80)
    print(f"\nWill update {len(updates_needed)} installations")
    response = input("Proceed? Type 'yes' to continue: ")

    if response.lower() != 'yes':
        print("Aborted.\n")
        return

    print("\nUpdating installations...\n")

    for item in updates_needed:
        try:
            # Add or update numericId field
            item['doc_ref'].update({
                'numericId': item['numeric_id'],
                'updatedAt': datetime.utcnow().isoformat() + '+00:00'
            })
            print(f"✅ {item['name']}: Set numericId = '{item['numeric_id']}'")
        except Exception as e:
            print(f"❌ Error updating {item['name']}: {e}")

    print("\n" + "="*80)
    print("COMPLETE")
    print("="*80)
    print("\nVerify in Firebase Console:")
    print("- Breathing Pavilion: numericId = '1'")
    print("- Common Ground:      numericId = '2'")
    print("- Los Circulos:       numericId = '3'")
    print("\nNext steps:")
    print("1. Run: python scripts/normalize_firestore_data.py --apply")
    print("2. Submit test survey: http://localhost:5173/los-circulos")
    print("3. Check surveyResponses collection - should see installationId: '3'")
    print("4. Refresh Dashboard - data should appear\n")

if __name__ == '__main__':
    add_numeric_ids()
