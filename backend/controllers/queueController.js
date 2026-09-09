const { Queue, Registration, Patient, Doctor, Poli } = require("../models");

exports.getQueues = async (req, res) => {
  try {
    const queues = await Queue.findAll({
      include: [
        {
          model: Registration,
          include: [
            {
              model: Patient,
            },
            {
              model: Doctor,
            },
            {
              model: Poli,
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: queues,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: {
        detail: err.message,
      },
    });
  }
};

exports.callQueue = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Antrean tidak ditemukan",
        errors: {},
      });
    }

    if (queue.status !== "menunggu") {
      return res.status(400).json({
        success: false,
        message: "Antrean tidak dapat dipanggil",
        errors: {
          status: "Antrean harus berstatus menunggu",
        },
      });
    }

    await queue.update({
      status: "dipanggil",
    });

    return res.status(200).json({
      success: true,
      message: "Antrean berhasil dipanggil",
      data: queue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: {
        detail: err.message,
      },
    });
  }
};

exports.createQueue = async (req, res) => {
  try {
    const { registration_id } = req.body;

    if (!registration_id) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: {
          registration_id: "Registration ID wajib diisi",
        },
      });
    }

    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Pendaftaran tidak ditemukan",
        errors: {},
      });
    }

    // Cek apakah registration sudah memiliki antrean
    const existingQueue = await Queue.findOne({
      where: { registration_id },
    });

    if (existingQueue) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: {
          registration_id: "Pendaftaran sudah memiliki nomor antrean",
        },
      });
    }

    // Hitung jumlah antrean pada tanggal kunjungan yang sama
    const queueCount = await Queue.count({
      include: [
        {
          model: Registration,
          where: {
            tanggal_kunjungan: registration.tanggal_kunjungan,
            poli_id: registration.poli_id,
          },
        },
      ],
    });

    const nomor_antrean = String(queueCount + 1).padStart(3, "0");
    const queue = await Queue.create({
      registration_id,
      nomor_antrean,
      status: "menunggu",
    });

    return res.status(201).json({
      success: true,
      message: "Success",
      data: queue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: {
        detail: err.message,
      },
    });
  }
};

exports.callNextQueue = async (req, res) => {
  try {
    const queue = await Queue.findOne({
      where: {
        status: "menunggu",
      },
      order: [["createdAt", "ASC"]],
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada antrean yang menunggu",
        errors: {},
      });
    }

    await queue.update({
      status: "dipanggil",
    });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: queue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: {
        detail: err.message,
      },
    });
  }
};

exports.updateQueueStatus = async (req, res) => {
  try {
    const queue = await Queue.findByPk(req.params.id);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Antrean tidak ditemukan",
        errors: {},
      });
    }

    const { status } = req.body;

    const allowedStatus = ["menunggu", "dipanggil", "selesai"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: {
          status: "Status tidak valid",
        },
      });
    }

    await queue.update({ status });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: queue,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      errors: {
        detail: err.message,
      },
    });
  }
};
