# Define all your Flask routes (API endpoints)
from flask import Blueprint, request, jsonify, send_file, current_app

from firebase_admin import auth, firestore
import io
import zipfile
import os
import pandas as pd
from app.models import UserSignUp, SurveyResponse


from app.utils import SurveyAnalyzer, load_responses_from_firestore, save_graphs_to_pdf, clean_firestore_responses

main = Blueprint('main', __name__)

question_map = {
    "q1": "Before this installation, how often did you visit this site?",
    "q2": "Since the installation, how often do you visit this site?",
    "q3": "On average, how much time do you spend at this site per visit?",
    "q4": "What is your age group?",
    "q5": "What is your gender?",
    "q6": "What is your race/ethnicity?",
    "q7": "What is your zip code?",
    "q8": "How welcome do you feel on this site?",
    "q9": "How safe do you feel on this site?",
    "q10": "How comfortable do you feel on this site?",
    "q11": "How positive is your overall experience at this site?",
    "q12": "What activity best describes your time spent at this site?",
    "q13": "Has this installation made you more interested in exploring the surrounding neighborhood?",
}

@main.route('/')
def health_check():
    return jsonify({"message": "Hello, VAI project!"})

# submitting a survey response
@main.route('/submit-survey', methods=['POST'])
def submit_survey():
    response_data = request.json
    if not response_data:
        return jsonify({"error": "No data provided"}), 400

    raw_responses = response_data.get('responses')
    if not raw_responses:
        return jsonify({"error": "No responses provided"}), 400

    responses = {}

    for key, value in raw_responses.items():
        # If it's a list with more than one item, keep it as is (for checkboxes)
        if isinstance(value, list):
            if len(value) > 1:
                responses[key] = value
            elif len(value) == 1:
                responses[key] = value[0]  # Convert single-item list to a string
            else:
                responses[key] = ""  # Empty list becomes empty string
        else:
            responses[key] = value  # In case it's already a string

    print("Received survey submission response_data:", response_data)

    installation_id = response_data.get('installationId')
    # Do not overwrite normalized responses with raw responses
    # responses = response_data.get('responses') 

    survey_response = SurveyResponse(responses, installation_id)

    try:
        current_app.db.collection('surveyResponses').add(survey_response.to_dict())
        print("Survey response saved successfully to Firestore!")  # Added success print
        return jsonify({"message": "Survey submitted", "survey responses": responses}), 200

    except Exception as e:
        print("Error saving survey response:", str(e))
        return jsonify({"error": str(e)}), 400


