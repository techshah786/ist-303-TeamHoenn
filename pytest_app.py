import pytest
from your_app import app  # Replace 'your_app' with your Flask app file name


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_successful_login(client):
    """Test login with a valid user - should go to welcome page"""
    response = client.post('/login', data={
        'username': 'validuser',  # Replace with a username that exists in your app
        'password': 'validpassword'  # Replace with correct password
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'welcome' in response.data.lower()


def test_invalid_user_login(client):
    """Test login with user that doesn't exist - should show error"""
    response = client.post('/login', data={
        'username': 'nonexistentuser',
        'password': 'somepassword'
    }, follow_redirects=True)
    
    assert response.status_code == 200
    assert b'error' in response.data.lower()


def test_login_page_loads(client):
    """Test that the login page loads"""
    response = client.get('/login')
    assert response.status_code == 200