// Pastikan port mengarah ke 5000
const API_URL = 'http://localhost:5000/api/todos';

// Tangkap elemen HTML berdasarkan ID
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 1. READ: Ambil daftar to-do dari backend
async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      renderTodos(result.data);
    }
  } catch (error) {
    console.error('Failed to retrieve todos:', error);
  }
}

// 2. Render item ke HTML
function renderTodos(todos) {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    li.innerHTML = `
      <span>${todo.task}</span>
      <div class="action">
        <button onclick="toggleTodo('${todo._id}', ${todo.completed})">
          ${todo.completed ? 'Batal' : 'Selesai'}
        </button>
        <button class="btn-delete" onclick="deleteTodo('${todo._id}')">Hapus</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// 3. CREATE: Tambah to-do baru saat submit form
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  if (!task) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task })
    });

    const result = await response.json();
    if (result.success) {
      todoInput.value = '';
      fetchTodos();
    }
  } catch (error) {
    console.error('Gagal menambah task:', error);
  }
});

// 4. UPDATE: Toggle status selesai
async function toggleTodo(id, currentStatus) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus })
    });

    const result = await response.json();
    if (result.success) {
      fetchTodos();
    }
  } catch (error) {
    console.error('Gagal memperbarui status:', error);
  }
}

// 5. DELETE: Hapus to-do
async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (result.success) {
      fetchTodos();
    }
  } catch (error) {
    console.error('Gagal menghapus task:', error);
  }
}

// Muat data saat halaman dibuka
fetchTodos();