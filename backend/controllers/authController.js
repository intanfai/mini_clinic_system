const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        errors: {}
      });
    }

    // bandingkan password yang diinput dengan hash yang tersimpan
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        errors: {}
      });
    }

    // payload = data yang "ditempel" di dalam token (jangan simpan data sensitif di sini,
    // karena payload JWT bisa dibaca siapa aja meski nggak bisa diubah tanpa ketahuan)
    const payload = { id: user.id, name: user.name, role: user.role };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: { token, user: payload }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errors: { detail: err.message }
    });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Data user berhasil diambil',
    data: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    }
  });
};

exports.logout = async (req, res) => {
   return res.status(200).json({
    success: true,
    message: 'Logout berhasil',
    data: {}
  });
};