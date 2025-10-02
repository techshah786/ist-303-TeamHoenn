import pytest
from app import app as flask_app
import db


@pytest.fixture
def app():
    """Create a test Flask app"""
    flask_app.config['TESTING'] = True
    return flask_app


@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()


# ============================================
# TEST 1: LOGIN PAGE LOADS
# ============================================

def test_login_page_loads(client):
    """Test: Login page loads correctly"""
    print("\n🧪 TEST 1: Loading login page...")
    
    response = client.get('/login')
    
    assert response.status_code == 200
    assert b'login' in response.data.lower()
    print("✅ PASSED: Login page loads!")


# ============================================
# TEST 2: SIGNUP PAGE LOADS
# ============================================

def test_signup_page_loads(client):
    """Test: Signup page loads correctly"""
    print("\n🧪 TEST 2: Loading signup page...")
    
    response = client.get('/signup')
    
    assert response.status_code == 200
    assert b'signup' in response.data.lower()
    print("✅ PASSED: Signup page loads!")


# ============================================
# TEST 3: INDEX REDIRECTS TO LOGIN
# ============================================

def test_index_redirects(client):
    """Test: Home page (/) redirects to login"""
    print("\n🧪 TEST 3: Testing index redirect...")
    
    response = client.get('/', follow_redirects=False)
    
    assert response.status_code == 302
    assert '/login' in response.location
    print("✅ PASSED: Index redirects to login!")


# ============================================
# TEST 4: HOME PAGE REQUIRES LOGIN
# ============================================

def test_home_without_login(client):
    """Test: Can't access home page without logging in"""
    print("\n🧪 TEST 4: Trying to access home without login...")
    
    # Try to go to home without logging in
    response = client.get('/home', follow_redirects=False)
    
    # Should redirect to login
    assert response.status_code == 302
    assert '/login' in response.location
    print("✅ PASSED: Home requires login!")


# ============================================
# TEST 5: SIGNUP A NEW USER
# ============================================

def test_signup_new_user(client):
    """Test: Create a new user account"""
    print("\n🧪 TEST 5: Signing up a new user...")
    
    # Use a unique username with timestamp to avoid conflicts
    import time
    username = f'testuser_{int(time.time())}'
    
    # Sign up with new user
    response = client.post('/signup', data={
        'username': username,
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'User'
    }, follow_redirects=True)
    
    # Check signup worked
    assert response.status_code == 200
    assert db.user_exists(username)
    print(f"✅ PASSED: New user '{username}' created successfully!")


# ============================================
# TEST 6: LOGIN WITH VALID USER
# ============================================

def test_login_valid_user(client):
    """Test: Login with a user that exists"""
    print("\n🧪 TEST 6: Logging in with valid user...")
    
    # Create a unique test user
    import time
    username = f'logintest_{int(time.time())}'
    password = 'mypassword123'
    
    # Create the user first if doesn't exist
    if not db.user_exists(username):
        db.create_user(username, 'Login', 'Test', password)
    
    # Now try to login
    response = client.post('/login', data={
        'username': username,
        'password': password
    }, follow_redirects=True)
    
    # Check login worked
    assert response.status_code == 200
    print(f"✅ PASSED: User '{username}' logged in successfully!")


# ============================================
# TEST 7: LOGIN WITHOUT SIGNING UP
# ============================================

def test_login_without_signup(client):
    """Test: Login without signup redirects to signup page"""
    print("\n🧪 TEST 7: Trying to login without signing up...")
    
    # Use a username that definitely doesn't exist
    import time
    fake_username = f'nonexistent_{int(time.time())}'
    
    # Try to login with user that doesn't exist
    response = client.post('/login', data={
        'username': fake_username,
        'password': 'somepassword'
    }, follow_redirects=False)
    
    # Should redirect to signup
    assert response.status_code == 302
    assert '/signup' in response.location
    print("✅ PASSED: Non-existent user redirected to signup!")


# ============================================
# TEST 8: WRONG PASSWORD SHOWS ERROR
# ============================================

def test_wrong_password(client):
    """Test: Wrong password shows error message"""
    print("\n🧪 TEST 8: Trying to login with wrong password...")
    
    # Create a test user
    import time
    username = f'wrongpass_{int(time.time())}'
    correct_password = 'correctpass123'
    
    if not db.user_exists(username):
        db.create_user(username, 'Test', 'User', correct_password)
    
    # Try wrong password
    response = client.post('/login', data={
        'username': username,
        'password': 'wrongpassword'
    }, follow_redirects=True)
    
    # Should show error
    assert response.status_code == 200
    assert b'Incorrect password' in response.data
    print("✅ PASSED: Wrong password shows error message!")


