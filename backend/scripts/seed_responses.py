"""
Seed synthetic survey responses to Firestore for demo/testing purposes.
Run from backend directory: python scripts/seed_responses.py
"""
import sys
import os
import random
from datetime import datetime, timedelta, timezone

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.models import SurveyResponse

# Survey question options (matching frontend/src/data/surveyQuestions.js)
Q1_OPTIONS = ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"]
Q2_OPTIONS = ["Daily", "A few times a week", "Once a week", "A few times a month", "Rarely/Never"]
Q3_OPTIONS = ["Less than 5 minutes", "5-15 minutes", "15-30 minutes", "30 minutes to 1 hour", "More than 1 hour"]
Q4_OPTIONS = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
Q5_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"]
Q6_OPTIONS = [
    "Black or African American", "Hispanic or Latino/a/x", "White", "Asian",
    "Native American or Alaska Native", "Native Hawaiian or Other Pacific Islander",
    "Middle Eastern or North African", "Multiracial", "Prefer not to say", "Other"
]
Q7_OPTIONS = ["10032", "10033", "10040", "Other"]
Q8_Q11_RANGE = [1, 2, 3, 4, 5]  # Sentiment scale
Q12_OPTIONS = [
    "Read materials on-site", "Played or engaged with the installation", "Took a phone call",
    "Ate or drank", "Socialized with others", "Passed through without stopping", "Other"
]
Q13_OPTIONS = ["Yes", "No", "Not Sure"]

INSTALLATIONS = ["1", "2"]  # Installation IDs


def generate_random_response():
    """Generate a single random survey response."""
    responses = {
        "q1": random.choice(Q1_OPTIONS),
        "q2": random.choice(Q2_OPTIONS),
        "q3": random.choice(Q3_OPTIONS),
        "q4": random.choice(Q4_OPTIONS),
        "q5": random.choice(Q5_OPTIONS),
        "q6": random.sample(Q6_OPTIONS, k=random.randint(1, 2)),  # Multi-select
        "q7": random.choice(Q7_OPTIONS),
        "q8": str(random.choice(Q8_Q11_RANGE)),
        "q9": str(random.choice(Q8_Q11_RANGE)),
        "q10": str(random.choice(Q8_Q11_RANGE)),
        "q11": str(random.choice(Q8_Q11_RANGE)),
        "q12": random.sample(Q12_OPTIONS, k=random.randint(1, 3)),  # Multi-select
        "q13": random.choice(Q13_OPTIONS),
    }

    installation_id = random.choice(INSTALLATIONS)

    # Generate random timestamp within last 30 days
    days_ago = random.randint(0, 30)
    hours_ago = random.randint(0, 23)
    timestamp = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago)

    return responses, installation_id, timestamp


def seed_data(app, count=30):
    """Seed 'count' random survey responses to Firestore."""
    print(f"\n🌱 Seeding {count} survey responses to Firestore...")

    with app.app_context():
        db = app.db
        collection = db.collection('surveyResponses')

        for i in range(count):
            responses, installation_id, timestamp = generate_random_response()

            # Create SurveyResponse model instance
            survey_response = SurveyResponse(responses, installation_id)
            # Override timestamp with our random one
            survey_response.submitted_at = timestamp.isoformat()

            # Add to Firestore
            doc_ref = collection.add(survey_response.to_dict())
            print(f"  ✅ Response {i+1}/{count} added (Installation {installation_id}, {timestamp.strftime('%Y-%m-%d %H:%M')})")

    print(f"\n✨ Successfully seeded {count} responses!\n")


if __name__ == "__main__":
    # Create Flask app to access Firestore
    app = create_app()

    # Seed 30 responses by default, or pass count as argument
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    seed_data(app, count)
