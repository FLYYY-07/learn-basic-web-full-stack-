require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import koneksi database
const Todo = require('./models/Todo');     // Import model Todo

const app = express();

// Jalankan koneksi ke database MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Supaya server bisa membaca data JSON yang dikirim client

// Route dasar (Health Check)
app.get('/', (req, res) => {
    res.status(200).send('Server TO-DO List API berjalan dengan lancar!');
});

// ==========================================
// 🛣️ ROUTES (ENDPOINTS) CRUD MONGODB
// ==========================================

// 1. READ: Ambil semua data To-Do dari MongoDB
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 }); // Urutkan dari yang terbaru
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil daftar To-Do dari MongoDB',
            data: todos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data To-Do',
            error: error.message
        });
    }
});

// 2. CREATE: Tambah data To-Do baru ke MongoDB
app.post('/api/todos', async (req, res) => {
    try {
        const { task } = req.body;

        const newTodo = await Todo.create({
            task: task
        });

        res.status(201).json({
            success: true,
            message: 'To-Do berhasil ditambahkan ke MongoDB',
            data: newTodo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Gagal menambahkan To-Do',
            error: error.message
        });
    }
});

// 3. UPDATE: Mengubah status completed / isi task To-Do berdasarkan ID MongoDB
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { task, completed } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { task, completed },
            { new: true, runValidators: true } // Return data terbaru & jalankan validasi
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: 'To-Do tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'To-Do berhasil diperbarui',
            data: updatedTodo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Gagal memperbarui To-Do',
            error: error.message
        });
    }
});

// 4. DELETE: Menghapus data To-Do berdasarkan ID MongoDB
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: 'To-Do tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'To-Do berhasil dihapus dari MongoDB'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus To-Do',
            error: error.message
        });
    }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});