// middleware/auth.js
// Middleware kiểm tra người dùng đã đăng nhập chưa

function requireLogin(req, res, next) {
    if (!req.session.user) {
        // Chưa đăng nhập -> chuyển hướng tới trang login
        return res.redirect('/login');
    }
    next(); // Đã đăng nhập -> cho đi tiếp
}

// Middleware kiểm tra quyền ADMIN
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'ADMIN') {
        return res.status(403).send('Bạn không có quyền truy cập trang này.');
    }
    next();
}

module.exports = { requireLogin, requireAdmin };