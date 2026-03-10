// --- 1. KHỞI TẠO DỮ LIỆU ---
let students = []; // Mảng gốc lưu trữ vĩnh viễn
let sortDirection = 0; // 0: mặc định, 1: tăng dần, -1: giảm dần

// Truy vấn các phần tử DOM
const txtName = document.getElementById('txtName');
const txtScore = document.getElementById('txtScore');
const btnAdd = document.getElementById('btnAdd');
const searchInput = document.getElementById('searchName');
const filterRank = document.getElementById('filterRank');
const sortScoreBtn = document.getElementById('sortScore');
const sortIcon = document.getElementById('sortIcon');
const tableBody = document.getElementById('studentTableBody');
const summaryDiv = document.getElementById('summary');

// --- 2. HÀM TRỢ GIÚP (HELPER FUNCTIONS) ---

// Tính xếp loại dựa trên điểm
const getRank = (score) => {
    if (score >= 8.5) return 'Giỏi';
    if (score >= 7.0) return 'Khá';
    if (score >= 5.0) return 'Trung bình';
    return 'Yếu';
};

// Cập nhật dòng thống kê
const updateSummary = (count, avg) => {
    summaryDiv.innerHTML = `Tổng số sinh viên: ${count} | Điểm trung bình: ${avg.toFixed(2)}`;
};

// --- 3. LOGIC XỬ LÝ CHÍNH ---

// Hàm Render: Vẽ bảng dựa trên một mảng được truyền vào
function renderTable(dataToDisplay) {
    tableBody.innerHTML = ''; // Xóa sạch bảng cũ
    let totalScore = 0;

    if (dataToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-result">Không tìm thấy kết quả phù hợp</td></tr>';
        updateSummary(0, 0);
        return;
    }

    dataToDisplay.forEach((sv, index) => {
        const rank = getRank(sv.score);
        totalScore += sv.score;

        const row = document.createElement('tr');
        if (sv.score < 5.0) row.classList.add('highlight-yellow');

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sv.name}</td>
            <td>${sv.score.toFixed(1)}</td>
            <td>${rank}</td>
            <td><button class="delete-btn" data-id="${sv.id}">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    updateSummary(dataToDisplay.length, totalScore / dataToDisplay.length);
}

// Hàm lọc và sắp xếp (Hàm tổng quản)
function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const rankTarget = filterRank.value;

    // Bước 1: Lọc theo Tên và Xếp loại
    let filtered = students.filter(sv => {
        const matchesName = sv.name.toLowerCase().includes(keyword);
        const matchesRank = (rankTarget === "Tất cả") || (getRank(sv.score) === rankTarget);
        return matchesName && matchesRank;
    });

    // Bước 2: Sắp xếp theo điểm (nếu có yêu cầu)
    if (sortDirection !== 0) {
        filtered.sort((a, b) => {
            return sortDirection === 1 ? a.score - b.score : b.score - a.score;
        });
    }

    renderTable(filtered);
}

// Hàm thêm sinh viên mới
function addStudent() {
    const name = txtName.value.trim();
    const score = parseFloat(txtScore.value);

    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Vui lòng nhập họ tên và điểm hợp lệ (0-10)!");
        return;
    }

    const newStudent = {
        id: Date.now(), // ID duy nhất để không bị nhầm khi xóa
        name: name,
        score: score
    };

    students.push(newStudent);
    
    // Reset form nhập
    txtName.value = '';
    txtScore.value = '';
    txtName.focus();

    applyFilters(); // Cập nhật lại danh sách hiển thị
}

// --- 4. GẮN SỰ KIỆN (EVENT LISTENERS) ---

// Sự kiện nút Thêm
btnAdd.addEventListener('click', addStudent);

// Sự kiện nhấn Enter ở ô điểm
txtScore.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStudent();
});

// Sự kiện Tìm kiếm (Input real-time)
searchInput.addEventListener('input', applyFilters);

// Sự kiện thay đổi Xếp loại
filterRank.addEventListener('change', applyFilters);

// Sự kiện Sắp xếp khi click tiêu đề cột Điểm
sortScoreBtn.addEventListener('click', () => {
    if (sortDirection === 0 || sortDirection === -1) {
        sortDirection = 1; // Tăng dần
        sortIcon.innerText = '▲';
    } else {
        sortDirection = -1; // Giảm dần
        sortIcon.innerText = '▼';
    }
    applyFilters();
});

// Sự kiện Xóa (Event Delegation)
tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const idToDelete = Number(e.target.getAttribute('data-id'));
        
        // Cập nhật mảng gốc: giữ lại những người không có ID bị xóa
        students = students.filter(sv => sv.id !== idToDelete);
        
        applyFilters();
    }
});