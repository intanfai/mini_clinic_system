const jwt = require('jsonwebtoken');

// middleware ini jalan SEBELUM controller, tugasnya cek token valid atau nggak
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan',
      errors: {}
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token tidak valid atau kedaluwarsa',
        errors: {}
      });
    }
    req.user = decoded; // simpan data user (dari payload) biar bisa dipakai controller berikutnya
    next(); // lanjut ke middleware/controller selanjutnya
  });
};

// middleware ini cek role, dipakai SETELAH verifyToken
// contoh pemakaian: checkRole(['admin', 'petugas'])
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak punya akses untuk aksi ini',
        errors: {}
      });
    }
    next();
  };
};