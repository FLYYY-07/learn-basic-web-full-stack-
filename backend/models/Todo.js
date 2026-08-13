const mongoose = require('mongoose');

// 1. Buat Schema (Rancangan struktur data To-Do)
const todoSchema = new mongoose.Schema(
    {
        task: {
            type: String,
            required: [true, 'Tugas (task) wajib diisi!'],
            trim: true // Otomatis hapus spapsi berlebihan di awal/akhir string
        },
        completed: {
            type: Boolean,
            default: false // Nilai default saat pertama dibuat adalah false (belum selesai)
        }
    },
    {
        timestamps: true // Otomatis menambahkan cretaedAt dan updatedAt
    }
);

// 2. Buat Model (Mewakili collection To-Do di MongoDB)
module.exports = mongoose.model ('Todo', todoSchema);