const taskname = document.getElementById('taskname');
const addtask = document.getElementById('addtask');
const tasklist = document.getElementById('list');

const API = 'http://localhost:3000/tasks';

function renderTask(todo) {
    const taskbox = document.createElement('div');
    taskbox.className = 'task';
    taskbox.id = `task${todo._id}007`;
    const list = document.createElement('span');
    list.textContent = todo.task;

    list.addEventListener('click', async () => {
        const newTask = prompt("Edit Task: ");
        if (!newTask) return;
        const response = await fetch(`${API}/${todo._id}`, { 
            method: 'PATCH' , headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ task: newTask })
        })
        if (response.ok) {
            const updatedTask = await response.json();
            list.textContent = updatedTask.task;
        } else {
            console.error("Failed to update task");
        }
    })
    
    const deletebutton = document.createElement('button');
    deletebutton.className = 'delete';
    deletebutton.textContent = 'Delete';
    deletebutton.addEventListener('click', async () => {
        await fetch(`${API}/${todo._id}`, { method: 'DELETE' });
        tasklist.removeChild(taskbox);
    });
    
    const donebutton = document.createElement('button');
    if(todo.completed) {
        list.style.textDecoration = 'line-through';
        donebutton.textContent = 'Undone';
        donebutton.className = 'undone';
    } else {
        list.style.textDecoration = 'none';
        donebutton.textContent = 'Done';
        donebutton.className = 'done';
    }

    donebutton.addEventListener('click', async () => {
        const response = await fetch(`${API}/${todo._id}`, { 
            method: 'PATCH' , headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ completed: !todo.completed })
        });

        const updated = await response.json();
        todo.completed = updated.completed;
        if(updated.completed) {
            list.style.textDecoration = 'line-through';
            donebutton.textContent = 'Undone';
            donebutton.className = 'undone';
        } else {
            list.style.textDecoration = 'none';
            donebutton.textContent = 'Done';
            donebutton.className = 'done';
        }
    });
    taskbox.appendChild(list);
    taskbox.appendChild(donebutton);
    taskbox.appendChild(deletebutton);
    tasklist.appendChild(taskbox);
}

async function loadTasks() {
    const response = await fetch(API);
    const tasks = await response.json();
    tasks.forEach(renderTask);
}

window.addEventListener('DOMContentLoaded', loadTasks);


addtask.addEventListener('click', async () => {
    const task = taskname.value.trim();
    if(!task) return;
    const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
    });
    const newTask = await response.json();
    renderTask(newTask);
    taskname.value = '';
    addtask.disabled = true;
});

taskname.addEventListener('input', () => {
    if(taskname.value.trim() === "")  {
        addtask.disabled = true;
    } else {
        addtask.disabled = false;
    }
});

taskname.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskname.value.trim() !== "") {
        addtask.click();
    }
});