// the element that I want to catch from the html file
var inputElement = document.getElementById('iputext');
var submitButton = document.getElementById('ipusubmit');
var taskList = document.getElementById("task-list");
// generate the uuid
function generateUUID() {
    return crypto.randomUUID();
}
// get the task from the localstorge
function getTasks() {
    var storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        return JSON.parse(storedTasks);
    }
    var defaultTasks = [
        { id: generateUUID(), title: "Click to mark as in progress", status: "normal" },
        { id: generateUUID(), title: "Double-click to mark as completed", status: "in-progress" },
        { id: generateUUID(), title: "Click the trash icon to delete", status: "completed" }
    ];
    saveTasks(defaultTasks);
    renderTasks;
    return defaultTasks;
}
//save the tasks from the ts to the localstorage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// add new task
function addTask() {
    var title = inputElement.value.trim();
    if (!title)
        return;
    var newTask = {
        id: generateUUID(),
        title: title,
        status: "normal"
    };
    var tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    inputElement.value = "";
}
//toggle the task status
function toggleStatus(id, type) {
    var tasks = getTasks().map(function (task) {
        if (task.id === id) {
            if (type === "click") {
                task.status = task.status === "normal" ? "in-progress" : "normal";
            }
            else if (type === "dblclick") {
                task.status = task.status === "completed" ? "normal" : "completed";
            }
        }
        return task;
    });
    saveTasks(tasks);
    renderTasks();
}
// delete the task
function deleteTask(id) {
    var tasks = getTasks().filter(function (task) { return task.id !== id; });
    saveTasks(tasks);
    renderTasks();
}
// get the task class
function getTaskClass(status) {
    switch (status) {
        case "in-progress": return "tsk-in-progress";
        case "completed": return "tsk-completed";
        default: return "tsk-normal";
    }
}
function getTaskImage(status) {
    switch (status) {
        case "in-progress": return "asset/in-progress.png";
        case "completed": return "asset/completed.png";
        default: return "asset/normal.png";
    }
}
function renderTasks() {
    taskList.innerHTML = "";
    var tasks = getTasks();
    tasks.forEach(function (task) {
        var li = document.createElement("li");
        li.className = getTaskClass(task.status);
        li.dataset.id = task.id;
        var img = document.createElement("img");
        img.src = getTaskImage(task.status);
        img.className = "check";
        img.alt = "check";
        var span = document.createElement("span");
        span.textContent = task.title;
        var deleteBtn = document.createElement("img");
        deleteBtn.src = "asset/delete.png";
        deleteBtn.onclick = function () { return deleteTask(task.id); };
        deleteBtn.className = "delete";
        deleteBtn.alt = "delete";
        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        li.addEventListener("click", function () { return toggleStatus(task.id, "click"); });
        li.addEventListener("dblclick", function () { return toggleStatus(task.id, "dblclick"); });
        taskList.appendChild(li);
    });
}
submitButton.addEventListener("click", addTask);
inputElement.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
window.onload = renderTasks;
