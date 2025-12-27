"""
Migration Script: Survey Questions to Firestore

This script moves the hardcoded survey questions from frontend/src/data/surveyQuestions.js
into Firestore so that admins can manage questions through the Survey Builder UI.

Run this script once to seed the initial questions into Firestore.

Usage:
    python backend/scripts/migrate_questions_to_firestore.py
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase_admin import firestore
from app import create_app

# Define the hardcoded questions (copied from surveyQuestions.js)
SURVEY_QUESTIONS = [
    {
        "questionId": "q1",
        "question": "Before this installation, how often did you visit this site?",
        "options": ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"],
        "multiple": False,
        "type": "radio",
        "order": 1
    },
    {
        "questionId": "q2",
        "question": "Since the installation, how often do you visit this site?",
        "options": ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"],
        "multiple": False,
        "type": "radio",
        "order": 2
    },
    {
        "questionId": "q3",
        "question": "On average, how much time do you spend at this site per visit?",
        "options": ["Less than 5 minutes", "5-15 minutes", "15-30 minutes", "30 minutes to 1 hour", "More than 1 hour"],
        "multiple": False,
        "type": "radio",
        "order": 3
    },
    {
        "questionId": "q4",
        "question": "What is your age group?",
        "options": ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        "multiple": False,
        "type": "radio",
        "order": 4
    },
    {
        "questionId": "q5",
        "question": "What is your gender?",
        "options": ["Male", "Female", "Non-binary", "Prefer not to say"],
        "multiple": False,
        "type": "radio",
        "order": 5
    },
    {
        "questionId": "q6",
        "question": "What is your race/ethnicity?",
        "options": [
            "Black or African American", "Hispanic or Latino/a/x", "White", "Asian",
            "Native American or Alaska Native", "Native Hawaiian or Other Pacific Islander",
            "Middle Eastern or North African", "Multiracial", "Prefer not to say", "Other"
        ],
        "multiple": True,
        "type": "checkbox",
        "order": 6
    },
    {
        "questionId": "q7",
        "question": "What is your zip code?",
        "options": ["10032", "10033", "10040", "Other"],
        "multiple": False,
        "type": "radio",
        "order": 7
    },
    {
        "questionId": "q8",
        "question": "How welcome do you feel on this site? (1 = Not Welcome, 5 = Very Welcome)?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 8
    },
    {
        "questionId": "q9",
        "question": "How safe do you feel on this site? (1 = Not Safe, 5 = Very Safe)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 9
    },
    {
        "questionId": "q10",
        "question": "How comfortable do you feel on this site? (1 = Not Comfortable, 5 = Very Comfortable)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 10
    },
    {
        "questionId": "q11",
        "question": "How positive is your overall experience at this site? (1 = Very Negative, 5 = Very Positive.)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 11
    },
    {
        "questionId": "q12",
        "question": "What activity best describes your time spent at this site?",
        "options": [
            "Read materials on-site", "Played or engaged with the installation", "Took a phone call",
            "Ate or drank", "Socialized with others", "Passed through without stopping", "Other"
        ],
        "multiple": True,
        "type": "checkbox",
        "order": 12
    },
    {
        "questionId": "q13",
        "question": "Has this installation made you more interested in exploring the surrounding neighborhood?",
        "options": ["Yes", "No", "Not Sure"],
        "multiple": False,
        "type": "radio",
        "order": 13
    }
]


def migrate_questions():
    """Upload survey questions to Firestore"""
    app = create_app()
    db = app.db

    print("Starting migration of survey questions to Firestore...")

    questions_ref = db.collection('surveyQuestions')

    for question_data in SURVEY_QUESTIONS:
        # Add timestamp
        question_data['createdAt'] = firestore.SERVER_TIMESTAMP
        question_data['updatedAt'] = firestore.SERVER_TIMESTAMP
        question_data['active'] = True  # Mark as active question

        # Use questionId as document ID for predictable access
        doc_ref = questions_ref.document(question_data['questionId'])
        doc_ref.set(question_data)

        print(f"✓ Migrated {question_data['questionId']}: {question_data['question'][:50]}...")

    print(f"\n✅ Successfully migrated {len(SURVEY_QUESTIONS)} questions to Firestore!")
    print("Admins can now manage these questions through the Survey Builder UI.")


if __name__ == "__main__":
    migrate_questions()
