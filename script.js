const taskInput = document.getElementById('taskInput');
const taskDeadline = document.getElementById('taskDeadline');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    const deadlineValue = taskDeadline.value;


    if (taskText !== "") {
        const newTask = {
            text: taskText,
            deadline: deadlineValue
        };

        let tasks = getTasksFromStorage();
        tasks.push(newTask);
        tasks = sortTasks(tasks);

        localStorage.setItem('smartTasks', JSON.stringify(tasks));

        renderAllTasks();

        taskInput.value = '';
        taskDeadline.value = '';
    }

    else {
        alert("Write your task")
    }
});

function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });
}

function renderAllTasks() {
    taskList.innerHTML = '';
    let tasks = getTasksFromStorage();

    tasks.forEach(function(task) {
        addTaskToDOM(task);
    });
}

function loadTasks() {
    let tasks = getTasksFromStorage();
    tasks = sortTasks(tasks);
    localStorage.setItem('smartTasks', JSON.stringify(tasks));
    renderAllTasks();
}

function addTaskToDOM(task) {

    const li = document.createElement('li');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('task-info');

    const span = document.createElement('span');
    span.textContent = task.text;

    const deadlineSpan = document.createElement('span');
    deadlineSpan.classList.add('deadline-text');

    if (task.deadline){
        deadlineSpan.textContent = `Deadline: ${task.deadline}`

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [year, month, day] = task.deadline.split('-');
        const taskDate = new Date(year, month - 1, day);

        const diffTime = taskDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 *24));

        if (diffDays <= 0) {
            li.classList.add('due-today');
        }
        else if (diffDays <=7) {
            li.classList.add('due-week');
        }
        else if (diffDays <= 30) {
            li.classList.add('due-month');
        }

    }
    else {
        deadlineSpan.textContent = "No deadline";
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');

    span.addEventListener('click', function() {
        li.classList.toggle('completed');
    });

    deleteBtn.addEventListener('click', function() {
        removeTaskFromLocalStorage(task.text);
        renderAllTasks();
    });

    infoDiv.appendChild(span);
    infoDiv.appendChild(deadlineSpan);
    
    li.appendChild(infoDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

}

function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromStorage();

    tasks = tasks.filter(task => task.text !==taskText);

    localStorage.setItem('smartTasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    let tasks;
    if (localStorage.getItem('smartTasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('smartTasks'));
    }
    return tasks;
}