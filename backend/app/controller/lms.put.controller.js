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
const lmsPutController = {
  
  suaKhoanPhat: async (req, res) => {
    try {
      const idKhoanPhat = parseInt(req.body?.idKhoanPhat, 10);
      const idMuonSach = parseInt(req.body?.idMuonSach, 10);
      const ngayGhiNhan = req.body?.ngayGhiNhan;
      const soTienPhat = parseInt(req.body?.soTienPhat, 10);
      const trangThai = req.body?.trangThai;
      let errors = checkValid({ idMuonSach, ngayGhiNhan, soTienPhat, trangThai});
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_KhoanPhat(?, ?, ?, ?, ?)",
          [idKhoanPhat, idMuonSach, ngayGhiNhan, soTienPhat, trangThai]
        );
        res.status(200).json({ success: true, message: 'Sửa khoản phạt thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaMatKhauNguoiDung: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.body?.idNguoiDung, 10);
      const matKhauMoi = req.body?.matKhauMoi;
      let errors = checkValid({ idNguoiDung, matKhauMoi});
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_MatKhauNguoiDung(?, ?)",
          [idNguoiDung, matKhauMoi]
        );
        res.status(200).json({ success: true, message: 'Sửa mật khẩu thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaMuonSach: async (req, res) => {
    try {
      const idMuonSach = parseInt(req.body?.idMuonSach, 10);
      const idNguoiDung = parseInt(req.body?.idNguoiDung, 10);
      const idSach = parseInt(req.body?.idSach, 10);
      const ngayMuon = req.body?.ngayMuon;
      const ngayHenTra = req.body?.ngayHenTra;
      const ngayTraThucTe = req.body?.ngayTraThucTe;
      const trangThaiMuon = req.body?.trangThaiMuon;
      const idThuThu = parseInt(req.body?.idThuThu, 10);
      let errors = checkValid({ idNguoiDung, idSach, ngayMuon, ngayHenTra, trangThaiMuon, idThuThu });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_MuonSach(?, ?, ?, ?, ?, ?, ?, ?)",
          [idMuonSach, idNguoiDung, idSach, ngayMuon, ngayHenTra, ngayTraThucTe, trangThaiMuon, idThuThu]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin mượn sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaNguoiDung: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.body?.idNguoiDung, 10);
      const hoTen = req.body?.hoTen;
      const soDienThoai = req.body?.soDienThoai;
      const email = req.body?.email;
      const diaChi = req.body?.diaChi;
      let errors = checkValid({ hoTen, soDienThoai, email, diaChi });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_NguoiDung(?, ?, ?, ?, ?)",
          [idNguoiDung, hoTen, soDienThoai, email, diaChi]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin người dùng thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaNXB: async (req, res) => {
    try {
      const idNXB = parseInt(req.body?.idNXB, 10);
      const tenNXB = req.body?.tenNXB;
      const namThanhLap = req.body?.namThanhLap;
      let errors = checkValid({ tenNXB, namThanhLap });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_NXB(?, ?, ?)",
          [idNXB, tenNXB, namThanhLap]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin nhà xuất bản thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaSach: async (req, res) => {
    try {
      const idSach = parseInt(req.body?.idSach, 10);
      const idNhaXuatBan = parseInt(req.body?.idNhaXuatBan, 10);
      const idTacGia = parseInt(req.body?.idTacGia, 10);
      const idTheLoaiSach = parseInt(req.body?.idTheLoaiSach, 10);
      const tenSach = req.body?.tenSach;
      const moTa = req.body?.moTa;
      let errors = checkValid({ idNhaXuatBan, idTacGia, idTheLoaiSach, tenSach, moTa });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_Sach(?, ?, ?, ?, ?, ?)",
          [idSach, idNhaXuatBan, idTacGia, idTheLoaiSach, tenSach, moTa]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaTacGia: async (req, res) => {
    try {
      const idTacGia = parseInt(req.body?.idTacGia, 10);
      const butDanh = req.body?.butDanh;
      const tenTacGia = req.body?.tenTacGia;
      let errors = checkValid({ idTacGia, butDanh, tenTacGia });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_TacGia(?, ?, ?)",
          [ idTacGia, butDanh, tenTacGia ]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin tác giả thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaTheLoaiSach: async (req, res) => {
    try {
      const idTheLoaiSach = parseInt(req.body?.idTheLoaiSach, 10);
      const tenTheLoai = req.body?.tenTheLoai;
      const moTa = req.body?.moTa;
      let errors = checkValid({ idTheLoaiSach, tenTheLoai, moTa });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_TheLoaiSach(?, ?, ?)",
          [idTheLoaiSach, tenTheLoai, moTa]
        );
        res.status(200).json({ success: true, message: 'Sửa thông tin thể loại sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  suaTrangThaiSach: async (req, res) => {
    try {
      const idSach = parseInt(req.body?.idSach, 10);
      const trangThaiSach = req.body?.trangThaiSach;
      let errors = checkValid({ idSach, trangThaiSach });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Sua_TrangThaiSach(?, ?)",
          [idSach, trangThaiSach]
        );
        res.status(200).json({ success: true, message: 'Sửa trạng thái sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
};
module.exports = lmsPutController;
