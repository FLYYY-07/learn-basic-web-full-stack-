// Import librarry yg dibutuhkan
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
// const db = require("./app/models");
require("dotenv").config(); // langsung mengaktifkan dotenv

//2.Inisialisasi express
const app = express();

// 3. Pasang Midleware  (satpan & penerjemah)
app.use(cors()); //Mengizinkan frontend mengakses API ini nanti di iniin
app.use(express.json()); //Menerjemahkan data JSON yang dikirim frontend agar bisa dibaca backend

// 4. Membuat route/Endpoint uji coba pertama
app.get("/", (req, res) => {
    res.send({ message: "Congratulation! your To do list app already running successfully" });
});

// 5. Menentukan port server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running in server.js on port: ' + PORT);
    // db.sequelize.sync(); // Menyinkronkan model dengan database
});
