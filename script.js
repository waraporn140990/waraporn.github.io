// อ่านพารามิเตอร์จาก URL ทุกหน้า
function getParams() {
  return new URLSearchParams(window.location.search);
}

//  index.html — เมื่อกด "จองเลย" ส่งต่อไป select-room.html
function setupIndex() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;
    const promo = document.getElementById("promo").value;
    if (!checkin || !checkout || !guests) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const query = `?checkin=${checkin}&checkout=${checkout}&guests=${guests}&promo=${encodeURIComponent(promo)}`;
    window.location.href = "select-room.html" + query;
  });
}

// select-room.html — แสดงข้อมูลด้านบน และจัดการคลิกเลือกห้อง
function setupSelectRoom() {
  const params = getParams();
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const guests = params.get("guests");
  const promo = params.get("promo");

  const infoBar = document.getElementById("infoBar");
  if (!infoBar) return;

  infoBar.innerHTML = `
    <p><strong>เช็คอิน:</strong> ${checkin}</p>
    <p><strong>เช็คเอาท์:</strong> ${checkout}</p>
    <p><strong>จำนวนผู้เข้าพัก:</strong> ${guests} ท่าน</p>
    <p><strong>โค้ดส่วนลด:</strong> ${promo || "ไม่มี"}</p>
  `;
}

// room-detail.html — แสดงข้อมูลห้อง และจัดการจองต่อ
function setupRoomDetail() {
  const params = getParams();
  const room = params.get("room");
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const guests = params.get("guests");
  const promo = params.get("promo");

  const roomData = {
    "ห้องวินเทจ": { images: ["2.jpg","1-1.jpg","1-2.jpg"], price: "1250" },
    "ห้องริมน้ำ": { images: ["3.jpg","2-1.jpg","2-2.jpg"], price: "1350" },
    "ห้องคอตเทจ": { images: ["5.jpg","3-1.jpg"], price: "4050" },
    "ห้องแฟมิลี่ คอตเทจ": { images: ["4.jpg","4-1.jpg"], price: "5000" }
  };

  const selected = room && roomData[room];
  const container = document.getElementById("roomContainer");
  if (!container || !selected) return;

  container.innerHTML = `
    <div class="gallery">${selected.images.map(img => `<img src="${img}" alt="${room}">`).join('')}</div>
    <h2>${room}</h2>
    <div class="room-info">
      <p><strong>รองรับ:</strong> ${guests || "-"} ท่าน</p>
      <p><strong>วันที่เข้าพัก:</strong> ${checkin || "-"} ถึง ${checkout || "-"}</p>
      <p><strong>โค้ดส่วนลด:</strong> ${promo || "ไม่มี"}</p>
      <p class="highlight">ราคา: ฿${selected.price} / คืน</p>
    </div>
    <div class="booking-bar">
      <button id="bookThisRoom">จองห้องนี้</button>
    </div>
  `;

  document.getElementById("bookThisRoom").onclick = function () {
    const query = `?room=${encodeURIComponent(room)}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&promo=${promo}`;
    window.location.href = "booking-form.html" + query;
  };
}

// booking-form.html — แสดงสรุปและจัดฟอร์ม
function setupBookingForm() {
  const params = getParams();
  const room = params.get("room");
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const guests = params.get("guests");
  const promo = params.get("promo");

  const summary = document.getElementById("summaryBox");
  if (!summary) return;

  summary.innerHTML = `
    <p><strong>ห้องที่เลือก:</strong> ${room}</p>
    <p><strong>เช็คอิน:</strong> ${checkin}</p>
    <p><strong>เช็คเอาท์:</strong> ${checkout}</p>
    <p><strong>จำนวนผู้เข้าพัก:</strong> ${guests} ท่าน</p>
    <p><strong>โค้ดส่วนลด:</strong> ${promo || "ไม่มี"}</p>
  `;

  const form = document.getElementById("bookingForm");
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("✅ ยืนยันการจองสำเร็จ! ขอบคุณที่จองกับเรา");
    document.getElementById("successBox").style.display = "block";
    form.reset();
  });
}

// main — เรียกใช้โค้ดตามหน้า
document.addEventListener("DOMContentLoaded", function () {
  setupIndex();
  setupSelectRoom();
  setupRoomDetail();
  setupBookingForm();
});
