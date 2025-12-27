"""
Migration script to upload enhanced survey questions to Firestore
with proper type classification for range, text, and multiple choice questions.

Run this script to populate the surveyQuestions collection in Firebase.
"""

import sys
import os
from datetime import datetime

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

app = create_app()

# Enhanced question bank with installation assignments
# Breathing Pavilion: ARCHIVED (Closed October 12) - No active questions
# Common Ground: q1-q7, q11, q15, q18, q21, q23, q26, q28, q30 (15 total)
# Los Circulos: q1-q7, q9, q10, q14, q19, q20, q22, q24, q25 (15 total)

questions_data = [
    {
        "questionId": "q1",
        "question": "Before this installation, how often did you visit this site?",
        "options": ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"],
        "type": "choice",
        "multiple": False,
        "order": 1,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q2",
        "question": "Since the installation, how often do you visit this site?",
        "options": ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"],
        "type": "choice",
        "multiple": False,
        "order": 2,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q3",
        "question": "On average, how much time do you spend at this site per visit?",
        "options": ["Less than 5 minutes", "5-15 minutes", "15-30 minutes", "30 minutes to 1 hour", "More than 1 hour"],
        "type": "choice",
        "multiple": False,
        "order": 3,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q4",
        "question": "What is your age group?",
        "options": ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
        "type": "choice",
        "multiple": False,
        "order": 4,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q5",
        "question": "What is your gender?",
        "options": ["Male", "Female", "Non-binary", "Prefer not to say"],
        "type": "choice",
        "multiple": False,
        "order": 5,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q6",
        "question": "What is your race/ethnicity?",
        "options": [
            "Black or African American", "Hispanic or Latino/a/x", "White", "Asian",
            "Native American or Alaska Native", "Native Hawaiian or Other Pacific Islander",
            "Middle Eastern or North African", "Multiracial", "Prefer not to say", "Other"
        ],
        "type": "choice",
        "multiple": True,
        "order": 6,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q7",
        "question": "What is your zip code?",
        "options": ["10032", "10033", "10040", "Other"],
        "type": "choice",
        "multiple": False,
        "order": 7,
        "active": True,
        "installations": ["los-circulos", "common-ground"]
    },
    {
        "questionId": "q8",
        "question": "How welcome do you feel on this site? (1 = Not Welcome, 5 = Very Welcome)?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 8,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q9",
        "question": "How safe do you feel on this site? (1 = Not Safe, 5 = Very Safe)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 9,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q10",
        "question": "How comfortable do you feel on this site? (1 = Not Comfortable, 5 = Very Comfortable)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 10,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q11",
        "question": "How positive is your overall experience at this site? (1 = Very Negative, 5 = Very Positive.)",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 11,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q12",
        "question": "What activity best describes your time spent at this site?",
        "options": [
            "Read materials on-site", "Played or engaged with the installation", "Took a phone call",
            "Ate or drank", "Socialized with others", "Passed through without stopping", "Other"
        ],
        "type": "choice",
        "multiple": True,
        "order": 12,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q13",
        "question": "Has this installation made you more interested in exploring the surrounding neighborhood?",
        "options": ["Yes", "No", "Not Sure"],
        "type": "choice",
        "multiple": False,
        "order": 13,
        "active": False,
        "installations": []
    },
    # NEW QUESTIONS START HERE
    {
        "questionId": "q14",
        "question": "On a scale of 0 to 10, how likely are you to recommend our organization to a friend or colleague?",
        "type": "range",
        "options": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "multiple": False,
        "order": 14,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q15",
        "question": "How satisfied are you with the overall value you receive as a member/supporter?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 15,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q16",
        "question": "How would you rate our impact on the community?",
        "type": "range",
        "options": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "multiple": False,
        "order": 16,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q17",
        "question": "What could we do to improve your experience with our app?",
        "type": "text",
        "multiple": False,
        "order": 17,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q18",
        "question": "What additional support or programs would you like us to offer?",
        "type": "text",
        "multiple": False,
        "order": 18,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q19",
        "question": "On a scale of 1 to 5, how much did the art installation influence your perception of public space?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 19,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q20",
        "question": "How did you first learn about this specific installation?",
        "options": ["App notification", "Social media", "Website", "Saw it in person", "Other"],
        "type": "choice",
        "multiple": False,
        "order": 20,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q21",
        "question": "Did you attend any related talks or tours associated with the installation?",
        "options": ["Yes", "No"],
        "type": "choice",
        "multiple": False,
        "order": 21,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q22",
        "question": "What feelings or thoughts did this art installation evoke for you?",
        "type": "text",
        "multiple": False,
        "order": 22,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q23",
        "question": "How easy was it to navigate to and engage with the physical art installation using the app's map/guide?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 23,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q24",
        "question": "On a scale of 1 to 10, how valuable was the content discussed during the last member meetup?",
        "type": "range",
        "options": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "multiple": False,
        "order": 24,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q25",
        "question": "Which of these topics would you be most interested in for a future meetup?",
        "options": ["Urban Design & Equity", "Sustainable Architecture", "Public Art & Community Engagement", "Historic Preservation"],
        "type": "choice",
        "multiple": False,
        "order": 25,
        "active": True,
        "installations": ["los-circulos"]
    },
    {
        "questionId": "q26",
        "question": "Did the meetup help you make a meaningful professional connection?",
        "options": ["Yes", "No"],
        "type": "choice",
        "multiple": False,
        "order": 26,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q27",
        "question": "What was your single favorite part of the event?",
        "type": "text",
        "multiple": False,
        "order": 27,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q28",
        "question": "How likely are you to recommend a friend or colleague attend a future Van Alen member event?",
        "type": "range",
        "options": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "multiple": False,
        "order": 28,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q29",
        "question": "How effectively does the Van Alen Institute app help you stay informed about upcoming events?",
        "type": "range",
        "options": [1, 2, 3, 4, 5],
        "multiple": False,
        "order": 29,
        "active": False,
        "installations": []
    },
    {
        "questionId": "q30",
        "question": "Do you feel a strong sense of community with other Van Alen members?",
        "options": ["Yes", "No"],
        "type": "choice",
        "multiple": False,
        "order": 30,
        "active": True,
        "installations": ["common-ground"]
    },
    {
        "questionId": "q31",
        "question": "Do you have any suggestions for locations for future public art projects?",
        "type": "text",
        "multiple": False,
        "order": 31,
        "active": False,
        "installations": []
    }
]


