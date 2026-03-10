let currentStep = 1;
const totalSteps = 3;

const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const steps = document.querySelectorAll('.step');
const circles = document.querySelectorAll('.step-circle');
const lineFill = document.getElementById('line-fill');

// --- HÀM VALIDATE TỪNG BƯỚC ---
function validateStep(step) {
    let isValid = true;
    // Reset errors
    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');

    if (step === 1) {
        const name = document.getElementById('fullname').value.trim();
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;

        if (name.length < 3) { document.getElementById('err-fullname').style.display = 'block'; isValid = false; }
        if (!dob) { document.getElementById('err-dob').style.display = 'block'; isValid = false; }
        if (!gender) { document.getElementById('err-gender').style.display = 'block'; isValid = false; }
    } 
    else if (step === 2) {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirmPassword').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) { document.getElementById('err-email').style.display = 'block'; isValid = false; }
        if (pass.length < 8) { document.getElementById('err-password').style.display = 'block'; isValid = false; }
        if (pass !== confirm || confirm === "") { document.getElementById('err-confirm').style.display = 'block'; isValid = false; }
    }
    return isValid;
}

// --- CẬP NHẬT GIAO DIỆN BƯỚC (UI) ---
function updateStepUI() {
    // Hiển thị step tương ứng
    steps.forEach((s, idx) => {
        s.classList.toggle('active', idx === (currentStep - 1));
    });

    // Cập nhật Progress Bar
    circles.forEach((c, idx) => {
        c.classList.toggle('active', idx < currentStep);
    });
    lineFill.style.width = ((currentStep - 1) / (totalSteps - 1)) * 100 + "%";

    // Điều khiển nút bấm
    prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    
    if (currentStep === totalSteps) {
        nextBtn.innerText = "Hoàn tất";
        showSummary();
    } else {
        nextBtn.innerText = "Tiếp theo";
    }

    document.getElementById('step-text').innerText = `Bước ${currentStep}: ${getStepName()}`;
}

function getStepName() {
    if (currentStep === 1) return "Thông tin cá nhân";
    if (currentStep === 2) return "Thông tin tài khoản";
    return "Xác nhận";
}

// --- HIỂN THỊ TÓM TẮT BƯỚC 3 ---
function showSummary() {
    const summary = `
        <p><strong>Họ tên:</strong> ${document.getElementById('fullname').value}</p>
        <p><strong>Ngày sinh:</strong> ${document.getElementById('dob').value}</p>
        <p><strong>Giới tính:</strong> ${document.getElementById('gender').value}</p>
        <p><strong>Email:</strong> ${document.getElementById('email').value}</p>
    `;
    document.getElementById('summary').innerHTML = summary;
}

// --- SỰ KIỆN NÚT BẤM ---
nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStepUI();
        }
    } else {
        alert("🎉 Đăng ký thành công!");
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
});