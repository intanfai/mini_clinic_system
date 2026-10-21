const { Registration, Poli } = require("../models");
const { Op } = require("sequelize");

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

exports.getVisitReport = async (req, res) => {
  try {
    const today = formatDate(new Date());
    const defaultStart = new Date(`${today}T00:00:00.000Z`);
    defaultStart.setUTCDate(defaultStart.getUTCDate() - 30);

    const startDate = req.query.startDate || formatDate(defaultStart);
    const endDate = req.query.endDate || today;

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Format tanggal harus YYYY-MM-DD.",
        errors: {},
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: "Tanggal mulai tidak boleh melebihi tanggal akhir.",
        errors: {},
      });
    }

    const registrations = await Registration.findAll({
      attributes: [
        "id",
        "tanggal_kunjungan",
        "poli_id",
        "status",
      ],
      where: {
        tanggal_kunjungan: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Poli,
          attributes: ["nama_poli"],
          required: false,
        },
      ],
      order: [["tanggal_kunjungan", "ASC"]],
    });

    const dailyMap = new Map();
    const poliMap = new Map();

    // Isi tanggal yang tidak memiliki kunjungan dengan nilai 0.
    const cursor = new Date(`${startDate}T00:00:00.000Z`);
    const lastDate = new Date(`${endDate}T00:00:00.000Z`);

    while (cursor <= lastDate) {
      const date = formatDate(cursor);
      dailyMap.set(date, {
        tanggal: date,
        total: 0,
        selesai: 0,
      });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    let totalSelesai = 0;

    for (const registration of registrations) {
      const date = registration.tanggal_kunjungan;
      const daily = dailyMap.get(date);

      if (daily) {
        daily.total += 1;

        if (registration.status === "selesai") {
          daily.selesai += 1;
          totalSelesai += 1;
        }
      }

      const poliName = registration.Poli?.nama_poli || "Tanpa poli";

      if (!poliMap.has(poliName)) {
        poliMap.set(poliName, {
          nama_poli: poliName,
          total: 0,
          selesai: 0,
        });
      }

      const poli = poliMap.get(poliName);
      poli.total += 1;

      if (registration.status === "selesai") {
        poli.selesai += 1;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Laporan kunjungan berhasil diambil.",
      data: {
        periode: {
          mulai: startDate,
          selesai: endDate,
        },
        ringkasan: {
          total_kunjungan: registrations.length,
          kunjungan_selesai: totalSelesai,
          kunjungan_belum_selesai: registrations.length - totalSelesai,
        },
        harian: Array.from(dailyMap.values()),
        per_poli: Array.from(poliMap.values()).sort(
          (a, b) => b.total - a.total
        ),
      },
    });
  } catch (err) {
    console.error("Gagal mengambil laporan kunjungan:", err);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil laporan.",
      errors: {
        detail: err.message,
      },
    });
  }
};
