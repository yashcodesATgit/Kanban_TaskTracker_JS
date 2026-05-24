/**
 * Kanban Board Application Logic
 * Implements: CRUD operations, LocalStorage persistence, and live drag-and-drop sorting.
 */

// Default Seeding State
const defaultTasks = [
  {
    id: "task-1",
    title: "Build Api",
    description: "Setup the nodejs and express for the Backend",
    status: "todo",
    priority: "high",
    tag: "Backend"
  },
  {
    id: "task-2",
    title: "Register",
    description: "Create register page with react",
    status: "todo",
    priority: "medium",
    tag: "Frontend"
  },
  {
    id: "task-3",
    title: "Integrate login",
    description: "Integrate Login APIs",
    status: "todo",
    priority: "high",
    tag: "Backend"
  },
  {
    id: "task-4",
    title: "Login page",
    description: "Create Login page with react",
    status: "inprogress",
    priority: "medium",
    tag: "Frontend"
  },
  {
    id: "task-6",
    title: "Build Dashboard",
    description: "Implement user summary and activity widgets",
    status: "inprogress",
    priority: "high",
    tag: "Frontend"
  },
  {
    id: "task-5",
    title: "Initiate Project",
    description: "Setup the environment for the mern project",
    status: "done",
    priority: "low",
    tag: "Setup"
  }
];

// Load tasks from localStorage or seed defaults
let tasks = JSON.parse(localStorage.getItem('kanban-tasks-v2'));
if (!tasks) {
  tasks = [...defaultTasks];
  localStorage.setItem('kanban-tasks-v2', JSON.stringify(tasks));
}

