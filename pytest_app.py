import pytest
from app import create_app  # Import the create_app function


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app = create_app()  # ← MUST call the function with ()
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.test_client() as client:
        yield client


def test_login_page_loads(client):
    """Test that the login page loads"""
    response = client.get('/login')
    assert response.status_code == 200


def test_successful_login(client):
    """Test login with valid credentials"""
    response = client.post('/login', data={
        'username': 'validuser',      # Replace with real credentials
        'password': 'validpassword'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'welcome' in response.data.lower()


def test_invalid_user_login(client):
    """Test login with user that doesn't exist"""
    response = client.post('/login', data={
        'username': 'nonexistentuser',
        'password': 'somepassword'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'error' in response.data.lower()