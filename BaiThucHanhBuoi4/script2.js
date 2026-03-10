const form = document.getElementById('registrationForm');
const formWrapper = document.getElementById('formWrapper');
const successMsg = document.getElementById('success-msg');

// --- HÀM TIỆN ÍCH ---
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if(field) field.classList.add('invalid');
    errorSpan.innerText = message;
    errorSpan.style.display = 'block';
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}-error`);
    if(field) field.classList.remove('invalid');
    errorSpan.style.display = 'none';
}

// --- CÁC HÀM VALIDATE TỪNG TRƯỜNG ---

function validateFullname() {
    const val = document.getElementById('fullname').value.trim();
    const regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    if (val === "") { showError('fullname', 'Họ tên không được để trống'); return false; }
    if (val.length < 3) { showError('fullname', 'Họ tên phải ít nhất 3 ký tự'); return false; }
    if (!regex.test(val)) { showError('fullname', 'Họ tên chỉ được chứa chữ cái'); return false; }
    clearError('fullname');
    return true;
}

function validateEmail() {
    const val = document.getElementById('email').value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { showError('email', 'Email không đúng định dạng (name@domain.com)'); return false; }
    clearError('email');
    return true;
}

function validatePhone() {
    const val = document.getElementById('phone').value.trim();
    const regex = /^0\d{9}$/;
    if (!regex.test(val)) { showError('phone', 'Số điện thoại phải 10 số và bắt đầu bằng 0'); return false; }
    clearError('phone');
    return true;
}

function validatePassword() {
    const val = document.getElementById('password').value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(val)) { showError('password', 'Mật khẩu ≥ 8 ký tự, có chữ hoa, thường và số'); return false; }
    clearError('password');
    return true;
}

function validateConfirm() {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (confirm !== pass || confirm === "") { showError('confirmPassword', 'Mật khẩu xác nhận không khớp'); return false; }
    clearError('confirmPassword');
    return true;
}

function validateGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
    clearError('gender');
    return true;
}

function validateTerms() {
    const checkbox = document.getElementById('terms');
    if (!checkbox.checked) { showError('terms', 'Bạn phải đồng ý với điều khoản'); return false; }
    clearError('terms');
    return true;
}

// --- GẮN SỰ KIỆN BLUR & INPUT ---

const fields = ['fullname', 'email', 'phone', 'password', 'confirmPassword'];
fields.forEach(id => {
    const el = document.getElementById(id);
    // Khi rời khỏi ô: Kiểm tra lỗi
    el.addEventListener('blur', () => {
        if(id === 'fullname') validateFullname();
        if(id === 'email') validateEmail();
        if(id === 'phone') validatePhone();
        if(id === 'password') validatePassword();
        if(id === 'confirmPassword') validateConfirm();
    });
    // Khi đang gõ: Xóa lỗi ngay lập tức
    el.addEventListener('input', () => clearError(id));
});

// Sự kiện riêng cho Radio và Checkbox
document.getElementsByName('gender').forEach(r => r.addEventListener('change', validateGender));
document.getElementById('terms').addEventListener('change', validateTerms);

// --- XỬ LÝ SUBMIT ---

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Dùng toán tử bit & để ép tất cả các hàm phải chạy (không dùng && vì nó sẽ dừng khi gặp false đầu tiên)
    // Cách này giúp hiển thị tất cả các lỗi cùng lúc nếu có
    const isNameValid = validateFullname();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPassValid = validatePassword();
    const isConfirmValid = validateConfirm();
    const isGenderValid = validateGender();
    const isTermsValid = validateTerms();

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid && isGenderValid && isTermsValid) {
        const name = document.getElementById('fullname').value;
        formWrapper.style.display = 'none';
        successMsg.innerHTML = `<h3>Đăng ký thành công! 🎉</h3><p>Chào mừng <strong>${name}</strong> đã gia nhập hệ thống.</p>`;
        successMsg.style.display = 'block';
    }
});

// --- 1. ĐẾM KÝ TỰ HỌ TÊN REALTIME ---
const fullnameInput = document.getElementById('fullname');
const nameCount = document.getElementById('name-count');

fullnameInput.addEventListener('input', function() {
    const length = this.value.length;
    nameCount.innerText = `${length}/50`;
    if (length >= 50) nameCount.style.color = 'red';
    else nameCount.style.color = '#888';
});

// --- 2. ẨN/HIỆN MẬT KHẨU ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    // Chuyển đổi type
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    // Thay đổi icon (tùy chọn)
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

// --- 3. ĐÁNH GIÁ ĐỘ MẠNH MẬT KHẨU ---
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

passwordInput.addEventListener('input', function() {
    const val = this.value;
    let strength = 0;
    
    if (val.length >= 8) strength++; // Độ dài tốt
    if (/[A-Z]/.test(val)) strength++; // Có chữ hoa
    if (/[0-9]/.test(val)) strength++; // Có số
    if (/[^A-Za-z0-9]/.test(val)) strength++; // Có ký tự đặc biệt

    // Hiển thị UI dựa trên điểm số
    switch(strength) {
        case 0:
        case 1:
            updateBar(25, '#ff4d4d', 'Yếu');
            break;
        case 2:
            updateBar(50, '#ffad33', 'Trung bình');
            break;
        case 3:
            updateBar(75, '#2ecc71', 'Mạnh');
            break;
        case 4:
            updateBar(100, '#1d8348', 'Rất mạnh');
            break;
    }
    if(val === "") updateBar(0, '', '');
});

function updateBar(width, color, text) {
    strengthBar.style.width = width + '%';
    strengthBar.style.background = color;
    strengthText.innerText = text;
    strengthText.style.color = color;
}