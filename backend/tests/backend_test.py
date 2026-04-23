"""Backend API tests for Krishna Tour & Travels."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://sedan-booking-hub.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api_client):
    r = api_client.post(f"{API}/admin/login", json={"username": "admin", "password": "admin123"})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "status" in data or "message" in data


# ---------- Admin Auth ----------
class TestAdminAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "admin", "password": "admin123"})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d
        assert d["token_type"] == "bearer"
        assert len(d["access_token"]) > 10

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "admin", "password": "wrong"})
        assert r.status_code == 401

    def test_login_wrong_user(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "hacker", "password": "admin123"})
        assert r.status_code == 401


# ---------- Bookings ----------
class TestBookings:
    created_id = None

    def test_create_booking_no_auth(self, api_client):
        payload = {
            "trip_type": "Car with Driver",
            "pickup_location": "TEST_Pune Airport",
            "drop_location": "TEST_Mumbai Airport",
            "pickup_date": "2026-02-01",
            "pickup_time": "09:00",
            "drop_time": "13:00",
            "name": "TEST_User",
            "phone": "9999999999",
            "email": "test@test.com",
            "passengers": 2,
        }
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data
        assert data["trip_type"] == "Car with Driver"
        assert data["pickup_location"] == "TEST_Pune Airport"
        assert data["status"] == "new"
        TestBookings.created_id = data["id"]

    def test_get_booking_by_id(self, api_client):
        assert TestBookings.created_id, "no booking created"
        r = api_client.get(f"{API}/bookings/{TestBookings.created_id}")
        assert r.status_code == 200
        assert r.json()["id"] == TestBookings.created_id

    def test_get_booking_not_found(self, api_client):
        r = api_client.get(f"{API}/bookings/does-not-exist-123")
        assert r.status_code == 404

    def test_list_bookings_no_auth(self, api_client):
        r = api_client.get(f"{API}/bookings")
        assert r.status_code in (401, 403)

    def test_list_bookings_with_admin(self, api_client, admin_headers):
        r = api_client.get(f"{API}/bookings", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert any(b["id"] == TestBookings.created_id for b in r.json())

    def test_update_booking_status(self, api_client, admin_headers):
        bid = TestBookings.created_id
        r = api_client.patch(f"{API}/bookings/{bid}/status?status_value=confirmed", headers=admin_headers)
        assert r.status_code == 200
        # verify persistence
        g = api_client.get(f"{API}/bookings/{bid}")
        assert g.json()["status"] == "confirmed"

    def test_update_status_requires_auth(self, api_client):
        bid = TestBookings.created_id
        r = api_client.patch(f"{API}/bookings/{bid}/status?status_value=cancelled")
        assert r.status_code in (401, 403)

    def test_delete_booking_requires_auth(self, api_client):
        bid = TestBookings.created_id
        r = api_client.delete(f"{API}/bookings/{bid}")
        assert r.status_code in (401, 403)

    def test_delete_booking(self, api_client, admin_headers):
        bid = TestBookings.created_id
        r = api_client.delete(f"{API}/bookings/{bid}", headers=admin_headers)
        assert r.status_code == 200
        # verify
        g = api_client.get(f"{API}/bookings/{bid}")
        assert g.status_code == 404


# ---------- Reviews ----------
class TestReviews:
    ids = []

    def test_create_driver_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "driver", "target_name": "TEST_Driver Ramesh",
            "reviewer_name": "TEST_User1", "rating": 5, "comment": "Great!"
        })
        assert r.status_code == 200
        d = r.json()
        assert d["review_type"] == "driver"
        assert d["rating"] == 5
        TestReviews.ids.append(d["id"])

    def test_create_car_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "car", "target_name": "TEST_Swift",
            "reviewer_name": "TEST_User2", "rating": 4, "comment": "Smooth"
        })
        assert r.status_code == 200
        assert r.json()["review_type"] == "car"

    def test_create_site_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "site", "reviewer_name": "TEST_User3", "rating": 5
        })
        assert r.status_code == 200

    def test_rating_out_of_range(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "site", "reviewer_name": "TEST_Bad", "rating": 10
        })
        assert r.status_code in (400, 422)

    def test_list_reviews(self, api_client):
        r = api_client.get(f"{API}/reviews")
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert len(r.json()) >= 3

    def test_filter_driver_reviews(self, api_client):
        r = api_client.get(f"{API}/reviews?review_type=driver")
        assert r.status_code == 200
        for rev in r.json():
            assert rev["review_type"] == "driver"


# ---------- Admin Stats ----------
class TestAdminStats:
    def test_stats_requires_auth(self, api_client):
        r = api_client.get(f"{API}/admin/stats")
        assert r.status_code in (401, 403)

    def test_stats_with_admin(self, api_client, admin_headers):
        r = api_client.get(f"{API}/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("total_bookings", "new_bookings", "today_bookings", "total_reviews"):
            assert k in d
            assert isinstance(d[k], int)