# creating a new user
@main.route('/register-user', methods=['POST'])
def register_user():
    user_data = request.json
    first_name = user_data.get('firstName')
    last_name = user_data.get('lastName')
    email = user_data.get('email')
    password = user_data.get('password')

    # Basic validation, will go in depth in the frontend!
    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    user = UserSignUp(first_name, last_name, email, password)

    try:
        # Creating the user in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=f"{user.first_name} {user.last_name}"
        )

        # Store user details in Firestore
        current_app.db.collection('users').document(user_record.uid).set(user.to_dict(user_record.uid))
        return jsonify({"message": "User created successfully", "uid": user_record.uid}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# verifying that the user attempting to login exists within our DB
@main.route('/verify-token', methods=['POST'])
def verify_token():
    id_token = request.json.get("idToken")
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        return jsonify({"message": "Token verified", "uid": uid}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@main.route('/get-survey-responses', methods=['GET'])
def get_survey_responses():
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        # Access Firestore from current_app
        db = current_app.db
        responses_ref = db.collection('surveyResponses')
        docs = responses_ref.stream()

        responses = []
        for doc in docs:
            response = doc.to_dict()
            response['id'] = doc.id  # Include document ID if needed
            responses.append(response)

        return jsonify(responses), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/get-session-metrics', methods=['GET'])
def get_session_metrics():
    """Calculate average survey completion time from survey_sessions collection"""
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        db = current_app.db
        sessions_ref = db.collection('survey_sessions')
        docs = sessions_ref.stream()

        durations = []
        for doc in docs:
            session = doc.to_dict()
            started = session.get('startedAt')
            completed = session.get('completedAt')
            
            if started and completed:
                # Calculate duration in seconds
                duration = (completed.timestamp() - started.timestamp())
                durations.append(duration)

        if not durations:
            return jsonify({
                "avgCompletionTime": 0,
                "totalSessions": 0,
                "unit": "seconds"
            }), 200

        avg_duration = sum(durations) / len(durations)
        
        return jsonify({
            "avgCompletionTime": round(avg_duration, 2),
            "avgCompletionTimeMinutes": round(avg_duration / 60, 2),
            "totalSessions": len(durations),
            "unit": "seconds"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/generate-report', methods=['GET'])
def generate_report():
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        raw_responses = load_responses_from_firestore()
        responses = clean_firestore_responses(raw_responses, question_map)
        analyzer = SurveyAnalyzer(responses, question_map)

        if not responses:
            return jsonify({"error": "No survey responses found to generate report."}), 400

        analyzer = SurveyAnalyzer(responses, question_map)

        print(f"Sample Firestore response: {responses[:2]}")
        csv_path = 'survey_summary.csv'
        pdf_path = 'survey_graphs_summary.pdf'

        analyzer.export_summary_csv(csv_path)
        analyzer.generate_graphs('survey_graphs')
        save_graphs_to_pdf('survey_graphs', pdf_path, question_map)

        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w') as zf:
            zf.write(csv_path)
            zf.write(pdf_path)

        memory_file.seek(0)

        return send_file(memory_file, mimetype='application/zip', as_attachment=True, download_name='survey_reports.zip')

    except Exception as e:
        print("Error in generate_report:", str(e))
        return jsonify({"error": str(e)}), 500


@main.route('/submit-bug-report', methods=['POST'])
def submit_bug_report():
    """
    Please use this form to submit bugs, or equest features here. You may attach screenshot for context.
    Sends email to vaiteam65800@gmail.com
    """
    try:
        title = request.form.get('title')
        description = request.form.get('description')
        steps_to_reproduce = request.form.get('stepsToReproduce')
        priority = request.form.get('priority', 'medium')
        screenshot = request.files.get('screenshot')

        # For now, we'll save to Firestore
        # In production, you would integrate with email service (SendGrid, etc.)
        db = current_app.db
        bug_report_data = {
            'title': title,
            'description': description,
            'stepsToReproduce': steps_to_reproduce,
            'priority': priority,
            'submittedAt': firestore.SERVER_TIMESTAMP,
            'status': 'open'
        }

        # Save to Firestore
        doc_ref = db.collection('bugReports').add(bug_report_data)

        # TODO: Add email sending logic here
        # For now, just log it
        print(f"Bug report submitted: {title} (Priority: {priority})")
        print(f"Description: {description}")
        print(f"Steps: {steps_to_reproduce}")

        return jsonify({
            "message": "Bug report submitted successfully",
            "reportId": doc_ref[0].id
        }), 200

    except Exception as e:
        print("Error submitting bug report:", str(e))
        return jsonify({"error": str(e)}), 500

# --- Event Manager CRUD Routes ---

@main.route('/installation-by-identifier/<identifier>', methods=['GET'])
def get_installation_by_identifier(identifier):
    """
    Get installation by slug or numericId.
    Supports both /los-circulos and ?id=3 routing patterns.
    Handles case-insensitive slug matching.
    """
    try:
        db = current_app.db
        installations_ref = db.collection('installations')
        docs = installations_ref.stream()
        
        # Normalize identifier for case-insensitive comparison
        normalized_identifier = identifier.lower().strip()
        
        for doc in docs:
            inst = doc.to_dict()
            inst['id'] = doc.id
            
            # Match by slug (case-insensitive) or numericId (exact match)
            slug_match = inst.get('slug', '').lower() == normalized_identifier
            numeric_match = inst.get('numericId') == identifier
            
            if slug_match or numeric_match:
                return jsonify(inst), 200
        
        return jsonify({"error": "Installation not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/check-slug/<slug>', methods=['GET'])
def check_slug_availability(slug):
    """
    Check if a slug is available (not already in use).
    Used by admin when creating new installations.
    """
    try:
        db = current_app.db
        installations_ref = db.collection('installations')
        docs = installations_ref.stream()
        
        normalized_slug = slug.lower().strip()
        
        for doc in docs:
            inst = doc.to_dict()
            if inst.get('slug', '').lower() == normalized_slug:
                return jsonify({
                    "available": False,
                    "message": f"Slug '{slug}' is already in use by installation: {inst.get('name')}"
                }), 200
        
        return jsonify({"available": True, "message": "Slug is available"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/installations', methods=['GET'])
def get_installations():
    try:
        db = current_app.db
        installations_ref = db.collection('installations')
        docs = installations_ref.stream()
        
        installations = []
        for doc in docs:
            inst = doc.to_dict()
            inst['id'] = doc.id
            installations.append(inst)
            
        return jsonify(installations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/installations', methods=['POST'])
def create_installation():
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        data = request.json
        if not data.get('name') or not data.get('location'):
            return jsonify({"error": "Name and location are required"}), 400
            
        installation_data = {
            'name': data.get('name'),
            'description': data.get('description', ''),
            'image': data.get('image', ''),
            'location': data.get('location'),
            'status': data.get('status', 'Active'),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        db = current_app.db
        update_time, doc_ref = db.collection('installations').add(installation_data)
        
        # Return the created object with ID
        installation_data['id'] = doc_ref.id
        # Convert timestamp to string for JSON serialization if needed, or let frontend handle it
        # For simplicity in this MVP, we won't return the server timestamp back immediately or we'd need to fetch it
        
        return jsonify({
            "id": doc_ref.id,
            "name": installation_data['name'],
            "location": installation_data['location'],
            "status": installation_data['status'],
            "description": installation_data['description'],
            "image": installation_data['image']
        }), 201
        
    except Exception as e:
        print("Error creating installation:", str(e))
        return jsonify({"error": str(e)}), 500

@main.route('/installations/<installation_id>', methods=['PUT'])
def update_installation(installation_id):
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        data = request.json
        db = current_app.db
        doc_ref = db.collection('installations').document(installation_id)
        
        if not doc_ref.get().exists:
            return jsonify({"error": "Installation not found"}), 404
            
        update_data = {
            'name': data.get('name'),
            'description': data.get('description'),
            'image': data.get('image'),
            'location': data.get('location'),
            'status': data.get('status'),
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Remove None values to avoid overwriting with null if partial update intended
        # But for this form, we send all fields usually. 
        # Let's filter just in case
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        doc_ref.update(update_data)
        
        return jsonify({"message": "Installation updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/installations/<installation_id>', methods=['DELETE'])
def delete_installation(installation_id):
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        db = current_app.db
        doc_ref = db.collection('installations').document(installation_id)
        
        if not doc_ref.get().exists:
            return jsonify({"error": "Installation not found"}), 404
            
        doc_ref.delete()
        
        return jsonify({"message": "Installation deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Survey Questions CRUD Routes ---

@main.route('/survey-questions', methods=['GET'])
def get_survey_questions():
    """Fetch active survey questions, optionally filtered by installationId"""
    try:
        db = current_app.db
        installation_id = request.args.get('installationId')
        
        # Start with active questions query
        questions_ref = db.collection('surveyQuestions').where('active', '==', True)
        docs = questions_ref.stream()
        
        questions = []
        for doc in docs:
            question = doc.to_dict()
            question['id'] = doc.id
            
            # Filter by installation if specified
            if installation_id:
                installations = question.get('installations', [])
                if installation_id in installations:
                    questions.append(question)
            else:
                # No filter - return all active questions
                questions.append(question)
        
        # Sort by order field
        questions.sort(key=lambda x: x.get('order', 999))
            
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/survey-questions', methods=['POST'])
def create_survey_question():
    """Create a new survey question (admin only)"""
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        data = request.json
        if not data.get('question'):
            return jsonify({"error": "Question text is required"}), 400
            
        question_data = {
            'questionId': data.get('questionId', f"q{data.get('order', 999)}"),
            'question': data.get('question'),
            'options': data.get('options', []),
            'type': data.get('type', 'radio'),
            'multiple': data.get('multiple', False),
            'order': data.get('order', 999),
            'active': True,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        db = current_app.db
        doc_ref = db.collection('surveyQuestions').document(question_data['questionId'])
        doc_ref.set(question_data)
        
        return jsonify({
            "message": "Question created successfully",
            "questionId": question_data['questionId']
        }), 201
        
    except Exception as e:
        print("Error creating question:", str(e))
        return jsonify({"error": str(e)}), 500

@main.route('/survey-questions/<question_id>', methods=['PUT'])
def update_survey_question(question_id):
    """Update an existing survey question (admin only)"""
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        data = request.json
        db = current_app.db
        doc_ref = db.collection('surveyQuestions').document(question_id)
        
        if not doc_ref.get().exists:
            return jsonify({"error": "Question not found"}), 404
            
        update_data = {
            'question': data.get('question'),
            'options': data.get('options'),
            'type': data.get('type'),
            'multiple': data.get('multiple'),
            'order': data.get('order'),
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Filter out None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        doc_ref.update(update_data)
        
        return jsonify({"message": "Question updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route('/survey-questions/<question_id>', methods=['DELETE'])
def delete_survey_question(question_id):
    """Soft delete a survey question by marking it inactive (admin only)"""
    # Verify token for admin access
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
    
    id_token = auth_header.split('Bearer ')[1]
    try:
        auth.verify_id_token(id_token)
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401

    try:
        db = current_app.db
        doc_ref = db.collection('surveyQuestions').document(question_id)
        
        if not doc_ref.get().exists:
            return jsonify({"error": "Question not found"}), 404
            
        # Soft delete by marking inactive
        doc_ref.update({
            'active': False,
            'updatedAt': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({"message": "Question deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
