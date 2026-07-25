const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middleware (Istilahnya si satpamnya yak atau penerjemahnya)
app.use(cors());
app.use(express.json()); // untuk code ini wajib ada supaya server bisa membaca data JSON yang dikirim client/user

// ==========================================
// 📦 DATABASE TIRUAN (In-Memory Array)
// ==========================================

let todos = [
    {
        id: 1,
        task: 'Belajar Git Flow',
        completed: true
    },
    {
        id: 2,
        task: 'Membuat Dummy CRUD API di Express',
        completed: false
    }
];

// ==========================================
// 🛣️ ROUTES (ENDPOINTS) CRUD
// ==========================================

//1. READ: Ambil semua data To-Do
app.get('/api/todos', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Berhasil mengambil daftar To-Do',
        data: todos
    });
});

//2. CREATE: Tambah data To-Do baru
app.post('/api/todos', (req, res) => {
    const { task } = req.body;

    // Validasi sederhana: task tidak boleh kosong

    if (!task) {
        return res.status(400).json({
            success:false,
            message: 'Tugas (task) tidak boleh kosong!'
        });
    }

    const newTodo= {
        id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1, // Auto increment ID
        task: task,
        completed: false
    };

    todos.push(newTodo);

    res.status(201).json({
        success: true,
        message: 'To-Do berhasil ditambahkan',
        data: newTodo
    });
});

//3. UPDATE: Mengubah status completed / isi task To-Do berdasarkan ID
app.put('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const {task, completed} = req.body;

    const todoIndex = todos.findIndex(t => t.id === todoId);

    if (todoIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'To-Do tidak ditemukan'
        });
    }

    // Updata data jika dikirim dari request, jika tidak pakai data lama

    todos[todoIndex].task = task !== undefined ? task : todos[todoIndex].task;
    todos[todoIndex].completed = completed !== undefined ? completed : todos[todoIndex].completed;

    res.status(200).json({
        success: true,
        message: 'To-Do berhasil diperbarui',
        data: todos[todoIndex]
    }); 
});

//4. DELETE: Menghapus data To-Do berdasarkan ID
app.delete('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const initialLength = todos.length;

    todos = todos.filter(t => t.id !== todoId);

    if (todos.length === initialLength) {
        return res.status(404).json({
            success: false,
            message: 'To-Do tidak ditemukan'
        });
    }

    res.status(200).json({
        success: true,
        message: 'To-Do berhasil dihapus'
    });
});

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});