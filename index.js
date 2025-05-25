let taskLibrary = JSON.parse(localStorage.getItem('taskLibrary')) || {};
let selectedDate = new Date().toISOString().split('T')[0];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedLevel = null;

document.addEventListener('DOMContentLoaded', function () {
  const nameStorage = localStorage.getItem('userName');
  const positionStorage = localStorage.getItem('userPosition');

  const greeting = document.getElementById('greeting');
  const nameDisplay = document.querySelector('.text-blue-700');
  const positionDisplay = document.querySelector('.text-gray-500');
  const identityForm = document.getElementById('identityForm');
  const identityModal = document.getElementById('inputIdentity');

  if (nameStorage && positionStorage) {
    greeting.textContent = `Hi, Welcome!`;
    nameDisplay.textContent = nameStorage;
    positionDisplay.textContent = positionStorage;
    identityModal.style.display = 'none';
  }

  identityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const position = document.getElementById('position').value.trim();

    if (name && position) {
      localStorage.setItem('userName', name);
      localStorage.setItem('userPosition', position);

      greeting.textContent = `Hi, Welcome`;
      nameDisplay.textContent = name;
      positionDisplay.textContent = position;

      identityModal.style.display = 'none';
    }
  });

  document.getElementById('dateTimeNow').innerText = getCurrentDateTime();
  setInterval(() => {
    document.getElementById('dateTimeNow').innerText = getCurrentDateTime();
  }, 60000);

  greeting.innerText = `Hi, Welcome!`;
  setInterval(() => {
    greeting.innerText = `Hi, Welcome!`;
  }, 60000);
});

function saveTasks() {
  localStorage.setItem('taskLibrary', JSON.stringify(taskLibrary));
}

function getCurrentDateTime() {
  const now = new Date();

  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'December'];

  const dayName = days[now.getDay()];
  const date = now.getDate();
  const monthName = months[now.getMonth()];
  const year = now.getFullYear();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${time} - ${dayName}, ${date} ${monthName} ${year}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning ☀';
  if (hour < 18) return 'Good Afternoon 🌤';
  return 'Good Evening 🌙';
}

function selectLevel(level) {
  selectedLevel = level;
  document.getElementById('priorityBtn').innerText = 'Level: ' + level;
}

function add() {
  const todoInput = document.getElementById('todoInput');
  const value = todoInput.value.trim();

  if (!selectedLevel) {
    alert('⚠ Select the priority level first!');
    return;
  }

  if (value === '') {
    alert('😮 Task cant be empty!');
    return;
  }

  const newTask = {
    task: value,
    id: Date.now().toString(),
    complete: false,
    time: getCurrentDateTime(),
    level: selectedLevel,
  };

  if (!taskLibrary[selectedDate]) {
    taskLibrary[selectedDate] = [];
  }

  taskLibrary[selectedDate].push(newTask);
  saveTasks();

  todoInput.value = '';
  selectedLevel = null;
  document.getElementById('priorityBtn').innerText = 'Level';
  renderTasksForDate(selectedDate);
}

function getLevelColor(level) {
  if (level === 'Low') return 'bg-blue-500';
  if (level === 'Medium') return 'bg-yellow-400';
  if (level === 'High') return 'bg-red-500';
  return 'bg-gray-400';
}

function renderTasksForDate(date) {
  const allTodos = document.getElementById('allTodos');
  const list = taskLibrary[date] || [];
  const completed = list.filter((t) => t.complete);

  document.getElementById('r-count').innerText = list.length;
  document.getElementById('c-count').innerText = completed.length;

  allTodos.innerHTML = '';
  list.forEach((task) => {
    const colorClass = getLevelColor(task.level);
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-white shadow p-2 rounded';
    li.id = task.id;
    li.innerHTML = `
          <div>
            <p class="font-medium ${task.complete ? 'line-through text-gray-400' : ''}">${task.task}</p>
            <div class="text-xs text-gray-500 flex gap-2 items-center">
              ${task.time}
              <span class="rounded-full h-3 w-3 ${colorClass} inline-block" title="${task.level}"></span>
            </div>
          </div>
          <div class="flex gap-1">
            <button class="btn btn-xs btn-success  hover:bg-emerald-700" onclick="toggleComplete('${task.id}')"><i class='bx bx-check'></i></button>
            <button class="btn btn-xs btn-error  hover:bg-red-700" onclick="deleteTodo('${task.id}')"><i class='bx bx-trash'></i></button>
          </div>`;
    allTodos.appendChild(li);
  });
}

function toggleComplete(id) {
  const list = taskLibrary[selectedDate] || [];
  list.forEach((t) => {
    if (t.id === id) t.complete = !t.complete;
  });
  saveTasks();
  renderTasksForDate(selectedDate);
}

function deleteTodo(id) {
  taskLibrary[selectedDate] = (taskLibrary[selectedDate] || []).filter((t) => t.id !== id);
  saveTasks();
  renderTasksForDate(selectedDate);
}

