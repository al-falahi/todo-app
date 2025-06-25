const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filter = document.getElementById("filter");

loadTasks();

addBtn.onclick = function () {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, completed: false };
        addTask(task);
        saveTask(task);
        taskInput.value = "";
    }
};

function addTask(task) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;

    span.onclick = function () {
        li.classList.toggle("completed");
        toggleCompleted(task.text);
    };

    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.onclick = function () {
        handleEdit(span, task.text, li, editBtn);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.onclick = function () {
        deleteTask(deleteBtn);
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function deleteTask(button) {
    const li = button.parentElement;
    const text = li.querySelector("span").innerText;
    removeTask(text);
    li.remove();
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.filter(t => t.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleCompleted(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.map(t => {
        if (t.text === text) {
            t.completed = !t.completed;
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(addTask);
}

filter.onchange = function () {
    filterTasks(filter.value);
};

function filterTasks(filterValue) {
    const allTasks = document.querySelectorAll("li");

    allTasks.forEach(li => {
        const isCompleted = li.classList.contains("completed");

        if (filterValue === "all") {
            li.style.display = "flex";
        } else if (filterValue === "completed" && isCompleted) {
            li.style.display = "flex";
        } else if (filterValue === "uncompleted" && !isCompleted) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

function handleEdit(span, oldText, li, editBtn) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.style.flex = "1";

    li.insertBefore(input, span);
    li.removeChild(span);
    editBtn.textContent = "save";

    editBtn.onclick = function () {
        const newText = input.value.trim();
        if (newText !== "") {
            span.textContent = newText;
            li.insertBefore(span, input);
            li.removeChild(input);
            editBtn.textContent = "edit";
            updateTaskText(oldText, newText);
            editBtn.onclick = function () {
                handleEdit(span, newText, li, editBtn);
            };
        }
    };
}

function updateTaskText(oldText, newText) {
    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.map(t => {
        if (t.text === oldText) {
            t.text = newText;
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}