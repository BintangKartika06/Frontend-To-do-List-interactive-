let tasks = [];

let currentFilterDay = 'All';
let showOnlyImportant = false;
let selectedDate = null;

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

    let filteredTasks = tasks.filter(task => {
        if (currentFilterDay === 'All') return true;
        return getDayName(task.date) === currentFilterDay;
    });

    // Apply Important filter
    if (showOnlyImportant) {
        filteredTasks = filteredTasks.filter(task => task.important);
    }

    // Apply Date filter
    if (selectedDate) {
        filteredTasks = filteredTasks.filter(task => task.date === selectedDate);
    }

    filteredTasks.forEach(task => {
        // Common Elements
        const dateFormatted = formatDate(task.date);
        
        // Struktur HTML berbeda untuk tugas aktif dan selesai
        if (!task.completed) {
            const html = `
            <div class="task-card" data-task-id="${task.id}">
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

                <!-- Three-dot Button for Actions -->
                <div class="task-actions-wrapper">
                    <button class="btn-menu-trigger" aria-label="Tampilkan menu tugas">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div class="action-dropdown hidden">
                        <button class="dropdown-item text-edit-custom" onclick="openEditModal(${task.id})">Edit</button>
                        <button class="dropdown-item text-hapus-custom" onclick="deleteTask(${task.id})">Hapus</button>
                        <button class="dropdown-item text-selesai-custom" onclick="toggleComplete(${task.id})">Selesai</button>
                    </div>
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
        completed: false,
        important: false
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
    document.getElementById('edit-task-important').checked = task.important;

    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

function saveEditTask() {
    const id = parseInt(document.getElementById('edit-task-id').value);
    const newName = document.getElementById('edit-task-name').value;
    const newDate = document.getElementById('edit-task-date').value;
    const newImportant = document.getElementById('edit-task-important').checked;

    const task = tasks.find(t => t.id === id);
    if (task && newName && newDate) {
        task.name = newName;
        task.date = newDate;
        task.important = newImportant;
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
            if (elementId === 'active-tasks-list' || elementId === 'completed-tasks-list') {
                el.style.display = 'flex';
            }
        }
        // Reset Scroll
        el.scrollLeft = 0;
        el.scrollTop = 0;
        if(arrow) arrow.classList.remove('rotate-180');
    } else {
        el.classList.add('hidden');
        if(arrow) arrow.classList.add('rotate-180');
    }
}

document.addEventListener('click', function(event) {
    const isMenuTrigger = event.target.closest('.btn-menu-trigger');
    const allDropdowns = document.querySelectorAll('.action-dropdown');

    allDropdowns.forEach(dropdown => {
        if (!dropdown.classList.contains('hidden')) {
            const parent = dropdown.parentElement;
            if (!parent.contains(event.target) || event.target.classList.contains('dropdown-item')) {
                dropdown.classList.add('hidden');
            }
        }
    });

    if(isMenuTrigger) {
        const dropdown = isMenuTrigger.nextElementSibling;
        if(dropdown) {
            const isHidden = dropdown.classList.contains('hidden');
            allDropdowns.forEach(d => d.classList.add('hidden'));
            if(isHidden) {
                dropdown.classList.remove('hidden');
            }
        }
    }
});

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
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);

    clockElement.textContent = `${dateString} ${hours}:${minutes}:${seconds}`;
}

window.onload = function() {
    const dateInput = document.getElementById('input-task-date');
    if(dateInput) {
        dateInput.valueAsDate = new Date();
    }
    navigateTo('add'); 
    updateClock();
    setInterval(updateClock, 1000);
};
const settingsTrigger = document.getElementById('settings-trigger');
    const settingsMenu = document.getElementById('settings-menu');

    settingsTrigger.addEventListener('click', () => {
        settingsMenu.classList.toggle('show');
    });


    document.addEventListener('click', (event) => {
        const isClickInsideMenu = settingsMenu.contains(event.target);
        const isClickOnTrigger = settingsTrigger.contains(event.target);

        if (!isClickInsideMenu && !isClickOnTrigger && settingsMenu.classList.contains('show')) {
            settingsMenu.classList.remove('show');
        }
    });

    document.getElementById('important-switch').addEventListener('change', (e) => {
        showOnlyImportant = e.target.checked;
        renderTasks();
    });

    const calendarControls = document.getElementById('calendar-controls');
    const calendarDateInput = document.getElementById('calendar-date-input');
    document.getElementById('calendar-select').addEventListener('click', () => {
        calendarControls.classList.toggle('hidden');
    });

    calendarDateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        renderTasks();
        calendarControls.classList.add('hidden');
    });

    document.getElementById('calendar-cancel').addEventListener('click', () => {
        calendarControls.classList.add('hidden');
    });

    document.getElementById('new-task-btn').addEventListener('click', () => {
        navigateTo('add');
        settingsMenu.classList.remove('show');
    });
