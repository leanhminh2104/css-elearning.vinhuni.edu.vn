// ==UserScript==
// @name         VinhUni E-learning — Custom UI (Teal/Violet)
// @namespace    Menu VinhUni E-learning — Custom UI (Teal/Violet) 
// @version      1.3.0
// @description  Nâng cấp giao diện: header dark-glass, menubar, sidebar, tabs, card, mini-calendar, tiến độ SVG, sửa ảnh/placeholder và văn bản.
// @description:vi Nâng cấp giao diện tổng thể, đồng bộ màu xanh ngọc–tím, tối ưu khả năng đọc và tương tác.
// @author       LAMDev - DICHVUSALE.IO.VN
// @license      MIT
// @match        *://elearning.vinhuni.edu.vn/*
// @match        *://congsv.vinhuni.edu.vn/*
// @icon         https://elearning.vinhuni.edu.vn/pluginfile.php/1/theme_klass/logo/1736161506/logo.png
// @homepageURL  https://elearning.vinhuni.edu.vn/
// @supportURL   https://elearning.vinhuni.edu.vn/guide/
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
   *           CSS
   * ========================= */
  const css = `
  body {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'), auto;
        }

  a, button, input, select {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>'), pointer;
        }
/* ==== COURSE CONTENT CARD ==== */
.card.card-block {
  background: rgba(15,23,42,0.85); /* dark glass */
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,.35);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
}

/* Tiêu đề (Quá trình học, Tổng quan, Chương...) */
.card.card-block h2,
.card.card-block h3.sectionname a {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 8px 0 12px;
  display: inline-block;
  background: linear-gradient(90deg,#38bdf8,#a78bfa,#7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

/* Danh sách section */
.course-content .section {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
  transition: all .25s ease;
}
.course-content .section:hover {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.18);
  transform: translateY(-2px);
}

/* Tiêu đề chương */
.course-content .section h3.sectionname a {
  font-size: 1.05rem;
  font-weight: 700;
}

/* Danh sách hoạt động */
.course-content .activity {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  margin: 8px 0;
  padding: 8px 12px;
  transition: background .2s ease, transform .2s ease;
}
.course-content .activity:hover {
  background: rgba(255,255,255,.08);
  transform: translateX(3px);
}

/* Icon hoạt động */
.course-content .activity img.activityicon {
  width: 22px;
  height: 22px;
  margin-right: 8px;
  filter: drop-shadow(0 0 3px rgba(0,0,0,.3));
}

/* Tên hoạt động */
.course-content .activity .instancename {
  font-weight: 600;
  color: #f1f5f9;
  transition: color .2s ease;
}
.course-content .activity:hover .instancename {
  color: #38bdf8;
}

/* Ghi chú / mô tả dưới link */
.course-content .activity .contentafterlink,
.course-content .activity .no-overflow {
  font-size: .9rem;
  color: #94a3b8;
  margin-top: 4px;
}

/* Nút hoàn thành */
.course-content .activity .actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: transform .2s ease;
}
.course-content .activity .actions button:hover {
  transform: scale(1.15);
}


/* --- vinhuni-elearning.css --- */

/* ==== CARD BLOCK (header) ==== */
.card-block{
  background: linear-gradient(145deg,#ffffff,#f8fafc);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: transform .4s ease, box-shadow .4s ease;
  z-index:0;
}
.card-block::before{
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none; /* không chặn click */
  background:
    radial-gradient(1000px 400px at -10% -20%, rgba(139,92,246,.10), transparent 60%),
    radial-gradient(800px 300px at 110% 120%, rgba(59,130,246,.10), transparent 60%);
  opacity:.9;
  transition: opacity .4s ease;
}
.card-block:hover{ transform: translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,.12); }
.card-block:hover::before{ opacity:1; }

/* ==== HEADER LAYOUT ==== */
.page-context-header{
  display:flex; align-items:center; gap:18px;
  position:relative; z-index:1;
}

/* ==== AVATAR: CHỈ thay ảnh trong page-context-header ==== */
.page-context-header .page-header-image img.userpicture.defaultuserpic{
  content:url("https://i.pinimg.com/736x/4f/cf/9a/4fcf9a03d5adb6a917e63fafb349f95c.jpg") !important;
  width:100px !important; height:100px !important; border-radius:50% !important; object-fit:cover;
  box-shadow: 0 0 0 3px #fff, 0 0 0 6px #a78bfa, 0 10px 20px rgba(0,0,0,.15);
  transition: transform .35s ease, box-shadow .35s ease;
}
.page-context-header .page-header-image img.userpicture.defaultuserpic:hover{
  transform:scale(1.06);
  box-shadow: 0 0 0 3px #fff, 0 0 0 6px #7c3aed, 0 14px 26px rgba(0,0,0,.2);
}

/* ==== HEADING ==== */
.page-header-headings h1{
  margin:0; font-size:1.6rem; font-weight:800; letter-spacing:.2px; position:relative;
  background: linear-gradient(90deg,#7c3aed,#3b82f6,#a78bfa);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.page-header-headings h1::after{
  content:""; position:absolute; left:0; bottom:-6px; width:50%; height:3px; border-radius:2px;
  background: linear-gradient(90deg,#7c3aed,#3b82f6); transition: width .35s ease;
}
.card-block:hover .page-header-headings h1::after{ width:100%; }

/* ==== SETTINGS ICON ==== */
.context-header-settings-menu{
  margin-left:auto; font-size:1.3rem; color:#94a3b8; cursor:pointer;
  transition: color .25s ease, transform .25s ease;
}
.context-header-settings-menu:hover{ color:#7c3aed; transform:rotate(90deg); }

/* =========================
 *      COURSE CARD UI
 * ========================= */
.courses-view-course-item{
  border:none; border-radius:18px; background:#fff;
  box-shadow:0 6px 16px rgba(0,0,0,.08);
  transition: transform .3s ease, box-shadow .3s ease;
  overflow:hidden; position:relative;
}
.courses-view-course-item:hover{ transform:translateY(-6px); box-shadow:0 12px 28px rgba(0,0,0,.12); }

.course-info-container{ padding:20px; display:flex; flex-direction:column; gap:10px; }

/* ==== PROGRESS DOUGHNUT (SVG) ==== */
.progress-chart-container{ display:flex; justify-content:center; align-items:center; }
.progress-doughnut{ position:relative; width:70px; height:70px; }
.progress-doughnut .progress-text{
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  font-weight:700; font-size:.9rem; color:#0f172a;
}
.progress-indicator circle{
  fill:none; stroke-width:6; stroke-linecap:round;
  stroke:#7c3aed;
  transform:rotate(-90deg); transform-origin:center;
  transition: stroke-dashoffset 1s ease;
}

/* ==== COURSE TITLE ==== */
.courses-view-course-item h4 a{
  font-size:1.05rem; font-weight:700; text-decoration:none;
  background: linear-gradient(90deg,#7c3aed,#3b82f6,#06b6d4);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  transition: opacity .25s ease;
}
.courses-view-course-item h4 a:hover{ opacity:.75; }

/* ==== MUTED TEXT ==== */
.courses-view-course-item .text-muted{ font-size:.85rem; color:#64748b !important; }

/* ==== NAV TABS ==== */
#block-myoverview-view-choices-68cbfe1785e8d68cbfe175111b3 {
  border-bottom:none;
  display:flex;
  gap:8px;
  margin-bottom:16px;
  position:relative;
  z-index:2; /* trên overlay */
}
#block-myoverview-view-choices-68cbfe1785e8d68cbfe175111b3 .nav-item{ list-style:none; }
#block-myoverview-view-choices-68cbfe1785e8d68cbfe175111b3 .nav-link{
  display:block;
  padding:10px 18px;
  border-radius:12px;
  font-weight:600;
  font-size:.95rem;
  color:#475569;
  background:#f1f5f9;
  border:none;
  transition:all .3s ease;
}
#block-myoverview-view-choices-68cbfe1785e8d68cbfe175111b3 .nav-link:hover{
  background:#e2e8f0; color:#0ea5e9;
}
#block-myoverview-view-choices-68cbfe1785e8d68cbfe175111b3 .nav-link.active{
  color:#fff;
  background:linear-gradient(90deg,#7c3aed,#3b82f6,#06b6d4);
  box-shadow:0 4px 12px rgba(0,0,0,.12);
}

/* ==== CARD TITLE ==== */
#instance-8-header.card-title{
  font-size:1.3rem; font-weight:700; color:#0f172a; margin-bottom:20px; position:relative;
  background:linear-gradient(90deg,#7c3aed,#3b82f6,#06b6d4);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
#instance-8-header.card-title::after{
  content:""; position:absolute; left:0; bottom:-6px;
  width:50px; height:3px; border-radius:2px;
  background:linear-gradient(90deg,#7c3aed,#3b82f6);
}

/* ===== EVENT LIST: quá hạn gần đây ===== */

/* Nhóm container */
[data-region="event-list-group-container"]{
  padding: 12px 0;
}

/* Tiêu đề nhóm */
[data-region="event-list-group-container"] > h5.h6.text-danger{
  margin: 8px 0 12px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: .3px;
  color: #ef4444 !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
[data-region="event-list-group-container"] > h5.h6.text-danger strong{
  background: rgba(239,68,68,.08);
  color:#ef4444;
  padding: 6px 10px;
  border-radius: 999px;
}

/* Danh sách */
ul.list-group.unstyled[data-region="event-list"]{
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

/* Mỗi item */
ul.list-group.unstyled[data-region="event-list"] .list-group-item.event-list-item{
  border: none;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,.06);
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
  position: relative;
  overflow: hidden;
}
ul.list-group.unstyled[data-region="event-list"] .list-group-item.event-list-item::before{
  content:"";
  position:absolute; inset:0 0 0 auto; width:4px;
  background: linear-gradient(180deg,#ef4444,#f59e0b);
  border-radius: 4px 0 0 4px;
  opacity:.85;
}
ul.list-group.unstyled[data-region="event-list"] .list-group-item.event-list-item:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0,0,0,.10);
  background: #fbfbff;
}

/* Bố cục cột giữ nguyên cấu trúc */
ul.list-group.unstyled[data-region="event-list"] .row{
  align-items: center;
  margin-left: 0; margin-right: 0;
}

/* Icon hoạt động */
ul.list-group.unstyled[data-region="event-list"] .event-icon{
  width: 44px; height: 44px;
  display: inline-flex; justify-content: center; align-items: center;
  vertical-align: middle;
  margin-right: 10px;
  background: radial-gradient(120% 120% at 20% 20%, #fee2e2 0%, #ffe4e6 45%, #fff 100%);
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(239,68,68,.18);
}
ul.list-group.unstyled[data-region="event-list"] .event-icon .icon{
  width: 22px; height: 22px;
  object-fit: contain;
  filter: hue-rotate(-10deg) saturate(1.1);
}

/* Tên sự kiện và môn học */
ul.list-group.unstyled[data-region="event-list"] .event-name{
  font-weight: 700;
  color: #0f172a;
  max-width: 100%;
  text-decoration: none;
  transition: color .2s ease, opacity .2s ease;
}
ul.list-group.unstyled[data-region="event-list"] .event-name:hover{
  color: #7c3aed;
}
ul.list-group.unstyled[data-region="event-list"] .event-name-container p.small{
  margin-top: 2px;
  color: #64748b !important;
}

/* Ngày giờ */
ul.list-group.unstyled[data-region="event-list"] .text-xs-right,
ul.list-group.unstyled[data-region="event-list"] .text-lg-left{
  font-weight: 600;
  color:#0f172a;
}

/* Link hành động (Nạp bài) */
ul.list-group.unstyled[data-region="event-list"] .col-lg-7 a{
  display: inline-block;
  padding: 8px 12px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  background: #f1f5f9;
  color: #0f172a;
  transition: background .2s ease, color .2s ease, transform .2s ease;
}
ul.list-group.unstyled[data-region="event-list"] .col-lg-7 a:hover{
  background: linear-gradient(90deg,#7c3aed,#3b82f6);
  color:#fff;
  transform: translateY(-1px);
}

/* Truncate đẹp hơn */
ul.list-group.unstyled[data-region="event-list"] .text-truncate{
  mask-image: linear-gradient(90deg,#000 85%, transparent);
}

/* Responsive tinh tế */
@media (max-width: 767.98px){
  ul.list-group.unstyled[data-region="event-list"] .list-group-item.event-list-item{
    padding: 12px;
  }
  ul.list-group.unstyled[data-region="event-list"] .event-icon{
    width: 40px; height: 40px; border-radius: 10px;
  }
  ul.list-group.unstyled[data-region="event-list"] .col-lg-7 a{
    padding: 7px 10px; border-radius: 9px;
  }
}

/* Thay ảnh placeholder */
.text-xs-center .empty-placeholder-image-lg {
  content: url("https://i.pinimg.com/236x/15/96/7f/15967fde86bbc38af6a90170fbb612f9.jpg") !important;
  max-width: 220px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,.15);
}

/* Ẩn chữ gốc chắc chắn */
body .text-xs-center .text-muted.m-t-1{
  font-size: 0 !important;          /* ẩn nội dung thật */
  line-height: 1.6;
  text-align: center;
}

/* Chữ thay thế có xuống dòng */
body .text-xs-center .text-muted.m-t-1::before{
  content: "Tương lai có em \A Tương lai Lê Anh Minh sẽ là Chủ tịch";
  white-space: pre-line;             /* kích hoạt \A */
  display: inline-block;
  font-size: 1rem;                   /* kích thước hiển thị mới */
  font-weight: 600;
  color: #7c3aed;
}

/* Fallback nếu ::before bị ghi đè */
body .text-xs-center .text-muted.m-t-1::after{
  content: "Tương lai có em \A Tương lai Lê Anh Minh sẽ là Chủ tịch";
  white-space: pre-line;
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  color: #7c3aed;
}


/* ===== NAV DRAWER — modern, không đổi cấu trúc gốc ===== */

/* Drawer shell */
#nav-drawer[data-region="drawer"]{
  width: 300px;
  background: #0b1220;            /* nền tối sang */
  color: #e2e8f0;
  box-shadow: 0 10px 30px rgba(2,6,23,.45);
  border-right: 1px solid rgba(148,163,184,.12);
  overflow-y: auto;
}

/* Scrollbar tinh gọn */
#nav-drawer::-webkit-scrollbar{ width: 10px; }
#nav-drawer::-webkit-scrollbar-track{ background: transparent; }
#nav-drawer::-webkit-scrollbar-thumb{
  background: linear-gradient(180deg,#7c3aed,#3b82f6);
  border-radius: 999px;
  border: 2px solid #0b1220;
}

/* Nhóm menu */
#nav-drawer .list-group{
  margin: 8px 8px 12px;
  background: transparent;
  border: 0;
  gap: 6px;
  display: grid;
}

/* Item cơ bản */
#nav-drawer .list-group-item{
  background: #0f172a;
  border: 1px solid rgba(148,163,184,.12);
  color: #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  position: relative;
  overflow: hidden;
}

/* Hover + focus */
#nav-drawer .list-group-item:hover{
  background: #111a2e;
  border-color: rgba(148,163,184,.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(2,6,23,.35);
}
#nav-drawer .list-group-item:focus,
#nav-drawer .list-group-item:focus-visible{
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Active */
#nav-drawer .list-group-item.active{
  background: linear-gradient(90deg,#7c3aed 0%, #3b82f6 100%);
  border-color: transparent;
  box-shadow: 0 10px 24px rgba(59,130,246,.35);
}
#nav-drawer .list-group-item.active .media-body{
  font-weight: 800;
}

/* Nhấn mạnh bằng viền trái mảnh */
#nav-drawer .list-group-item::before{
  content:"";
  position:absolute; left:0; top:0; bottom:0; width:4px;
  background: linear-gradient(180deg,transparent,#7c3aed 40%,#3b82f6 100%);
  opacity: .0;
  transition: opacity .2s ease;
}
#nav-drawer .list-group-item:hover::before{ opacity:.8; }
#nav-drawer .list-group-item.active::before{
  opacity:1; background: linear-gradient(180deg,#7c3aed,#3b82f6);
}

/* Bố cục media trong item (giữ nguyên DOM) */
#nav-drawer .list-group-item .media{
  display:flex; align-items:center; gap:10px;
}

/* Icon trái */
#nav-drawer .list-group-item .media-left{
  display:inline-flex; align-items:center; justify-content:center;
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(59,130,246,.08);
  box-shadow: inset 0 0 0 1px rgba(148,163,184,.15);
}
#nav-drawer .list-group-item.active .media-left{
  background: rgba(255,255,255,.18);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.25);
}

/* Font icon */
#nav-drawer .list-group-item .icon{
  color: #cbd5e1;
  font-size: 16px;
  line-height: 1;
}
#nav-drawer .list-group-item:hover .icon{ color:#e2e8f0; }
#nav-drawer .list-group-item.active .icon{ color:#fff; }

/* Text phải */
#nav-drawer .list-group-item .media-body{
  color:#e2e8f0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#nav-drawer .list-group-item:hover .media-body{ color:#f8fafc; }

/* Indent theo mức (giữ m-l-* gốc) */
#nav-drawer .m-l-0{ padding-left: 4px; }
#nav-drawer .m-l-1{ padding-left: 22px; }
#nav-drawer .m-l-2{ padding-left: 34px; }
#nav-drawer .m-l-3{ padding-left: 46px; }

/* Mục tiêu click an toàn toàn bộ thẻ a */
#nav-drawer .list-group-item-action{
  cursor: pointer;
  text-decoration: none !important;
}

/* Nhóm tiêu đề không phải link (div.list-group-item) */
#nav-drawer .list-group > .list-group-item:not(.list-group-item-action){
  background: #0c162a;
  border-style: dashed;
  border-color: rgba(148,163,184,.22);
}
#nav-drawer .list-group > .list-group-item:not(.list-group-item-action) .media-body{
  color:#a5b4fc; font-weight:700;
}

/* Nhóm thứ hai (m-t-1) tạo khoảng cách rõ */
#nav-drawer .list-group.m-t-1{ margin-top: 6px; }
#nav-drawer .list-group.m-t-1 .list-group-item{ background:#0e182e; }

/* Trạng thái disabled/hidden nếu có */
#nav-drawer .list-group-item[aria-disabled="true"],
#nav-drawer .list-group-item[data-hidden="1"]{
  opacity:.55;
  pointer-events:none;
}

/* Tinh chỉnh hit area trên mobile */
@media (max-width: 767.98px){
  #nav-drawer[data-region="drawer"]{ width: 100%; }
  #nav-drawer .list-group-item{ padding: 12px 14px; }
  #nav-drawer .list-group-item .media-left{ width:36px; height:36px; }
}

/* ==== HEADER TOP NAV (Thanh menu trên) ==== */
.header-main-menubar {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 8px 0;
}
.header-main-menubar .nav-link {
  color: #e2e8f0;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 10px;
  transition: all 0.25s ease;
}
.header-main-menubar .nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #06b6d4; /* xanh ngọc */
}
.header-main-menubar .nav-link.active {
  background: linear-gradient(90deg, #06b6d4, #7c3aed);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* ==== HEADER LOGO + TITLE (dark glass pastel) ==== */
.header-main-content {
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
  color: #e5e7eb;
}
#logo img {
  max-height: 55px;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
}
#logo img:hover {
  transform: scale(1.05);
}
#title-site h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.3;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ==== SEARCH BOX (dark pastel) ==== */
.top-search input[type="text"] {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border-radius: 9999px;
  padding: 8px 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.top-search input[type="text"]::placeholder {
  color: #cbd5e1;
}
.top-search input[type="text"]:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25);
  background: rgba(255, 255, 255, 0.12);
}
.top-search input[type="submit"] {
  background: linear-gradient(90deg, #06b6d4, #7c3aed);
  border: none;
  border-radius: 9999px;
  padding: 8px 14px;
  margin-left: 6px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.top-search input[type="submit"]:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}

/* ==== FIXED HEADER NAVBAR (đồng bộ dark glass pastel) ==== */
#header.navbar {
  background: rgba(15, 23, 42, 0.85) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
#header .btn {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.25s ease;
}
#header .btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #06b6d4;
  border-color: rgba(255, 255, 255, 0.28);
}

/* ==== User menu ==== */
.usermenu .dropdown-toggle {
  font-weight: 600;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: background 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}
.usermenu .dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}
.usermenu .dropdown-menu {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.5);
}
.usermenu .dropdown-item {
  color: #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  font-weight: 600;
}
.usermenu .dropdown-item:hover {
  background: #111a2e;
  color: #06b6d4;
}

/* ====== CARD chung ====== */
.card-block{
  background:#fff;
  border-radius:18px;
  box-shadow:0 8px 20px rgba(17,24,39,.08);
  padding:16px 18px;
  border:1px solid #e6eaf1;
}
.card-block + .card-block{ margin-top:16px; }

/* ====== Tiêu đề card ====== */
.card-block .card-title{
  margin:0 0 12px;
  font-size:1.05rem;
  font-weight:800;
  letter-spacing:.2px;
  background:linear-gradient(90deg,#06b6d4,#7c3aed);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  position:relative;
}
.card-block .card-title::after{
  content:""; position:absolute; left:0; bottom:-8px;
  width:56px; height:3px; border-radius:2px;
  background:linear-gradient(90deg,#06b6d4,#7c3aed);
}

/* ====== Tin mới nhất (list) ====== */
.card-block .content ul.unlist{
  list-style:none; margin:0; padding:0; display:grid; gap:10px;
}
.card-block .content .post{
  background:#f8fafc; border:1px solid #e6eaf1;
  border-radius:12px; padding:10px 12px;
  transition:transform .15s ease, box-shadow .15s ease;
}
.card-block .content .post:hover{
  transform:translateY(-2px);
  box-shadow:0 6px 14px rgba(17,24,39,.08);
}
.card-block .content .post .head{
  display:flex; gap:10px; align-items:center; margin-bottom:4px;
  color:#64748b; font-size:.85rem;
}
.card-block .content .post .date{ font-weight:700; color:#0f172a; }
.card-block .content .post .name{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.card-block .content .post .info a{
  font-weight:700; text-decoration:none;
  color:#0f172a; border-bottom:1px dashed transparent;
  transition:color .15s ease, border-color .15s ease;
}
.card-block .content .post .info a:hover{ color:#06b6d4; border-color:#06b6d4; }

/* link “cũ hơn”/footer */
.card-block .footer{ margin-top:10px; }
.card-block .footer a{
  font-weight:700; color:#06b6d4; text-decoration:none;
}
.card-block .footer a:hover{ color:#7c3aed; }

/* ====== Mini Calendar ====== */
.calendarwrapper{ border-radius:14px; overflow:hidden; border:1px solid #e6eaf1; }
.minicalendar.calendartable{
  width:100%; border-collapse:separate; border-spacing:0;
  background:#fff;
}
.minicalendar caption.calendar-controls{
  caption-side:top; padding:10px; font-weight:800; color:#0f172a;
  background:linear-gradient(90deg,#06b6d4,#7c3aed, #06b6d4);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.minicalendar .calendar-controls .arrow_link{
  text-decoration:none; font-weight:800; color:#334155; padding:2px 8px;
  border-radius:8px; background:#f1f5f9; border:1px solid #e6eaf1;
}
.minicalendar thead th.header{
  padding:8px 4px; background:#f8fafc; color:#64748b; font-weight:700; border-bottom:1px solid #e6eaf1;
}
.minicalendar tbody td{
  padding:10px 6px; border-right:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9;
  color:#0f172a; vertical-align:middle;
}
.minicalendar tbody td.weekend{ background:#fafbff; }
.minicalendar tbody td.dayblank{ background:#fcfcfd; }

/* ngày có sự kiện */
.minicalendar td.hasevent a{
  display:inline-block; min-width:26px; height:26px; line-height:26px;
  text-align:center; border-radius:8px;
  background:rgba(6,182,212,.12); color:#0f172a; font-weight:700; text-decoration:none;
  transition:transform .12s ease, background .12s ease;
}
.minicalendar td.hasevent a:hover{ transform:translateY(-1px); background:rgba(124,58,237,.15); }

/* hôm nay */
.minicalendar td.today a{
  background:linear-gradient(90deg,#06b6d4,#7c3aed);
  color:#fff;
}

/* popover hidden container (để nguyên) */

/* no-overflow scroll đẹp */
.card-block .no-overflow{
  max-height:320px; overflow:auto;
}
.card-block .no-overflow::-webkit-scrollbar{ height:10px; width:10px; }
.card-block .no-overflow::-webkit-scrollbar-thumb{
  background:#e6eaf1; border-radius:999px;
}

/* ====== Hỗ trợ người học (khối text dài) ====== */
#instance-230-header.card-title::after{ width:88px; }
.card-block .content .no-overflow p{ margin:6px 0; color:#0f172a; }
.card-block .content .no-overflow b{ color:#0f172a; }
.card-block .content .no-overflow br{ line-height:1.1; }
.card-block .content .no-overflow{
  background:#f8fafc; border:1px dashed #e2e8f0; border-radius:12px; padding:12px;
}

/* số điện thoại nổi bật */
.card-block .content .no-overflow p:has(ĐT),
.card-block .content .no-overflow p:has(SĐT){
  font-weight:600;
}

  body {
    background: radial-gradient(circle at center, #000 60%, #020617 100%);
    overflow-x: hidden;
    position: relative;
  }
  .solar-system, .stars, .shooting-stars {
    position: fixed;
    top:0; left:0; width:100%; height:100%;
    pointer-events:none;
  }
  .solar-system { z-index:-3; }
  .stars { z-index:-2; }
  .shooting-stars { z-index:-1; }
  /* Sun */
  .sun { position:absolute; top:50%; left:50%; width:150px; height:150px;
    margin:-75px 0 0 -75px; border-radius:50%;
    background: radial-gradient(circle, #ffdd55, #ff8800, #cc3300);
    box-shadow:0 0 50px 20px rgba(255,180,0,0.6); }
  /* Orbit + Planets */
  .orbit { position:absolute; top:50%; left:50%; border:1px solid rgba(255,255,255,.1);
    border-radius:50%; transform:translate(-50%,-50%); }
  .planet { position:absolute; top:50%; left:0; border-radius:50%;
    animation:orbit linear infinite; }
  #mercury{width:12px;height:12px;background:#a8a8a8;--distance:180px;animation-duration:5s;}
  #venus{width:18px;height:18px;background:#ffc966;--distance:240px;animation-duration:10s;}
  #earth{width:20px;height:20px;background:#3b82f6;--distance:300px;animation-duration:15s;}
  #mars{width:16px;height:16px;background:#e11d48;--distance:360px;animation-duration:20s;}
  #jupiter{width:40px;height:40px;background:#ffcc99;--distance:450px;animation-duration:30s;}
  #saturn{width:36px;height:36px;background:#f0c070;--distance:520px;animation-duration:40s;}
  #saturn::after{content:"";position:absolute;top:50%;left:50%;width:150%;height:10px;
    background:rgba(210,180,140,.6);border-radius:50%;
    transform:translate(-50%,-50%) rotate(20deg);}
  #orbit-mercury{width:360px;height:360px;}
  #orbit-venus{width:480px;height:480px;}
  #orbit-earth{width:600px;height:600px;}
  #orbit-mars{width:720px;height:720px;}
  #orbit-jupiter{width:900px;height:900px;}
  #orbit-saturn{width:1040px;height:1040px;}
  @keyframes orbit {
    from{transform:rotate(0deg) translateX(var(--distance)) rotate(0deg);}
    to{transform:rotate(360deg) translateX(var(--distance)) rotate(-360deg);}
  }
  /* Stars twinkle */
  .star{position:absolute;background:#fff;border-radius:50%;
    animation:twinkle 5s infinite ease-in-out;}
  @keyframes twinkle {0%,100%{opacity:.3;}50%{opacity:1;}}
  /* Shooting stars */
  .shooting-star{position:absolute;height:2px;
    background:linear-gradient(90deg,#fff,transparent);
    animation:shooting-star linear;opacity:0;}
  @keyframes shooting-star {
    0%{opacity:1;transform:translate(0,0) scale(1);}
    100%{opacity:0;transform:translate(500px,500px) scale(.5);}
  }

/* --- end: vinhuni-elearning.css --- */
`.trim();

  if (typeof GM_addStyle === 'function') GM_addStyle(css);
  else {
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  /* =========================
   *        PROGRESS JS
   * ========================= */
  const R = 27.5;
  const CIRC = 2 * Math.PI * R;

  function setCirclePercent(doughnut) {
    const textEl = doughnut.querySelector('.progress-text');
    const circle = doughnut.querySelector('circle');
    if (!textEl || !circle) return;

    const m = (textEl.textContent || '').match(/(\d{1,3})/);
    let p = m ? parseInt(m[1], 10) : 0;
    p = Math.max(0, Math.min(100, p));

    circle.style.strokeDasharray = CIRC;
    circle.style.strokeDashoffset = CIRC;
    requestAnimationFrame(() => {
      const target = CIRC * (1 - p / 100);
      circle.style.strokeDashoffset = String(target);
    });
  }

  function initAll() {
    document.querySelectorAll('.progress-doughnut').forEach(setCirclePercent);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (!(n instanceof Element)) return;
        if (n.matches && n.matches('.progress-doughnut')) setCirclePercent(n);
        n.querySelectorAll && n.querySelectorAll('.progress-doughnut').forEach(setCirclePercent);
      });
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // === HTML inject ===
  const solar = document.createElement('div');
  solar.className = 'solar-system';
  solar.innerHTML = `
    <div class="sun"></div>
    <div class="orbit" id="orbit-mercury"></div><div class="planet" id="mercury"></div>
    <div class="orbit" id="orbit-venus"></div><div class="planet" id="venus"></div>
    <div class="orbit" id="orbit-earth"></div><div class="planet" id="earth"></div>
    <div class="orbit" id="orbit-mars"></div><div class="planet" id="mars"></div>
    <div class="orbit" id="orbit-jupiter"></div><div class="planet" id="jupiter"></div>
    <div class="orbit" id="orbit-saturn"></div><div class="planet" id="saturn"></div>
  `;
  document.body.appendChild(solar);

  const stars = document.createElement('div');
  stars.className = 'stars';
  for(let i=0;i<50;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.top=Math.random()*100+'%';
    s.style.left=Math.random()*100+'%';
    const size=Math.random()*3+1;
    s.style.width=s.style.height=size+'px';
    s.style.animationDelay=(Math.random()*5)+'s';
    stars.appendChild(s);
  }
  document.body.appendChild(stars);

  const shooting = document.createElement('div');
  shooting.className = 'shooting-stars';
  document.body.appendChild(shooting);

  // === JS tạo sao băng liên tục ===
  function createShootingStar() {
    const star=document.createElement('div');
    star.className='shooting-star';
    star.style.top=Math.random()*100+'vh';
    star.style.left=Math.random()*100+'vw';
    star.style.width=(50+Math.random()*150)+'px';
    star.style.animationDuration=(1+Math.random()*3)+'s';
    star.style.animationDelay='0s';
    shooting.appendChild(star);
    setTimeout(()=>star.remove(),4000);
  }
  setInterval(createShootingStar,500);
})();
