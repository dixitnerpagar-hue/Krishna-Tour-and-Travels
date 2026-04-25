"""Backend API tests for Krishn Tour & Travels (iteration 2)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')
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
        d = r.json()
        assert d.get("status") == "running"
        assert "razorpay_enabled" in d
        assert "email_enabled" in d
        # Razorpay should be disabled (placeholder keys), email should be enabled
        assert d["razorpay_enabled"] is False
        assert d["email_enabled"] is True

    def test_public_config(self, api_client):
        r = api_client.get(f"{API}/config")
        assert r.status_code == 200
        d = r.json()
        assert d["upi_id"] == "7600491012@upi"
        assert d["owner_name"] == "Pankaj Gemita"
        assert d["razorpay_enabled"] is False


# ---------- Admin Auth ----------
class TestAdminAuth:
    def test_login_success(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "admin", "password": "admin123"})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d
        assert d["token_type"] == "bearer"

    def test_login_wrong_password(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "admin", "password": "wrong"})
        assert r.status_code == 401

    def test_login_wrong_user(self, api_client):
        r = api_client.post(f"{API}/admin/login", json={"username": "hacker", "password": "admin123"})
        assert r.status_code == 401


# ---------- Bookings ----------
class TestBookings:
    created_id = None

    def test_create_booking_with_new_fields(self, api_client):
        payload = {
            "trip_type": "Round Trip",
            "car_name": "Maruti Swift Dzire",
            "pickup_location": "TEST_Ahmedabad",
            "drop_location": "TEST_Udaipur",
            "pickup_date": "2026-02-01",
            "drop_date": "2026-02-10",
            "pickup_time": "09:00",
            "drop_time": "20:00",
            "duration_days": 9,
            "name": "TEST_Pankaj",
            "phone": "9999999999",
            "email": "test@example.com",
            "passengers": 4,
            "estimated_total": 18000,
            "needs_negotiation": True,
            "self_drive_delivery_km": 0,
        }
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["trip_type"] == "Round Trip"
        assert d["drop_date"] == "2026-02-10"
        assert d["duration_days"] == 9
        assert d["needs_negotiation"] is True
        assert d["payment_status"] == "pending"
        assert d["status"] == "new"
        TestBookings.created_id = d["id"]

    def test_create_self_drive_booking(self, api_client):
        payload = {
            "trip_type": "Self Drive Car",
            "car_name": "Hyundai Aura",
            "self_drive_option": "drop_at_location",
            "self_drive_delivery_km": 12.5,
            "pickup_date": "2026-03-01",
            "drop_date": "2026-03-03",
            "duration_days": 2,
            "name": "TEST_SelfDrive",
            "phone": "8888888888",
        }
        r = api_client.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["self_drive_option"] == "drop_at_location"
        assert d["self_drive_delivery_km"] == 12.5

    def test_get_booking_returns_new_fields(self, api_client):
        bid = TestBookings.created_id
        r = api_client.get(f"{API}/bookings/{bid}")
        assert r.status_code == 200
        d = r.json()
        assert d["id"] == bid
        assert d["drop_date"] == "2026-02-10"
        assert d["duration_days"] == 9
        assert d["needs_negotiation"] is True

    def test_get_booking_not_found(self, api_client):
        r = api_client.get(f"{API}/bookings/does-not-exist-123")
        assert r.status_code == 404

    def test_list_bookings_no_auth(self, api_client):
        r = api_client.get(f"{API}/bookings")
        assert r.status_code in (401, 403)

    def test_list_bookings_admin(self, api_client, admin_headers):
        r = api_client.get(f"{API}/bookings", headers=admin_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_update_status_admin(self, api_client, admin_headers):
        bid = TestBookings.created_id
        r = api_client.patch(f"{API}/bookings/{bid}/status?status_value=confirmed", headers=admin_headers)
        assert r.status_code == 200
        g = api_client.get(f"{API}/bookings/{bid}")
        assert g.json()["status"] == "confirmed"


# ---------- Reviews ----------
class TestReviews:
    def test_create_driver_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "driver", "target_name": "TEST_Driver",
            "reviewer_name": "TEST_R1", "rating": 5, "comment": "Great"
        })
        assert r.status_code == 200
        assert r.json()["rating"] == 5

    def test_create_car_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "car", "target_name": "TEST_Innova",
            "reviewer_name": "TEST_R2", "rating": 4
        })
        assert r.status_code == 200

    def test_create_site_review(self, api_client):
        r = api_client.post(f"{API}/reviews", json={
            "review_type": "site", "reviewer_name": "TEST_R3", "rating": 5
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


# ---------- Car Availability ----------
class TestCarAvailability:
    def test_list_initial(self, api_client):
        r = api_client.get(f"{API}/cars/availability")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_set_availability_requires_auth(self, api_client):
        r = api_client.put(f"{API}/cars/availability/TEST_Car", json={"available": False})
        assert r.status_code in (401, 403)

    def test_set_availability_admin(self, api_client, admin_headers):
        r = api_client.put(
            f"{API}/cars/availability/TEST_Car",
            json={"available": False, "note": "under maintenance"},
            headers=admin_headers,
        )
        assert r.status_code == 200
        d = r.json()
        assert d["ok"] is True
        assert d["car"]["available"] is False

        # GET reflects update
        g = api_client.get(f"{API}/cars/availability")
        assert g.status_code == 200
        cars = g.json()
        match = [c for c in cars if c["car_name"] == "TEST_Car"]
        assert len(match) == 1
        assert match[0]["available"] is False
        assert match[0]["note"] == "under maintenance"

    def test_toggle_back_to_available(self, api_client, admin_headers):
        r = api_client.put(
            f"{API}/cars/availability/TEST_Car",
            json={"available": True, "note": None},
            headers=admin_headers,
        )
        assert r.status_code == 200
        g = api_client.get(f"{API}/cars/availability")
        match = [c for c in g.json() if c["car_name"] == "TEST_Car"]
        assert match[0]["available"] is True


# ---------- Payments ----------
class TestPayments:
    def test_create_order_falls_back_to_upi(self, api_client):
        bid = TestBookings.created_id
        assert bid
        r = api_client.post(f"{API}/payments/create-order", json={
            "booking_id": bid, "amount_inr": 9000
        })
        assert r.status_code == 200
        d = r.json()
        # Razorpay placeholder => method should be upi
        assert d["method"] == "upi"
        assert d["upi_id"] == "7600491012@upi"
        assert d["amount"] == 9000

    def test_create_order_unknown_booking(self, api_client):
        r = api_client.post(f"{API}/payments/create-order", json={
            "booking_id": "non-existent-id", "amount_inr": 100
        })
        assert r.status_code == 404

    def test_verify_disabled_when_razorpay_off(self, api_client):
        r = api_client.post(f"{API}/payments/verify", json={
            "booking_id": "x", "razorpay_order_id": "o",
            "razorpay_payment_id": "p", "razorpay_signature": "s"
        })
        assert r.status_code == 400

    def test_upi_notify_updates_booking(self, api_client):
        bid = TestBookings.created_id
        r = api_client.post(f"{API}/payments/upi-notify", json={
            "booking_id": bid, "amount": 9000
        })
        assert r.status_code == 200
        # Verify persistence
        g = api_client.get(f"{API}/bookings/{bid}")
        b = g.json()
        assert b["payment_status"] == "advance_paid"
        assert b["payment_method"] == "upi_pending_verify"
        assert b["advance_paid"] == 9000

    def test_upi_notify_unknown_booking(self, api_client):
        r = api_client.post(f"{API}/payments/upi-notify", json={
            "booking_id": "missing-id", "amount": 100
        })
        assert r.status_code == 404


# ---------- Admin Stats ----------
class TestAdminStats:
    def test_stats_requires_auth(self, api_client):
        r = api_client.get(f"{API}/admin/stats")
        assert r.status_code in (401, 403)

    def test_stats_includes_paid(self, api_client, admin_headers):
        r = api_client.get(f"{API}/admin/stats", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("total_bookings", "new_bookings", "today_bookings", "total_reviews", "paid_bookings"):
            assert k in d, f"missing {k}"
            assert isinstance(d[k], int)
        # We marked at least one booking as advance_paid above
        assert d["paid_bookings"] >= 1


# ---------- Cleanup ----------
class TestCleanup:
    def test_delete_test_booking(self, api_client, admin_headers):
        bid = TestBookings.created_id
        if not bid:
            pytest.skip("no booking id")
        r = api_client.delete(f"{API}/bookings/{bid}", headers=admin_headers)
        assert r.status_code == 200
        g = api_client.get(f"{API}/bookings/{bid}")
        assert g.status_code == 404
