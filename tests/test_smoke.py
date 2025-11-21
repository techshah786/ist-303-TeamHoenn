from app import create_app

def test_index():
    """Test that the index route returns successfully"""
    c = create_app().test_client()
    r = c.get("/")
    assert r.status_code == 200
    assert b"Financial Tracker" in r.data  # Fixed: was "Finance Tracker"
