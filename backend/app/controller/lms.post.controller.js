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
const lmsPostController = {
  themDocGia: async (req, res) => {
    try {
      const taiKhoan = req.body?.taiKhoan;
      const matKhau = req.body?.matKhau;
      const hoTen = req.body?.hoTen;
      const diaChi = req.body?.diaChi;
      const soDienThoai = req.body?.soDienThoai;
      const email = req.body?.email;
      let errors = checkValid({
        taiKhoan,
        matKhau,
        hoTen,
        diaChi,
        soDienThoai,
        email,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_DocGia(?, ?, ?, ?, ?, ?)",
          [taiKhoan, matKhau, hoTen, diaChi, soDienThoai, email]
        );
        res.status(200).json({success: true, message: 'Thêm đọc giả thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code});
      console.error(err);
    }
  },
  themThuThu: async (req, res) => {
    try {
      const taiKhoan = req.body?.taiKhoan;
      const matKhau = req.body?.matKhau;
      const hoTen = req.body?.hoTen;
      const diaChi = req.body?.diaChi;
      const soDienThoai = req.body?.soDienThoai;
      const email = req.body?.email;
      let errors = checkValid({
        taiKhoan,
        matKhau,
        hoTen,
        diaChi,
        soDienThoai,
        email,
      });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_ThuThu(?, ?, ?, ?, ?, ?)",
          [taiKhoan, matKhau, hoTen, diaChi, soDienThoai, email]
        );
        res.status(200).json({success: true, message: 'Thêm thủ thư thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code});
      console.error(err);
    }
  },
  themKhoanPhat: async (req, res) => {
    try {
      const idMuonSach = parseInt(req.body?.idMuonSach, 10);
      const NgayGhiNhan = req.body?.NgayGhiNhan;
      const SoTienPhat = parseInt(req.body?.SoTienPhat, 10);
      let errors = checkValid({ idMuonSach, NgayGhiNhan, SoTienPhat });
      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_KhoanPhat(?, ?, ?)",
          [idMuonSach, NgayGhiNhan, SoTienPhat]
        );
        res.status(200).json({ success: true, message: 'Thêm khoản phạt thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  themMuonSach: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.body?.idNguoiDung, 10);
      const idSach = parseInt(req.body?.idSach, 10);
      const ngayMuon = req.body?.ngayMuon;
      const ngayHenTra = req.body?.ngayHenTra;
      const idThuThu = parseInt(req.body?.idThuThu, 10);

      let errors = checkValid({
        idNguoiDung,
        idSach,
        ngayMuon,
        ngayHenTra,
        idThuThu,
      });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_MuonSach(?, ?, ?, ?, ?)",
          [idNguoiDung, idSach, ngayMuon, ngayHenTra, idThuThu]
        );
        res.status(200).json({ success: true, message: 'Thêm mượn sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  themNhaXuatBan: async (req, res) => {
    try {
      const tenNXB = req.body?.tenNXB;
      const namThanhLap = req.body?.namThanhLap;
      console.log(tenNXB, namThanhLap)
      let errors = checkValid({ tenNXB, namThanhLap });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_NhaXuatBan(?, ?)",
          [tenNXB, namThanhLap]
        );
        res.status(200).json({ success: true, message: 'Thêm nhà xuất bản thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  themSach: async (req, res) => {
    try {
      const tenSach = req.body?.tenSach;
      const moTa = req.body?.moTa;
      const idNhaXuatBan = parseInt(req.body?.idNhaXuatBan, 10);
      const idTacGia = parseInt(req.body?.idTacGia, 10);
      const idTheLoaiSach = parseInt(req.body?.idTheLoaiSach, 10);

      let errors = checkValid({
        tenSach,
        moTa,
        idNhaXuatBan,
        idTacGia,
        idTheLoaiSach,
      });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_Sach(?, ?, ?, ?, ?)",
          [tenSach, moTa, idNhaXuatBan, idTacGia, idTheLoaiSach]
        );
        res.status(200).json({ success: true, message: 'Thêm sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  themTacGia: async (req, res) => {
    try {
      const tenTacGia = req.body?.tenTacGia;
      const butDanh = req.body?.butDanh;

      let errors = checkValid({ tenTacGia, butDanh });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_TacGia(?, ?)",
          [tenTacGia, butDanh]
        );
        res.status(200).json({ success: true, message: 'Thêm tác giả thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  themTheLoaiSach: async (req, res) => {
    try {
      const tenTheLoai = req.body?.tenTheLoai;
      const moTa = req.body?.moTa;
      let errors = checkValid({ tenTheLoai, moTa });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Them_TheLoaiSach(?, ?)",
          [tenTheLoai, moTa]
        );
        res.status(200).json({ success: true, message: 'Thêm thể loại sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  traMuonSach: async (req, res) => {
    try {
      const idMuonSach = parseInt(req.body?.idMuonSach, 10);
      const ngayTraThucTe = req.body?.ngayTraThucTe;
      const trangThaiMuon = req.body?.trangThaiMuon;
      let errors = checkValid({ idMuonSach, ngayTraThucTe, trangThaiMuon });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "call Tra_MuonSach(?, ?, ?)",
          [idMuonSach, ngayTraThucTe, trangThaiMuon]
        );
        res.status(200).json({ success: true, message: 'Thêm trả sách thành công', result });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
  xacThucDangNhap: async (req, res) => {
    try {
      const taiKhoan = req.body?.taiKhoan;
      const matKhau = req.body?.matKhau;
      let errors = checkValid({ taiKhoan, matKhau });

      if (errors.length > 0) {
        res.status(400).json({ messages: errors });
      } else {
        const [result] = await pool.query(
          "select XacThuc_DangNhap(?, ?) result",
          [taiKhoan, matKhau]
        );
        res.status(200).json({ success: true, message: parseInt(result[0].result, 10) === 1});
      }
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error", code: err?.code });
      console.error(err);
    }
  },
};
module.exports = lmsPostController;