function deleteAll() {
  if (confirm('Are you sure you want to DELETE ALL tasks on this date?')) {
    delete taskLibrary[selectedDate];
    saveTasks();
    renderTasksForDate(selectedDate);
  }
}

function deleteS() {
  const list = taskLibrary[selectedDate] || [];
  taskLibrary[selectedDate] = list.filter((t) => !t.complete);
  saveTasks();
  renderTasksForDate(selectedDate);
}

function viewAll() {
  renderTasksForDate(selectedDate);
}

function viewRemaining() {
  const allTodos = document.getElementById('allTodos');
  const list = (taskLibrary[selectedDate] || []).filter((t) => !t.complete);

  allTodos.innerHTML = '';
  list.forEach((task) => {
    const colorClass = getLevelColor(task.level);
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-white shadow p-2 rounded';
    li.innerHTML = `
      <div>
        <p class="font-medium">${task.task}</p>
        <div class="text-xs text-gray-500 flex gap-2 items-center">
          ${task.time}
          <span class="rounded-full h-3 w-3 ${colorClass} inline-block" title="${task.level}"></span>
        </div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-xs btn-success  hover:bg-emerald-700" onclick="toggleComplete('${task.id}')"><i class='bx bx-check'></i></button>
        <button class="btn btn-xs btn-error hover:bg-red-700" onclick="deleteTodo('${task.id}')"><i class='bx bx-trash'></i></button>
      </div>`;
    allTodos.appendChild(li);
  });
}

function viewCompleted() {
  const allTodos = document.getElementById('allTodos');
  const list = (taskLibrary[selectedDate] || []).filter((t) => t.complete);

  allTodos.innerHTML = '';
  list.forEach((task) => {
    const colorClass = getLevelColor(task.level);
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-white shadow p-2 rounded';
    li.innerHTML = `
      <div>
        <p class="font-medium line-through text-gray-400">${task.task}</p>
        <div class="text-xs text-gray-500 flex gap-2 items-center">
          ${task.time}
          <span class="rounded-full h-3 w-3 ${colorClass} inline-block" title="${task.level}"></span>
        </div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-xs btn-success" onclick="toggleComplete('${task.id}')"><i class='bx bx-check'></i></button>
        <button class="btn btn-xs btn-error hover:bg-red-700" onclick="deleteTodo('${task.id}')"><i class='bx bx-trash'></i></button>
      </div>`;
    allTodos.appendChild(li);
  });
}

function filterByLevel(level) {
  const allTodos = document.getElementById('allTodos');
  const list = (taskLibrary[selectedDate] || []).filter((t) => t.level === level);

  allTodos.innerHTML = '';
  list.forEach((task) => {
    const colorClass = getLevelColor(task.level);
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-white shadow p-2 rounded';
    li.innerHTML = `
      <div>
        <p class="font-medium ${task.complete ? 'line-through text-gray-400' : ''}">${task.task}</p>
        <div class="text-xs text-gray-500 flex gap-2 items-center">
          ${task.time}
          <span class="rounded-full h-3 w-3 ${colorClass} inline-block" title="${task.level}"></span>
        </div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-xs btn-success  hover:bg-emerald-700" onclick="toggleComplete('${task.id}')"><i class='bx bx-check'></i></button>
        <button class="btn btn-xs btn-error hover:bg-red-700" onclick="deleteTodo('${task.id}')"><i class='bx bx-trash'></i></button>
      </div>`;
    allTodos.appendChild(li);
  });
}

// Calendar Functions
function generateCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  const monthYear = document.getElementById('month-year');

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.innerText = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
  calendar.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isSelected = date === selectedDate;
    calendar.innerHTML += `<div onclick="selectDate('${date}')" class="cursor-pointer p-2 rounded-lg ${isSelected ? 'bg-blue-500 text-white font-bold' : 'hover:bg-blue-100'}">${i}</div>`;
  }
}

function selectDate(date) {
  selectedDate = date;
  generateCalendar(currentYear, currentMonth);
  renderTasksForDate(date);
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
}

// Init
window.onload = function () {
  generateCalendar(currentYear, currentMonth);
  renderTasksForDate(selectedDate);
};

// pomodoro
let pomodoroDuration = 25 * 60; // 25 menit
let remainingTime = pomodoroDuration;
let intervalId = null;

function updateDisplay() {
  const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
  const seconds = String(remainingTime % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startPomodoro() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(intervalId);
      intervalId = null;
      alert('Pomodoro complete! Take a break! 🍅⏱️');
      playSound(); // 🔊 Tambahkan ini
    }
  }, 1000);
}

function playSound() {
  const audio = document.getElementById('pomodoroSound');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function pausePomodoro() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetPomodoro() {
  clearInterval(intervalId);
  intervalId = null;
  remainingTime = pomodoroDuration;
  updateDisplay();
}

document.addEventListener('DOMContentLoaded', updateDisplay);
