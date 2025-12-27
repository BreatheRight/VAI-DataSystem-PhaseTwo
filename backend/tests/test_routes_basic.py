import pytest
from unittest.mock import MagicMock, patch
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.routes.current_app')
def test_submit_survey_success(mock_current_app, client):
    # Mock Firestore
    mock_db = MagicMock()
    mock_current_app.db = mock_db

    payload = {
        "installationId": "1",
        "responses": {
            "q1": "Daily",
            "q2": "Weekly"
        }
    }

    response = client.post('/submit-survey', json=payload)
    assert response.status_code == 200
    assert b"Survey submitted" in response.data

def test_submit_survey_no_data(client):
    response = client.post('/submit-survey', json={})
    assert response.status_code == 400
    assert b"No data provided" in response.data

@patch('app.routes.auth')
def test_verify_token_success(mock_auth, client):
    mock_auth.verify_id_token.return_value = {'uid': 'test-uid'}

    response = client.post('/verify-token', json={'idToken': 'valid-token'})
    assert response.status_code == 200
    assert response.json['uid'] == 'test-uid'

@patch('app.routes.auth')
def test_verify_token_failure(mock_auth, client):
    mock_auth.verify_id_token.side_effect = Exception("Invalid token")

    response = client.post('/verify-token', json={'idToken': 'invalid-token'})
    assert response.status_code == 401

@patch('app.routes.current_app')
def test_submit_bug_report(mock_current_app, client):
    mock_db = MagicMock()
    mock_current_app.db = mock_db

    # Mock the add return value: (update_time, doc_ref)
    mock_doc_ref = MagicMock()
    mock_doc_ref.id = "bug-123"
    mock_db.collection.return_value.add.return_value = (None, mock_doc_ref)

    data = {
        'title': 'Test Bug',
        'description': 'Something broke',
        'priority': 'high'
    }

    response = client.post('/submit-bug-report', data=data)
    assert response.status_code == 200
    assert response.json['reportId'] == 'bug-123'
