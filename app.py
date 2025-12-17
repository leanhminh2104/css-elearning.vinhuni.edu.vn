from flask import Flask, request, jsonify, render_template_string
import requests
import uuid
import base64
import json
from bs4 import BeautifulSoup

app = Flask(__name__)

LOGIN_BASE = "https://login.vinhuni.edu.vn"
PORTAL = "https://congsv.vinhuni.edu.vn"
API_BALANCE = "https://usmart.vinhuni.edu.vn/gwsg/dbtaichinh_sv/tbl_NguoiHoc_ViTien/GetSoDuTaiKhoan"

# HTML Template cho giao diện web
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VinUni Balance Checker</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #3498db;
            --secondary: #2c3e50;
            --success: #2ecc71;
            --danger: #e74c3c;
            --light: #ecf0f1;
            --dark: #2c3e50;
            --shadow: 0 4px 6px rgba(0,0,0,0.1);
            --radius: 10px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            width: 100%;
        }
        
        .header {
            background: white;
            border-radius: var(--radius) var(--radius) 0 0;
            padding: 30px;
            text-align: center;
            box-shadow: var(--shadow);
        }
        
        .header h1 {
            color: var(--secondary);
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        
        .header p {
            color: #7f8c8d;
            font-size: 1.1rem;
        }
        
        .content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            background: white;
            border-radius: 0 0 var(--radius) var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        
        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
        }
        
        .form-section, .result-section {
            padding: 30px;
        }
        
        .form-section {
            background: var(--light);
        }
        
        .form-title, .result-title {
            color: var(--secondary);
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(0,0,0,0.1);
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 15px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
        }
        
        .btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .btn:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
        
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .alert-success {
            background: rgba(46, 204, 113, 0.1);
            border-left: 4px solid var(--success);
            color: #27ae60;
        }
        
        .alert-error {
            background: rgba(231, 76, 60, 0.1);
            border-left: 4px solid var(--danger);
            color: #c0392b;
        }
        
        .balance-display {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, var(--primary), #2980b9);
            border-radius: var(--radius);
            color: white;
            margin-bottom: 30px;
        }
        
        .balance-amount {
            font-size: 3.5rem;
            font-weight: 800;
            margin: 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .loading {
            text-align: center;
            padding: 30px;
            display: none;
        }
        
        .loading.active {
            display: block;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .api-info {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        
        .api-link {
            word-break: break-all;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            margin-top: 10px;
            font-size: 0.85rem;
        }
        
        .result-placeholder {
            text-align: center;
            padding: 60px 20px;
            color: #95a5a6;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-university"></i> VinUni Balance Checker</h1>
            <p>Kiểm tra số dư tài khoản sinh viên Đại học Vinh</p>
        </div>
        
        <div class="content">
            <!-- Form Section -->
            <div class="form-section">
                <h2 class="form-title"><i class="fas fa-sign-in-alt"></i> Đăng Nhập</h2>
                
                {% if error %}
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    {{ error }}
                </div>
                {% endif %}
                
                {% if success %}
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i>
                    Kết nối thành công!
                </div>
                {% endif %}
                
                <form method="GET" action="/" id="balanceForm">
                    <div class="form-group">
                        <label class="form-label" for="user">
                            <i class="fas fa-user-graduate"></i> Mã Sinh Viên
                        </label>
                        <input type="text" 
                               id="user" 
                               name="user" 
                               class="form-input"
                               value="{{ user or '' }}"
                               placeholder="VD: 245751020510150"
                               required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="pass">
                            <i class="fas fa-lock"></i> Mật Khẩu
                        </label>
                        <input type="password" 
                               id="pass" 
                               name="pass" 
                               class="form-input"
                               placeholder="Nhập mật khẩu"
                               required>
                    </div>
                    
                    <button type="submit" class="btn" id="submitBtn">
                        <i class="fas fa-search-dollar"></i> Kiểm Tra Số Dư
                    </button>
                </form>
                
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p><strong>Đang kết nối đến Đại học Vinh...</strong></p>
                    <p>Vui lòng chờ trong giây lát</p>
                </div>
                
                <div class="api-info">
                    <p><i class="fas fa-info-circle"></i> <strong>Thông tin API:</strong></p>
                    <p>Endpoint: <code>/balance?user=USER&pass=PASS</code></p>
                    <p>Method: GET</p>
                    <p>Response: JSON</p>
                    <div class="api-link">
                        {{ request.host_url }}balance?user=245751020510150&pass=21042006minh
                    </div>
                </div>
            </div>
            
            <!-- Result Section -->
            <div class="result-section">
                <h2 class="result-title"><i class="fas fa-wallet"></i> Kết Quả</h2>
                
                {% if success and tongTien is not none %}
                <div class="balance-display">
                    <div style="font-size: 1.1rem; opacity: 0.9;">Số dư hiện tại</div>
                    <div class="balance-amount">{{ "{:,.0f}".format(tongTien) }} ₫</div>
                    <div style="font-size: 0.9rem; opacity: 0.8;">
                        <i class="far fa-clock"></i>
                        {{ timestamp }}
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3 style="margin-bottom: 10px; color: var(--dark);">
                        <i class="fas fa-code"></i> Raw JSON Response
                    </h3>
                    <pre style="background: #f8f9fa; padding: 15px; border-radius: 6px; overflow: auto; max-height: 200px; font-size: 0.85rem;">
{{ json_response }}
                    </pre>
                </div>
                {% else %}
                <div class="result-placeholder">
                    <i class="fas fa-wallet" style="font-size: 4rem; opacity: 0.3; margin-bottom: 20px;"></i>
                    <p>Thông tin số dư sẽ hiển thị tại đây</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">
                        Nhập thông tin đăng nhập và nhấn "Kiểm Tra Số Dư"
                    </p>
                </div>
                {% endif %}
            </div>
        </div>
        
        <div class="footer">
            <p>VinUni Balance API &copy; 2024 - Đại học Vinh</p>
            <p>Render: <code>css-elearning-vinhuni-edu-vn.onrender.com</code></p>
        </div>
    </div>
    
    <script>
        // Form Submission Handler
        const balanceForm = document.getElementById('balanceForm');
        const loadingElement = document.getElementById('loading');
        const submitBtn = document.getElementById('submitBtn');
        
        balanceForm.addEventListener('submit', function(e) {
            // Kiểm tra nếu đã có tham số trong URL thì không hiển thị loading
            // (vì sẽ reload trang với tham số)
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
            loadingElement.classList.add('active');
        });
        
        // Auto-focus on user field
        document.addEventListener('DOMContentLoaded', function() {
            const userField = document.getElementById('user');
            if (userField && !userField.value) {
                userField.focus();
            }
        });
        
        // Reset button state after 30 seconds (fallback)
        setTimeout(function() {
            if (submitBtn.disabled) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-search-dollar"></i> Kiểm Tra Số Dư';
                loadingElement.classList.remove('active');
            }
        }, 30000);
    </script>
</body>
</html>
"""

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

def get_balance_internal(username, password):
    """Hàm nội bộ để lấy số dư từ hệ thống VinUni"""
    try:
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/143.0.0.0",
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
            return {"error": "Không lấy được CSRF token"}, 500
        csrf = csrf["value"]

        # STEP 2: POST LOGIN
        login_data = {
            "ReturnUrl": "/connect/authorize/callback"
                         "?response_type=id_token%20token"
                         "&client_id=e-university"
                         "&redirect_uri=https%3A%2F%2Fcongsv.vinhuni.edu.vn"
                         "&scope=openid%20profile%20email",
            "FromApp": "False",
            "Username": username,
            "Password": password,
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
            return {"error": "Không lấy được token (callback không có fragment)"}, 403

        fragment = r3.url.split("#", 1)[1]
        params = dict(p.split("=", 1) for p in fragment.split("&"))
        JWT = params.get("access_token") or params.get("id_token")

        if not JWT:
            return {"error": "Không tìm thấy JWT"}, 500

        # STEP 4: BUILD HEADERS & CALL BALANCE API
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
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
        }

        res = requests.get(API_BALANCE, headers=headers)
        data = res.json()
        tong_tien = data.get("data", {}).get("tongTien")
        
        return {"success": True, "tongTien": tong_tien}, 200
        
    except Exception as e:
        return {"error": f"Lỗi hệ thống: {str(e)}"}, 500

@app.route("/")
def home():
    """Route chính: hiển thị giao diện web hoặc trả về JSON nếu có tham số"""
    user = request.args.get("user")
    password = request.args.get("pass")
    
    # Nếu có tham số user và pass, xử lý như API
    if user and password:
        result, status_code = get_balance_internal(user, password)
        
        # Kiểm tra xem client muốn HTML hay JSON
        accept_header = request.headers.get('Accept', '')
        if 'text/html' in accept_header and 'application/json' not in accept_header:
            # Client muốn HTML, render template với kết quả
            return render_template_string(HTML_TEMPLATE, 
                user=user,
                success=status_code == 200,
                error=result.get('error') if status_code != 200 else None,
                tongTien=result.get('tongTien'),
                timestamp=datetime.now().strftime("%H:%M %d/%m/%Y"),
                json_response=json.dumps(result, indent=2, ensure_ascii=False)
            )
        else:
            # Mặc định trả về JSON
            return jsonify(result), status_code
    else:
        # Không có tham số, hiển thị giao diện web
        return render_template_string(HTML_TEMPLATE, 
            user=None,
            success=False,
            error=None,
            tongTien=None,
            timestamp=datetime.now().strftime("%H:%M %d/%m/%Y"),
            json_response='{}'
        )

@app.route("/balance")
def get_balance():
    """API endpoint chỉ trả về JSON"""
    USERNAME = request.args.get("user")
    PASSWORD = request.args.get("pass")

    if not USERNAME or not PASSWORD:
        return jsonify({"error": "Thiếu tham số user hoặc pass"}), 400

    result, status_code = get_balance_internal(USERNAME, PASSWORD)
    return jsonify(result), status_code

@app.route("/health")
def health_check():
    """Endpoint kiểm tra tình trạng service"""
    return jsonify({"status": "healthy", "service": "VinUni Balance API"}), 200

if __name__ == "__main__":
    from datetime import datetime
    app.run(host="0.0.0.0", port=10000, debug=True)