// DOM Query Selectors
const board = document.querySelector('.board');
const modalOverlay = document.getElementById('task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const taskForm = document.getElementById('task-form');

const lists = {
  todo: document.getElementById('list-todo'),
  inprogress: document.getElementById('list-inprogress'),
  done: document.getElementById('list-done')
};

const counters = {
  todo: document.getElementById('count-todo'),
  inprogress: document.getElementById('count-inprogress'),
  done: document.getElementById('count-done')
};

// Core Tasks Management Functions

/**
 * Saves current task state array into localStorage.
 */
function saveTasks() {
  localStorage.setItem('kanban-tasks-v2', JSON.stringify(tasks));
}

/**
 * Returns Tailwind class names for custom category tags.
 * @param {string} tag The tag name
 */
function getTagClass(tag) {
  const clean = tag.toLowerCase();
  if (clean === 'backend') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  if (clean === 'frontend') return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
  if (clean === 'setup') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  return 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50';
}

/**
 * Returns dot glow colors for card priority indicator.
 * @param {string} p The priority status
 */
function getPriorityDotClass(p) {
  if (p === 'high') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  if (p === 'medium') return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
  return 'bg-zinc-400 dark:bg-zinc-500';
}

/**
 * Returns text styles for card priority description.
 * @param {string} p The priority status
 */
function getPriorityTextClass(p) {
  if (p === 'high') return 'text-red-400';
  if (p === 'medium') return 'text-amber-400';
  return 'text-zinc-400';
}

/**
 * Creates the DOM element for a task card.
 * @param {Object} task The task object
 */
function createTaskCard(task) {
  const card = document.createElement('div');
  
  // Status-specific borders, gradient background, and glowing shadow colors
  let statusClass = "";
  if (task.status === "todo") {
    statusClass = "border-l-4 border-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.06)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)]";
  } else if (task.status === "inprogress") {
    statusClass = "border-l-4 border-amber-500 shadow-[0_4px_12px_rgba(245,158,11,0.06)] hover:shadow-[0_8px_24px_rgba(245,158,11,0.15)]";
  } else if (task.status === "done") {
    statusClass = "border-l-4 border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.06)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.15)]";
  }

  card.className = `task-card bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-3 cursor-grab select-none hover:-translate-y-0.5 transition-all duration-200 ${statusClass}`;
  card.setAttribute('draggable', 'true');
  card.dataset.id = task.id;

  // Meta Row (Tag + Priority)
  const metaRow = document.createElement('div');
  metaRow.className = 'flex justify-between items-center';

  const tagLabel = task.tag && task.tag.trim() !== '' ? task.tag : 'General';
  const tagBadge = document.createElement('span');
  tagBadge.className = `text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getTagClass(tagLabel)}`;
  tagBadge.textContent = tagLabel;
  metaRow.appendChild(tagBadge);

  const priorityBadge = document.createElement('div');
  priorityBadge.className = 'flex items-center gap-1.5';
  
  const priority = task.priority || 'medium';
  const dot = document.createElement('span');
  dot.className = `w-1.5 h-1.5 rounded-full ${getPriorityDotClass(priority)}`;
  
  const label = document.createElement('span');
  label.className = `text-[11px] font-medium ${getPriorityTextClass(priority)}`;
  label.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
  
  priorityBadge.appendChild(dot);
  priorityBadge.appendChild(label);
  metaRow.appendChild(priorityBadge);

  card.appendChild(metaRow);

  // Task Title
  const title = document.createElement('h3');
  title.className = 'task-title text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-snug';
  title.textContent = task.title;
  card.appendChild(title);

  // Task Description (if present)
  if (task.description && task.description.trim() !== '') {
    const desc = document.createElement('p');
    desc.className = 'task-desc text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed';
    desc.textContent = task.description;
    card.appendChild(desc);
  }

  // Card Footer containing Delete Button
  const footer = document.createElement('div');
  footer.className = 'flex justify-end mt-1';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-500 text-xs font-semibold px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition duration-150 cursor-pointer flex items-center gap-1';
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
    Delete
  `;
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent drag trigger on click
    deleteTask(task.id);
  });

  footer.appendChild(deleteBtn);
  card.appendChild(footer);

  // Drag Event Listeners on Card
  card.addEventListener('dragstart', (e) => {
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', task.id);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    // Save visual layout order
    updateTasksOrder();
  });

  return card;
}

/**
 * Re-renders the entire board columns based on the global tasks state.
 */
function renderBoard() {
  // Clear lists
  Object.values(lists).forEach(list => {
    list.innerHTML = '';
  });

  // Track task counts per column
  const count = { todo: 0, inprogress: 0, done: 0 };

  // Append cards
  tasks.forEach(task => {
    const cardElement = createTaskCard(task);
    const listContainer = lists[task.status];
    if (listContainer) {
      listContainer.appendChild(cardElement);
      count[task.status]++;
    }
  });

  // Update headers badges
  Object.keys(counters).forEach(status => {
    if (counters[status]) {
      counters[status].textContent = count[status];
    }
  });

  // Render empty column state placeholder if no tasks are present
  Object.keys(lists).forEach(status => {
    const listContainer = lists[status];
    if (count[status] === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl py-12 px-4 text-center text-zinc-500 gap-2 select-none h-full bg-transparent';
      emptyState.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01"/></svg>
        <span class="text-xs font-semibold text-zinc-400">Column Empty</span>
        <span class="text-[10px] text-zinc-600">Drag items here or click create</span>
      `;
      listContainer.appendChild(emptyState);
    }
  });
}

/**
 * Add a new task to the local state.
 * @param {string} title 
 * @param {string} description 
 * @param {string} status 
 * @param {string} priority
 * @param {string} tag
 */
function addTask(title, description, status, priority, tag) {
  const newTask = {
    id: 'task-' + Date.now(),
    title: title.trim(),
    description: description.trim(),
    status: status,
    priority: priority,
    tag: tag.trim()
  };
  tasks.push(newTask);
  saveTasks();
  renderBoard();
}

/**
 * Delete task from local state and update display.
 * @param {string} id 
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderBoard();
}

/**
 * Rebuild tasks array using current visual layout DOM order.
 */
