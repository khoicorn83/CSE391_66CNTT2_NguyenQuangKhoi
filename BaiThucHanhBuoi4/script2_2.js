// 1. Cấu hình giá sản phẩm
const prices = {
    "ao": 150000,
    "quan": 350000,
    "giay": 500000
};

const form = document.getElementById('orderForm');

// 2. Tính tổng tiền tự động
function calculateTotal() {
    const product = document.getElementById('product').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const total = (prices[product] || 0) * quantity;
    
    document.getElementById('display-total').innerText = total.toLocaleString("vi-VN");
    return total;
}

document.getElementById('product').addEventListener('change', calculateTotal);
document.getElementById('quantity').addEventListener('input', calculateTotal);

// 3. Đếm ký tự realtime cho Ghi chú
const noteInput = document.getElementById('note');
noteInput.addEventListener('input', function() {
    const len = this.value.length;
    const countDisplay = document.getElementById('note-count');
    countDisplay.innerText = `${len}/200`;
    
    if (len > 200) {
        countDisplay.style.color = "red";
        document.getElementById('err-note').style.display = "block";
    } else {
        countDisplay.style.color = "#666";
        document.getElementById('err-note').style.display = "none";
    }
});

// 4. Hàm Validate
function validateForm() {
    let isValid = true;

    // Reset lỗi
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');

    // Sản phẩm
    if (document.getElementById('product').value === "") {
        document.getElementById('err-product').style.display = 'block';
        isValid = false;
    }

    // Số lượng
    const qty = parseInt(document.getElementById('quantity').value);
    if (isNaN(qty) || qty < 1 || qty > 99) {
        document.getElementById('err-quantity').style.display = 'block';
        isValid = false;
    }

    // Ngày giao hàng
    const dateVal = new Date(document.getElementById('deliveryDate').value);
    const today = new Date();
    today.setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    if (isNaN(dateVal.getTime()) || dateVal < today || dateVal > maxDate) {
        document.getElementById('err-date').style.display = 'block';
        isValid = false;
    }

    // Địa chỉ
    if (document.getElementById('address').value.trim().length < 10) {
        document.getElementById('err-address').style.display = 'block';
        isValid = false;
    }

    // Thanh toán
    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
        document.getElementById('err-payment').style.display = 'block';
        isValid = false;
    }

    return isValid;
}

// 5. Xử lý Submit
form.onsubmit = function(e) {
    e.preventDefault();
    if (validateForm()) {
        const productText = document.getElementById('product').options[document.getElementById('product').selectedIndex].text;
        const summary = `
            <p><b>Sản phẩm:</b> ${productText}</p>
            <p><b>Số lượng:</b> ${document.getElementById('quantity').value}</p>
            <p><b>Tổng tiền:</b> ${document.getElementById('display-total').innerText}đ</p>
            <p><b>Ngày giao:</b> ${document.getElementById('deliveryDate').value}</p>
        `;
        document.getElementById('summary').innerHTML = summary;
        document.getElementById('confirmBox').style.display = 'block';
    }
};

function closeModal() {
    document.getElementById('confirmBox').style.display = 'none';
}

function finalSubmit() {
    alert("🎉 Đặt hàng thành công! Cảm ơn bạn.");
    closeModal();
    form.reset();
    calculateTotal();
}