const pool = require('../../database'); 
const lmsGetController = {
  layDSDocGia: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSDocGia()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSKhoanPhat: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSKhoanPhat()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSMuonSach: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSMuonSach()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSNhaXuatBan: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSNhaXuatBan()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSSach: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSSach()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSTacGia: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSTacGia()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layDSTheLoaiSach: async (req, res) => {
    try {
      const [rows, fields] = await pool.query('call Lay_DSTheLoaiSach()');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layKhoanPhat: async (req, res) => {
    try {
      const idKhoanPhat = parseInt(req.query.idKhoanPhat, 10);
      if (isNaN(idKhoanPhat)) {
        return res.status(400).json({ error: 'Invalid idKhoanPhat query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_KhoanPhat(?)', [idKhoanPhat]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layKhoanPhatTheoMuonSach: async (req, res) => {
    try {
      const idMuonSach = parseInt(req.query.idMuonSach, 10);
      if (isNaN(idMuonSach)) {
        return res.status(400).json({ error: 'Invalid idMuonSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_KhoanPhatTheoMuonSach(?)', [idMuonSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layMuonSach: async (req, res) => {
    try {
      const idMuonSach = parseInt(req.query.idMuonSach, 10);
      if (isNaN(idMuonSach)) {
        return res.status(400).json({ error: 'Invalid idMuonSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_MuonSach(?)', [idMuonSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layMuonSachTheoNguoiDung: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.query.idNguoiDung, 10);
      if (isNaN(idNguoiDung)) {
        return res.status(400).json({ error: 'Invalid idNguoiDung query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_MuonSachTheoNguoiDung(?)', [idNguoiDung]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layMuonSachTheoSach: async (req, res) => {
    try {
      const idSach = parseInt(req.query.idSach, 10);
      if (isNaN(idSach)) {
        return res.status(400).json({ error: 'Invalid idSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_MuonSachTheoSach(?)', [idSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layNhaXuatBan: async (req, res) => {
    try {
      const idNhaXuatBan = parseInt(req.query.idNhaXuatBan, 10);
      if (isNaN(idNhaXuatBan)) {
        return res.status(400).json({ error: 'Invalid idNhaXuatBan query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_NhaXuatBan(?)', [idNhaXuatBan]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  laySach: async (req, res) => {
    try {
      const idSach = parseInt(req.query.idSach, 10);
      if (isNaN(idSach)) {
        return res.status(400).json({ error: 'Invalid idSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_Sach(?)', [idSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  laySachTheoNXB: async (req, res) => {
    try {
      const tenNXB = req.query.tenNXB;
      const [rows, fields] = await pool.query('call Lay_SachTheoNXB(?)', [tenNXB]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  laySachTheoTacGia: async (req, res) => {
    try {
      const tenTacGia = req.query.tenTacGia;
      const [rows, fields] = await pool.query('call Lay_SachTheoTacGia(?)', [tenTacGia]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  laySachTheoTheLoai: async (req, res) => {
    try {
      const tenTheLoai = req.query.tenTheLoai;
      const [rows, fields] = await pool.query('call Lay_SachTheoTheLoai(?)', [tenTheLoai]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layTacGia: async (req, res) => {
    try {
      const idTacGia = parseInt(req.query.idTacGia, 10);
      if (isNaN(idTacGia)) {
        return res.status(400).json({ error: 'Invalid idTacGia query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_TacGia(?)', [idTacGia]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layTheLoaiSach: async (req, res) => {
    try {
      const idTheLoaiSach = parseInt(req.query.idTheLoaiSach, 10);
      if (isNaN(idTheLoaiSach)) {
        return res.status(400).json({ error: 'Invalid idTheLoaiSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_TheLoaiSach(?)', [idTheLoaiSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layThongTinNguoiDung: async (req, res) => {
    try {
      const idNguoiDung = parseInt(req.query.idNguoiDung, 10);
      if (isNaN(idNguoiDung)) {
        return res.status(400).json({ error: 'Invalid idNguoiDung query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_ThongTinNguoiDung(?)', [idNguoiDung]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layTrangThaiSach: async (req, res) => {
    try {
      const idSach = parseInt(req.query.idSach, 10);
      if (isNaN(idSach)) {
        return res.status(400).json({ error: 'Invalid idSach query parameter' });
      }
      const [rows, fields] = await pool.query('call Lay_TrangThaiSach(?)', [idSach]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
  layThongTinNguoiDungVoiTaiKhoan: async (req, res) => {
    try {
      const taiKhoan = req.query.taiKhoan;
      const [rows, fields] = await pool.query('call Lay_ThongTinNguoiDungVoiTaiKhoan(?)', [taiKhoan]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.error(err);
    }
  },
};
module.exports = lmsGetController;