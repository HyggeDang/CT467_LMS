const pool = require("../../database");
const checkValid = (input) => {
  let errors = [];
  Object.entries(input).forEach(([key, value]) => {
    if (value == null || value === "") {
      errors.push(`Trường '${key}' là bắt buộc và không được để trống.`);
    }
  });
  return errors;
};
const lmsDeleteController = {
  xoaNguoiDung: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.body?.idNguoiDung, 10);
      let errors = checkValid({
        idNguoiDung,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query("call Xoa_NguoiDung(?)", [
          idNguoiDung,
        ]);
        res
          .status(200)
          .json({ success: true, message: "Xóa đọc giả thành công", result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  xoaNhaXuatBan: async (req, res) => {
    try {
      const idNXB = parseInt(req.body?.idNXB, 10);
      let errors = checkValid({
        idNXB,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query("call Xoa_NhaXuatBan(?)", [
          idNXB,
        ]);
        res
          .status(200)
          .json({ success: true, message: "Xóa Nhà Xuất Bản thành công", result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  xoaTacGia: async (req, res) => {
    try {
      const idTacGia = parseInt(req.body?.idTacGia, 10);
      let errors = checkValid({
        idTacGia,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query("call Xoa_TacGia(?)", [
          idTacGia,
        ]);
        res
          .status(200)
          .json({ success: true, message: "Xóa Tác giả thành công", result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  xoaTheLoaiSach: async (req, res) => {
    try {
      const idTheLoaiSach = parseInt(req.body?.idTheLoaiSach, 10);
      let errors = checkValid({
        idTheLoaiSach,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query("call Xoa_TheLoaiSach(?)", [
          idTheLoaiSach,
        ]);
        res
          .status(200)
          .json({ success: true, message: "Xóa Thể loại sách thành công", result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
};
module.exports = lmsDeleteController;
