// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');
const clearAllBtn = document.getElementById('clearAll');

// Todo array to store tasks
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateStats();
});

// Add task functionality
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        showNotification('Please enter a task!', 'error');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(newTask);
    saveTodos();
    renderTodos();
    updateStats();
    
    // Clear input and focus
    taskInput.value = '';
    taskInput.focus();
    
    showNotification('Task added successfully!', 'success');
}

// Render todos to DOM
function renderTodos() {
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
        return;
    }
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" title="Delete task">×</button>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTask(todo.id));
        deleteBtn.addEventListener('click', () => deleteTask(todo.id));
        
        todoList.appendChild(li);
    });
}

// Toggle task completion
function toggleTask(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
    showNotification('Task deleted!', 'info');
}

// Clear completed tasks
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
    updateStats();
    showNotification(`${completedCount} completed task(s) cleared!`, 'info');
}

// Clear all tasks
function clearAll() {
    if (todos.length === 0) {
        showNotification('No tasks to clear!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks?')) {
        const taskCount = todos.length;
        todos = [];
        saveTodos();
        renderTodos();
        updateStats();
        showNotification(`${taskCount} task(s) cleared!`, 'info');
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    
    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completed: ${completed}`;
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = '#17a2b8';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
    }
`;
document.head.appendChild(style);

// Event listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// Add some sample tasks on first load if no todos exist
if (todos.length === 0) {
    const sampleTasks = [
        'Learn JavaScript DOM manipulation',
        'Build a To-Do app',
        'Practice event handling',
        'Master localStorage'
    ];
    
    sampleTasks.forEach((task, index) => {
        setTimeout(() => {
            const newTask = {
                id: Date.now() + index,
                text: task,
                completed: false,
                createdAt: new Date().toISOString()
            };
            todos.push(newTask);
            saveTodos();
            renderTodos();
            updateStats();
        }, index * 200);
    });
} 