def upload_questions_to_firestore():
    """Upload all questions to Firestore with proper metadata."""
    with app.app_context():
        db = app.db
        collection_ref = db.collection('surveyQuestions')

        print(f"Starting upload of {len(questions_data)} questions to Firestore...")

        success_count = 0
        error_count = 0

        for question in questions_data:
            try:
                # Add timestamps
                question['createdAt'] = datetime.utcnow()
                question['updatedAt'] = datetime.utcnow()

                # Use questionId as document ID for easy retrieval
                doc_ref = collection_ref.document(question['questionId'])
                doc_ref.set(question)

                print(f"✓ Uploaded {question['questionId']}: {question['question'][:60]}...")
                success_count += 1

            except Exception as e:
                print(f"✗ Error uploading {question.get('questionId', 'unknown')}: {str(e)}")
                error_count += 1

        print(f"\n{'='*60}")
        print(f"Upload complete!")
        print(f"Success: {success_count}/{len(questions_data)}")
        print(f"Errors: {error_count}")
        print(f"{'='*60}\n")

        # Print summary by type
        type_counts = {}
        for q in questions_data:
            q_type = q.get('type', 'choice')
            type_counts[q_type] = type_counts.get(q_type, 0) + 1

        print("Question Types:")
        for q_type, count in sorted(type_counts.items()):
            print(f"  - {q_type}: {count} questions")


if __name__ == '__main__':
    print("\n" + "="*60)
    print("VAI Survey Questions Migration Script")
    print("="*60 + "\n")

    response = input("This will upload/overwrite 31 questions in Firestore. Continue? (yes/no): ")

    if response.lower() in ['yes', 'y']:
        upload_questions_to_firestore()
    else:
        print("Migration cancelled.")