function updateTasksOrder() {
  const columns = ['todo', 'inprogress', 'done'];
  const newOrderedTasks = [];

  columns.forEach(status => {
    const listContainer = lists[status];
    const cards = listContainer.querySelectorAll('.task-card');
    cards.forEach(card => {
      const cardId = card.dataset.id;
      const matchingTask = tasks.find(t => t.id === cardId);
      if (matchingTask) {
        matchingTask.status = status; // Update status in case it was dragged to another column
        newOrderedTasks.push(matchingTask);
      }
    });
  });

  // Keep any tasks that might not have been rendered (fallback protection)
  tasks.forEach(task => {
    if (!newOrderedTasks.some(t => t.id === task.id)) {
      newOrderedTasks.push(task);
    }
  });

  tasks = newOrderedTasks;
  saveTasks();
  
  // Re-render to ensure task count badges are updated correctly
  renderBoard();
}

// Modal Interactivity Handlers
function openModal() {
  modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
  modalOverlay.classList.add('opacity-100', 'pointer-events-auto');
  const container = document.getElementById('modal-container');
  container.classList.remove('scale-95');
  container.classList.add('scale-100');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.getElementById('task-title').focus();
}

function closeModal() {
  modalOverlay.classList.remove('opacity-100', 'pointer-events-auto');
  modalOverlay.classList.add('opacity-0', 'pointer-events-none');
  const container = document.getElementById('modal-container');
  container.classList.remove('scale-100');
  container.classList.add('scale-95');
  modalOverlay.setAttribute('aria-hidden', 'true');
  taskForm.reset();
}

// Modal Event Listeners
addTaskBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelTaskBtn.addEventListener('click', closeModal);

// Close modal when clicking on the outside overlay
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Form submission handler
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const desc = document.getElementById('task-desc').value;
  const status = document.getElementById('task-status').value;
  const priority = document.getElementById('task-priority').value;
  const tag = document.getElementById('task-tag').value || 'General';

  if (title.trim() === '') return;

  addTask(title, desc, status, priority, tag);
  closeModal();
});

// Drag and Drop Helper Calculations

/**
 * Calculates the element that the dragged element is hovering right above.
 * @param {HTMLElement} listContainer The column list element.
 * @param {number} y The cursor's viewport Y coordinate.
 */
function getDragAfterElement(listContainer, y) {
  // Select all task cards that are NOT currently being dragged
  const cards = [...listContainer.querySelectorAll('.task-card:not(.dragging)')];

  return cards.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    // Offset represents distance from middle of the card
    const offset = y - box.top - box.height / 2;
    
    // We only care if the cursor is above the card's middle (offset < 0)
    // We want the closest negative offset (nearest element below cursor)
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Add drop listeners on lists
Object.keys(lists).forEach(status => {
  const listContainer = lists[status];
  const columnElement = document.getElementById(`column-${status}`);

  listContainer.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required to allow drop action
    
    const draggingCard = document.querySelector('.dragging');
    if (!draggingCard) return;

    const afterElement = getDragAfterElement(listContainer, e.clientY);
    
    if (afterElement == null) {
      listContainer.appendChild(draggingCard);
    } else {
      listContainer.insertBefore(draggingCard, afterElement);
    }
  });

  // Adding visually active styles on column dragenter
  columnElement.addEventListener('dragenter', (e) => {
    e.preventDefault();
    columnElement.classList.remove('border-transparent');
    columnElement.classList.add('border-zinc-700', 'bg-zinc-800/30');
  });

  columnElement.addEventListener('dragleave', () => {
    columnElement.classList.add('border-transparent');
    columnElement.classList.remove('border-zinc-700', 'bg-zinc-800/30');
  });

  columnElement.addEventListener('drop', () => {
    columnElement.classList.add('border-transparent');
    columnElement.classList.remove('border-zinc-700', 'bg-zinc-800/30');
  });
});


// App Initialization
renderBoard();
