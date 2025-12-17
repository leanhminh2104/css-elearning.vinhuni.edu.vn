from flask import Flask, request, jsonify
import requests
import uuid
import base64
import json
from bs4 import BeautifulSoup

app = Flask(__name__)

LOGIN_BASE = "https://login.vinhuni.edu.vn"
PORTAL = "https://congsv.vinhuni.edu.vn"
API_BALANCE = "https://usmart.vinhuni.edu.vn/gwsg/dbtaichinh_sv/tbl_NguoiHoc_ViTien/GetSoDuTaiKhoan"


def gen_lip():
    return f"{uuid.uuid4()}.local"


def gen_trace():
    return str(uuid.uuid4())


def decode_jwt_no_verify(token):
    payload = token.split('.')[1]
    payload += '=' * (-len(payload) % 4)
    return json.loads(base64.urlsafe_b64decode(payload))


def get_public_ip():
    return requests.get("https://api.ipify.org").text.strip()


@app.route("/")
def home():
    return "OK - VinUni Balance API"


@app.route("/balance")
def get_balance():
    USERNAME = request.args.get("user")
    PASSWORD = request.args.get("pass")

    if not USERNAME or not PASSWORD:
        return jsonify({"error": "Thiếu user hoặc pass"}), 400

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "vi,en-US;q=0.8",
    })

    # STEP 1: GET LOGIN PAGE
    r1 = session.get(
        f"{LOGIN_BASE}/Account/Login",
        params={"ReturnUrl": "/connect/authorize/callback"}
    )

    soup = BeautifulSoup(r1.text, "html.parser")
    csrf = soup.find("input", {"name": "__RequestVerificationToken"})
    if not csrf:
        return jsonify({"error": "Không lấy được CSRF"}), 500
    csrf = csrf["value"]

    # STEP 2: POST LOGIN
    login_data = {
        "ReturnUrl": "/connect/authorize/callback"
                     "?response_type=id_token%20token"
                     "&client_id=e-university"
                     "&redirect_uri=https%3A%2F%2Fcongsv.vinhuni.edu.vn"
                     "&scope=openid%20profile%20email",
        "FromApp": "False",
        "Username": USERNAME,
        "Password": PASSWORD,
        "button": "login",
        "__RequestVerificationToken": csrf,
    }

    session.post(
        f"{LOGIN_BASE}/Account/Login",
        data=login_data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": LOGIN_BASE,
            "Referer": r1.url,
        },
        allow_redirects=True
    )

    # STEP 3: CALLBACK
    r3 = session.get(
        f"{LOGIN_BASE}/connect/authorize/callback",
        params={
            "response_type": "id_token token",
            "client_id": "e-university",
            "redirect_uri": PORTAL,
            "scope": "openid profile email",
            "nonce": str(uuid.uuid4()),
            "state": str(uuid.uuid4()),
        },
        allow_redirects=True
    )

    if "#" not in r3.url:
        return jsonify({"error": "Account không trả token (code-flow)"}), 403

    fragment = r3.url.split("#", 1)[1]
    params = dict(p.split("=", 1) for p in fragment.split("&"))
    JWT = params.get("access_token") or params.get("id_token")

    if not JWT:
        return jsonify({"error": "Không tìm thấy JWT"}), 500

    payload = decode_jwt_no_verify(JWT)
    USER_ID = payload.get("userid") or payload.get("sub")

    headers = {
        "Accept": "application/json, text/plain, */*",
        "Authorization": f"Bearer {JWT}",
        "User-Id": str(USER_ID),
        "LIP": gen_lip(),
        "TraceId": gen_trace(),
        "PIP": get_public_ip(),
        "PortalAlias": PORTAL,
        "Origin": PORTAL,
        "Referer": f"{PORTAL}/",
        "User-Agent": session.headers["User-Agent"],
    }

    res = requests.get(API_BALANCE, headers=headers)
    data = res.json()

    return jsonify({
        "success": True,
        "tongTien": data.get("data", {}).get("tongTien")
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
