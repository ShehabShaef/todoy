// the data interface that will be used
interface Task {
    id: string;
    title: string;
    status: 'normal' | 'in-progress' | 'completed';
}

// the element that I want to catch from the html file
const inputElement = document.getElementById('iputext') as HTMLInputElement;
const submitButton = document.getElementById('ipusubmit') as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;

// generate the uuid
function generateUUID(): string {
    return crypto.randomUUID();
}

// get the task from the localstorge
function getTasks(): Task[] {
    const storedTasks = localStorage.getItem("tasks");


    if (storedTasks) {
        return JSON.parse(storedTasks);
    }

    const defaultTasks: Task[] = [
        { id: generateUUID(), title: "Click to mark as in progress", status: "normal" },
        { id: generateUUID(), title: "Double-click to mark as completed", status: "in-progress" },
        { id: generateUUID(), title: "Click the trash icon to delete", status: "completed" }
    ];

    saveTasks(defaultTasks);
    renderTasks
    return defaultTasks;
}
//save the tasks from the ts to the localstorage
function saveTasks(tasks: Task[]): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// add new task
function addTask(): void {
    const title = inputElement.value.trim();
    if (!title) return;

    const newTask: Task = {
        id: generateUUID(),
        title,
        status: "normal"
    };

    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
    inputElement.value = "";
}

//toggle the task status
function toggleStatus(id: string, type: "click" | "dblclick"): void {
    const tasks = getTasks().map(task => {
        if (task.id === id) {
            if (type === "click") {
                task.status = task.status === "normal" ? "in-progress" : "normal";
            } else if (type === "dblclick") {
                task.status = task.status === "completed" ? "normal" : "completed";
            }
        }
        return task;
    });
    saveTasks(tasks);
    renderTasks();
}

// delete the task
function deleteTask(id: string): void {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    renderTasks();
}

// get the task class
function getTaskClass(status: string): string {
    switch (status) {
        case "in-progress": return "tsk-in-progress";
        case "completed": return "tsk-completed";
        default: return "tsk-normal";
    }
}

function getTaskImage(status: string): string {
    switch (status) {
        case "in-progress": return "asset/in-progress.png";
        case "completed": return "asset/completed.png";
        default: return "asset/normal.png";
    }
}

function renderTasks(): void {
    taskList.innerHTML ="";
    const tasks = getTasks();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = getTaskClass(task.status);
        li.dataset.id = task.id;

        const img = document.createElement("img");
        img.src = getTaskImage(task.status);
        img.className = "check";
        img.alt = "check";

        const span = document.createElement("span");
        span.textContent = task.title;

        const deleteBtn = document.createElement("img");
        deleteBtn.src = "asset/delete.png";
        deleteBtn.onclick = () => deleteTask(task.id);
        deleteBtn.className = "delete";
        deleteBtn.alt = "delete"

        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        li.addEventListener("click", () => toggleStatus(task.id, "click"));
        li.addEventListener("dblclick", () => toggleStatus(task.id, "dblclick"));

        taskList.appendChild(li);
    });
}
submitButton.addEventListener("click", addTask);
inputElement.addEventListener("keypress", (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
window.onload = renderTasks;