# ============================================
# TEST 9: SIGNUP WITH EXISTING USERNAME
# ============================================

def test_signup_existing_user(client):
    """Test: Signing up with existing username shows error"""
    print("\n🧪 TEST 9: Trying to signup with existing username...")
    
    # Create a user first
    import time
    username = f'existing_{int(time.time())}'
    
    if not db.user_exists(username):
        db.create_user(username, 'Existing', 'User', 'password123')
    
    # Try to signup with same username
    response = client.post('/signup', data={
        'username': username,
        'password': 'different',
        'first_name': 'New',
        'last_name': 'User'
    }, follow_redirects=True)
    
    # Should show error
    assert response.status_code == 200
    assert b'User already exists' in response.data or b'Please login' in response.data
    print("✅ PASSED: Existing username shows error!")


# ============================================
# TEST 10: ACCESS HOME AFTER LOGIN
# ============================================

def test_home_after_login(client):
    """Test: Can access home page after logging in"""
    print("\n🧪 TEST 10: Accessing home after login...")
    
    # Create a user
    import time
    username = f'hometest_{int(time.time())}'
    password = 'homepass123'
    
    if not db.user_exists(username):
        db.create_user(username, 'Home', 'Test', password)
    
    # Login first
    client.post('/login', data={
        'username': username,
        'password': password
    })
    
    # Now try to access home
    response = client.get('/home')
    
    # Should work!
    assert response.status_code == 200
    assert username.encode() in response.data
    print("✅ PASSED: Home accessible after login!")


# ============================================
# TEST 11: LOGOUT WORKS
# ============================================

def test_logout(client):
    """Test: Logout removes session and redirects to login"""
    print("\n🧪 TEST 11: Testing logout...")
    
    # Create and login
    import time
    username = f'logouttest_{int(time.time())}'
    password = 'logoutpass123'
    
    if not db.user_exists(username):
        db.create_user(username, 'Logout', 'Test', password)
    
    client.post('/login', data={
        'username': username,
        'password': password
    })
    
    # Logout
    response = client.get('/logout', follow_redirects=False)
    
    # Should redirect to login
    assert response.status_code == 302
    assert '/login' in response.location
    
    # Try to access home after logout
    response = client.get('/home', follow_redirects=False)
    assert response.status_code == 302  # Should redirect
    print("✅ PASSED: Logout works correctly!")


# ============================================
# TEST 12: EMPTY CREDENTIALS
# ============================================

def test_empty_credentials(client):
    """Test: Empty username/password handled gracefully"""
    print("\n🧪 TEST 12: Testing empty credentials...")
    
    response = client.post('/login', data={
        'username': '',
        'password': ''
    }, follow_redirects=True)
    
    # Should handle gracefully (not crash)
    assert response.status_code == 200
    print("✅ PASSED: Empty credentials handled!")


# ============================================
# TEST 13: COMPLETE USER JOURNEY
# ============================================

def test_complete_journey(client):
    """Test: Full journey from signup to login to home to logout"""
    print("\n🧪 TEST 13: Testing complete user journey...")
    
    import time
    username = f'journey_{int(time.time())}'
    password = 'journeypass123'
    
    # Step 1: Signup
    print("  → Step 1: Signing up...")
    response = client.post('/signup', data={
        'username': username,
        'password': password,
        'first_name': 'Journey',
        'last_name': 'Test'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert db.user_exists(username)
    print("  ✓ Signup successful")
    
    # Step 2: Logout
    print("  → Step 2: Logging out...")
    client.get('/logout')
    print("  ✓ Logged out")
    
    # Step 3: Login
    print("  → Step 3: Logging back in...")
    response = client.post('/login', data={
        'username': username,
        'password': password
    }, follow_redirects=True)
    assert response.status_code == 200
    print("  ✓ Login successful")
    
    # Step 4: Access home
    print("  → Step 4: Accessing home page...")
    response = client.get('/home')
    assert response.status_code == 200
    assert username.encode() in response.data
    print("  ✓ Home page accessed")
    
    # Step 5: Logout
    print("  → Step 5: Final logout...")
    response = client.get('/logout', follow_redirects=False)
    assert response.status_code == 302
    print("  ✓ Logout successful")
    
    print("✅ PASSED: Complete journey works!")


if __name__ == '__main__':
    pytest.main([__file__, '-v', '-s'])