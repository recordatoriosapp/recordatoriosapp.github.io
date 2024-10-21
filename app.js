document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.getElementsByClassName('close-btn')[0];
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const navInicio = document.getElementById('nav-inicio');
    const navCalendario = document.getElementById('nav-calendario');
    const navRacha = document.getElementById('nav-racha');
    const inicioSection = document.getElementById('inicio');
    const calendarioSection = document.getElementById('calendario');
    const rachaSection = document.getElementById('racha');
    const calendarDiv = document.getElementById('calendar');
    const rachaCountElem = document.getElementById('racha-count');
    const motivationalMessageElem = document.getElementById('motivational-message');
    let tasks = [];
    let rachaCount = 0;
    let currentTaskId = null;

    loadTasks();

    addTaskBtn.onclick = function() {
        taskModal.style.display = "block";
    };

    closeBtn.onclick = function() {
        taskModal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == taskModal) {
            taskModal.style.display = "none";
        }
    };

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('subject').value;
        const taskTitle = document.getElementById('task-title').value;
        const dueDate = document.getElementById('due-date').value;
        const dueTime = document.getElementById('due-time').value;

        if (currentTaskId !== null) {
            editTask(currentTaskId, subject, taskTitle, dueDate, dueTime);
        } else {
            addTask(subject, taskTitle, dueDate, dueTime);
        }

        taskForm.reset();
        taskModal.style.display = "none";
        currentTaskId = null;
    });

    navInicio.onclick = function() {
        navInicio.classList.add('active');
        navCalendario.classList.remove('active');
        navRacha.classList.remove('active');
        inicioSection.style.display = 'block';
        calendarioSection.style.display = 'none';
        rachaSection.style.display = 'none';
    };

    navCalendario.onclick = function() {
        navInicio.classList.remove('active');
        navCalendario.classList.add('active');
        navRacha.classList.remove('active');
        inicioSection.style.display = 'none';
        calendarioSection.style.display = 'block';
        rachaSection.style.display = 'none';
        renderCalendar();
    };

    navRacha.onclick = function() {
        navInicio.classList.remove('active');
        navCalendario.classList.remove('active');
        navRacha.classList.add('active');
        inicioSection.style.display = 'none';
        calendarioSection.style.display = 'none';
        rachaSection.style.display = 'block';
    };

    function addTask(subject, taskTitle, dueDate, dueTime) {
        const taskId = Date.now();
        const taskData = { taskId, subject, taskTitle, dueDate, dueTime };
        tasks.push(taskData);
        saveTasks();
        renderTask(taskData);
    }

    function editTask(taskId, subject, taskTitle, dueDate, dueTime) {
        const taskIndex = tasks.findIndex(task => task.taskId === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { taskId, subject, taskTitle, dueDate, dueTime };
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.taskId !== taskId);
        saveTasks();
        renderTasks();
    }

    function completeTask(taskId) {
        deleteTask(taskId);
        rachaCount++;
        rachaCountElem.textContent = rachaCount;
        showMotivationalMessage();
    }

    function showMotivationalMessage() {
        const messages = [
            "¡Sigue así! ¡Vas por buen camino!",
            "¡Excelente trabajo! ¡No te detengas ahora!",
            "¡Cada tarea completada te acerca más a tus metas!",
            "¡Lo estás haciendo genial! ¡Sigue adelante!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        motivationalMessageElem.textContent = randomMessage;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('rachaCount', rachaCount);
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
        rachaCount = parseInt(localStorage.getItem('rachaCount')) || 0;
        rachaCountElem.textContent = rachaCount;
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(renderTask);
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.textContent = `${task.subject} - ${task.taskTitle} - ${task.dueDate} ${task.dueTime}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-complete-checkbox');
        checkbox.onclick = () => completeTask(task.taskId);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => {
            document.getElementById('subject').value = task.subject;
            document.getElementById('task-title').value = task.taskTitle;
            document.getElementById('due-date').value = task.dueDate;
            document.getElementById('due-time').value = task.dueTime;
            taskModal.style.display = 'block';
            currentTaskId = task.taskId;
        };

        li.prepend(checkbox);
        li.appendChild(editBtn);

        taskList.appendChild(li);
    }

    function renderCalendar() {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: tasks.map(task => ({
                title: task.taskTitle,
                start: task.dueDate,
                description: `Materia: ${task.subject}, Hora de entrega: ${task.dueTime}`
            }))
        });
        calendar.render();
    }
});
