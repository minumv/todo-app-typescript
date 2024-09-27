
interface Task {
    text: string;
    completed: boolean;
}

let tasks: Task[] = [];

const saveTasks = (): void => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = (): void => {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        updateTaskList();
        updateStats();
        saveTasks();
    }
};

// Attach these functions to the window object
(window as any).toggleTaskComplete = (index: number): void => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};

(window as any).deleteTask = (index: number): void => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

(window as any).editTask = (index: number): void => {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const updateStats = (): void => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress') as HTMLDivElement;

    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers')!.innerText = `${completedTasks} / ${totalTasks}`;
};

const updateTaskList = (): void => {
    const taskList = document.getElementById('task-list') as HTMLUListElement;
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img width="15" height="15" src="../images/icons8-edit-50.png" onclick="editTask(${index})"/>
                <img width="18" height="18" src="../images/icons8-delete-30.png" onclick="deleteTask(${index})"/>
            </div>
        </div>`;

        taskList.appendChild(listItem);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];

    if (storedTasks.length) {
        tasks.push(...storedTasks);
        updateTaskList();
        updateStats();
    }
});

document.getElementById('newTask')!.addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

