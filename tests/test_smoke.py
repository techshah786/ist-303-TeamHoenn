from app import create_app

def test_index():
    c = create_app().test_client()
    r = c.get("/")
    assert r.status_code == 200
    assert b"Finance Tracker" in r.data
