import pytest
from app_name import app  # Replace 'app_name' with flask app file name once it is completed.


@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use temporary in-memory database
    app.config['WTF_CSRF_ENABLED'] = False  # Disable CSRF for testing
    
    with app.test_client() as client:
        with app.app_context():
            # Create database tables
            db.create_all()
            
            # CREATE TEST USER
            test_user = User(username='validuser', email='test@example.com')
            test_user.set_password('validpassword')  # Adjust based on your User model
            db.session.add(test_user)
            db.session.commit()
            
            yield client
            
            # Clean up
            db.drop_all()


def test_successful_login(client):
    """Test login with a valid user - should go to welcome page"""
    response = client.post('/login', data={
        'username': 'validuser',  # This user now exists because the fixture created it!
        'password': 'validpassword'
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