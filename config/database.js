// config/database.js
// File này chịu trách nhiệm kết nối Node.js với SQL Server

require('dotenv').config(); // Đọc các biến trong file .env
const sql = require('mssql'); // Thư viện làm việc với SQL Server

// Cấu hình thông tin kết nối, lấy từ file .env
const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false, // Không cần mã hóa vì chạy trên localhost
        trustServerCertificate: true // Bỏ qua kiểm tra chứng chỉ SSL
    }
};

// Hàm kết nối tới SQL Server, dùng chung cho toàn bộ project
async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('✅ Kết nối SQL Server thành công!');
        return pool;
    } catch (err) {
        console.error('❌ Lỗi kết nối SQL Server:', err.message);
        throw err;
    }
}

module.exports = { connectDB, sql };