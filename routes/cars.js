// routes/cars.js
const express = require('express');
const router = express.Router();
const { sql } = require('../config/database');

// GET /cars -> hiển thị danh sách xe
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';

        const request = new sql.Request();
        request.input('search', sql.NVarChar, `%${search}%`);

        const result = await request.query(`
            SELECT c.*, cat.CategoryName
            FROM Cars c
            JOIN Categories cat ON c.CategoryID = cat.CategoryID
            WHERE c.CarName LIKE @search OR c.Model LIKE @search
            ORDER BY c.CarID
        `);

        res.render('cars', {
            cars: result.recordset,
            search: search
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách xe:', err.message);
        res.status(500).send('Có lỗi xảy ra khi tải danh sách xe.');
    }
});

// GET /cars/:id -> hiển thị chi tiết 1 xe
router.get('/:id', async (req, res) => {
    try {
        const carId = req.params.id; // Lấy ID từ URL, ví dụ /cars/5 -> carId = "5"

        const request = new sql.Request();
        request.input('id', sql.Int, carId);

        const result = await request.query(`
            SELECT c.*, cat.CategoryName
            FROM Cars c
            JOIN Categories cat ON c.CategoryID = cat.CategoryID
            WHERE c.CarID = @id
        `);

        // Nếu không tìm thấy xe nào có ID này
        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy xe này.');
        }

        const car = result.recordset[0]; // Lấy ra xe đầu tiên (và duy nhất) trong kết quả

        res.render('car-detail', { car: car });
    } catch (err) {
        console.error('Lỗi khi lấy chi tiết xe:', err.message);
        res.status(500).send('Có lỗi xảy ra khi tải chi tiết xe.');
    }
});

module.exports = router;