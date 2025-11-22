let tasks = [
    { id: 1, name: "Tugas Membersihkan Kandang Harimau", date: "2025-12-31", completed: false },
    { id: 2, name: "Belajar JavaScript DOM", date: "2025-11-20", completed: false },
    { id: 3, name: "Meeting Project Web", date: "2025-11-21", completed: true }
];

let currentFilterDay = 'All';

function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${page}`).classList.add('active');

    document.getElementById('view-list').classList.add('hidden');
    document.getElementById('view-add').classList.add('hidden');

    const titleEl = document.getElementById('page-title');
    
    if (page === 'home') {
        document.getElementById('view-list').classList.remove('hidden');
        titleEl.textContent = "Aplikasi To-Do List";
        renderTasks();
    } else if (page === 'tasks') {
        document.getElementById('view-list').classList.remove('hidden');
        titleEl.textContent = "Home Tasks";
        renderTasks();
    } else if (page === 'add') {
        document.getElementById('view-add').classList.remove('hidden');
        titleEl.textContent = "Daftar Tugas";
    }
}

function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('id-ID', options);
}


function renderTasks() {
    const activeContainer = document.getElementById('active-tasks-list');
    const completedContainer = document.getElementById('completed-tasks-list');
    
    activeContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilterDay === 'All') return true;
        return getDayName(task.date) === currentFilterDay;
    });

    filteredTasks.forEach(task => {
        // Common Elements
        const dateFormatted = formatDate(task.date);
        
        // Struktur HTML berbeda untuk tugas aktif dan selesai
        if (!task.completed) {
            const html = `
            <div class="task-card">
                <!-- Left Side: Checkbox + Text -->
                <div class="task-left">
                    <!-- Circle Button -->
                    <div onclick="toggleComplete(${task.id})" class="custom-circle"></div>
                    
                    <!-- Text Content -->
                    <div class="task-info"> 
                        <h4 class="task-name" title="${task.name}">${task.name}</h4>
                        <div class="task-date">
                            <i class="fa-regular fa-calendar"></i>
                            <span>${dateFormatted}</span>
                        </div>
                    </div>
                </div>

                <!-- Buttons Container -->
                <div class="task-actions">
                    <button onclick="openEditModal(${task.id})" class="btn btn-edit btn-small">Edit</button>
                    <button onclick="deleteTask(${task.id})" class="btn btn-delete btn-small">Hapus</button>
                    <button onclick="toggleComplete(${task.id})" class="btn btn-complete btn-small">Selesai</button>
                </div>
            </div>
            `;
            activeContainer.insertAdjacentHTML('beforeend', html);
        } 
        else {
            const html = `
            <div class="task-card completed">
                <div class="task-left">
                    <!-- Green Circle -->
                    <div class="custom-circle completed">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    
                    <div class="task-info">
                        <h4 class="task-name struck" title="${task.name}">${task.name}</h4>
                        <div class="task-date">
                            <i class="fa-regular fa-calendar"></i>
                            <span>${dateFormatted}</span>
                        </div>
                    </div>
                </div>

                <div class="task-actions">
                        <!-- Parameter 'true' agar langsung terhapus tanpa konfirmasi -->
                        <button onclick="deleteTask(${task.id}, true)" class="btn btn-delete btn-small">Hapus</button>
                </div>
            </div>
            `;
            completedContainer.insertAdjacentHTML('beforeend', html);
        }
    });

    if (activeContainer.innerHTML === '') {
        activeContainer.innerHTML = `<p style="text-align: center; color: #9CA3AF; grid-column: 1/-1; padding: 1rem;">Tidak ada tugas aktif ${currentFilterDay !== 'All' ? 'hari ' + currentFilterDay : ''}.</p>`;
    }
}

// --- Actions: Add, Complete, Delete, Edit ---

function addTask() {
    const nameInput = document.getElementById('input-task-name');
    const dateInput = document.getElementById('input-task-date');
    
    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!name || !date) {
        alert("Mohon isi nama tugas dan tanggal deadline.");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: name,
        date: date,
        completed: false
    };

    tasks.push(newTask);

    // Reset form
    nameInput.value = '';
    dateInput.value = '';

    alert('Tugas berhasil ditambahkan!');
    navigateTo('tasks');
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id, force = false) {
    // Jika force true (dari completed) ATAU user klik OK pada konfirmasi
    if(force || confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}


function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-name').value = task.name;
    document.getElementById('edit-task-date').value = task.date;

    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function saveEditTask() {
    const id = parseInt(document.getElementById('edit-task-id').value);
    const newName = document.getElementById('edit-task-name').value;
    const newDate = document.getElementById('edit-task-date').value;

    const task = tasks.find(t => t.id === id);
    if (task && newName && newDate) {
        task.name = newName;
        task.date = newDate;
        renderTasks();
        closeEditModal();
    } else {
        alert("Data tidak boleh kosong");
    }
}


function toggleSection(elementId, arrowId) {
    const el = document.getElementById(elementId);
    const arrow = document.getElementById(arrowId);
    
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        if (window.innerWidth >= 768) {
             if (elementId === 'active-tasks-list') {
                 el.style.display = 'grid'; 
             }
        }
        if(arrow) arrow.classList.remove('rotate-180');
    } else {
        el.classList.add('hidden');
        if(arrow) arrow.classList.add('rotate-180');
    }
}

function toggleTodayDropdown() {
    const dropdown = document.getElementById('day-filter-dropdown');
    const arrow = document.getElementById('today-arrow');
    
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        arrow.classList.add('rotate-180');
    } else {
        dropdown.classList.add('hidden');
        arrow.classList.remove('rotate-180');
    }
}

function filterByDay(day) {
    currentFilterDay = day;
    document.getElementById('current-filter-label').textContent = `Menampilkan: ${day === 'All' ? 'Semua Hari' : day}`;
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.filter-btn');
    for (let btn of buttons) {
        if (btn.textContent === (day === 'All' ? 'Semua' : day)) {
            btn.classList.add('active'); 
        }
    }

    renderTasks();
    toggleTodayDropdown(); 
}
window.onload = function() {
    const dateInput = document.getElementById('input-task-date');
    if(dateInput) {
        dateInput.valueAsDate = new Date();
    }
    renderTasks();
};