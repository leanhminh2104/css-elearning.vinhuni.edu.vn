// ==UserScript==
// @name         Xóa Banner iSpring (VinhUni Only - Exact Match)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Xóa chính xác 100% banner trial iSpring trên trang elearning.vinhuni.edu.vn
// @author       Gemini
// @match        https://elearning.vinhuni.edu.vn/mod/scorm/player.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Hàm xóa banner với độ chính xác tuyệt đối
    function removeSpecificBanner() {
        // 1. Tìm tất cả các thẻ DIV có class và aria-label khớp
        const selector = 'div.trial_banner[aria-label="Được tạo bằng phiên bản đánh giá iSpring."][role="banner"]';
        const candidates = document.querySelectorAll(selector);

        candidates.forEach(element => {
            // 2. KIỂM TRA PHỤ: So sánh style inline để chắc chắn 100% là nó
            // Code gốc bạn đưa: width: 256px; height: 80px;
            if (element.style.width === '256px' && element.style.height === '80px') {
                element.remove();
                console.log('Gemini: Đã xóa banner iSpring chính xác.');
            }
        });
    }

    // Chạy lần đầu ngay khi script load
    removeSpecificBanner();

    // 3. Cài đặt "Lính gác" (Observer) để canh chừng
    // Nếu trang web tải nội dung động (loading), lính gác sẽ phát hiện banner mới và xóa ngay
    const observer = new MutationObserver((mutations) => {
        removeSpecificBanner();
    });

    // Bắt đầu canh gác toàn bộ body của trang web
    observer.observe(document.body, {
        childList: true, // Theo dõi thêm/bớt phần tử con
        subtree: true    // Theo dõi sâu vào bên trong tất cả các thẻ con
    });

})();
