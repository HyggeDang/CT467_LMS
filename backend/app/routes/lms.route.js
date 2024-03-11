const express = require("express");
const LMS_GET = require("../controller/lms.get.controller");
const LMS_POST = require("../controller/lms.post.controller");
const LMS_PUT = require("../controller/lms.put.controller");
const LMS_DELETE = require("../controller/lms.delete.controller");

const router = express.Router();


router.route("/get-readers")
  .get(LMS_GET.layDSDocGia)
router.route("/get-fines")
  .get(LMS_GET.layDSKhoanPhat)
router.route("/get-tickets")
  .get(LMS_GET.layDSMuonSach)
router.route("/get-publishers")
  .get(LMS_GET.layDSNhaXuatBan)
router.route("/get-books")
  .get(LMS_GET.layDSSach)
router.route("/get-authors")
  .get(LMS_GET.layDSTacGia)
router.route("/get-genres")
  .get(LMS_GET.layDSTheLoaiSach)


//req.query
router.route("/get-fine") // idKhoanPhat
  .get(LMS_GET.layKhoanPhat)
router.route("/get-fine-by-ticket") // idMuonSach
  .get(LMS_GET.layKhoanPhatTheoMuonSach)
router.route("/get-ticket") //idMuonSach
  .get(LMS_GET.layMuonSach)
router.route("/get-ticker-by-user") // idNguoiDung
  .get(LMS_GET.layMuonSachTheoNguoiDung)
router.route("/get-ticket-by-book") // idSach
  .get(LMS_GET.layMuonSachTheoSach)
router.route("/get-publisher") // idNhaXuatBan
  .get(LMS_GET.layNhaXuatBan)
router.route("/get-book") // idSach
  .get(LMS_GET.laySach)
router.route("/get-book-by-publisher") // tenNXB
  .get(LMS_GET.laySachTheoNXB)
router.route("/get-book-by-author") // tenTacGia
  .get(LMS_GET.laySachTheoTacGia)
router.route("/get-book-by-genre") // tenTheLoai
  .get(LMS_GET.laySachTheoTheLoai)
router.route("/get-author") // idTacGia
  .get(LMS_GET.layTacGia)
router.route("/get-genre") // idTheLoaiSach
  .get(LMS_GET.layTheLoaiSach)
router.route("/get-user-info") // idNguoiDung
  .get(LMS_GET.layThongTinNguoiDung)
router.route("/get-book-status") // idSach
  .get(LMS_GET.layTrangThaiSach)
router.route("/get-user-info-by-account") // taiKhoan
  .get(LMS_GET.layThongTinNguoiDungVoiTaiKhoan)


// Các route POST cho thêm mới dữ liệu
router.route("/add-reader") // taiKhoan, matKhau, hoTen, diaChi, soDienThoai, email
  .post(LMS_POST.themDocGia)
router.route("/add-librarian") // taiKhoan, matKhau, hoTen, diaChi, soDienThoai, email
  .post(LMS_POST.themThuThu) 
router.route("/add-fine") // idMuonSach, NgayGhiNhan, SoTienPhat
  .post(LMS_POST.themKhoanPhat)
router.route("/add-ticket") // idNguoiDung, idSach, ngayMuon, ngayHenTra, idThuThu
  .post(LMS_POST.themMuonSach)
router.route("/add-publisher")// tenNXB, namThanhLap
  .post(LMS_POST.themNhaXuatBan) 
router.route("/add-book") // tenSach, moTa, idNhaXuatBan, idTacGia, idTheLoaiSach
  .post(LMS_POST.themSach) 
router.route("/add-author") // tenTacGia, butDanh
  .post(LMS_POST.themTacGia) 
router.route("/add-genre") // tenTheLoai, moTa
  .post(LMS_POST.themTheLoaiSach)
router.route("/add-book-return") // idMuonSach, ngayTraThucTe, trangThaiMuon
  .post(LMS_POST.traMuonSach)
router.route("/authenticate") // taiKhoan, matKhau
  .post(LMS_POST.xacThucDangNhap)

// Các route PUT cho việc chỉnh sửa dữ liệu
router.route("/edit-fine") // idKhoanPhat, idMuonSach, ngayGhiNhan, soTienPhat, trangThai
  .put(LMS_PUT.suaKhoanPhat)
router.route("/edit-user-password") // idNguoiDung, matKhauMoi
  .put(LMS_PUT.suaMatKhauNguoiDung)
router.route("/edit-ticket") // idMuonSach, idNguoiDung, idSach, ngayMuon, ngayHenTra, ngayTraThucTe, TrangThaiMuon, idThuThu
  .put(LMS_PUT.suaMuonSach)
router.route("/edit-user") // idNguoiDung, hoTen, soDienThoai, email, diaChi
  .put(LMS_PUT.suaNguoiDung)
router.route("/edit-publisher") // idNXB, tenNXB, namThanhLap
  .put(LMS_PUT.suaNXB)
router.route("/edit-book") // idSach, idNhaXuatBan, idTacGia, idTheLoaiSach, tenSach, moTa
  .put(LMS_PUT.suaSach)
router.route("/edit-author") // idTacGia, butDanh, tenTacGia
  .put(LMS_PUT.suaTacGia)
router.route("/edit-genre") // idTheLoaiSach, tenTheLoai, moTa
  .put(LMS_PUT.suaTheLoaiSach)
router.route("/edit-book-status") // idSach, trangThaiSach
  .put(LMS_PUT.suaTrangThaiSach)

// Các route DELETE cho việc xóa dữ liệu
router.route("/delete-user") // idNguoiDung
  .delete(LMS_DELETE.xoaNguoiDung)
router.route("/delete-publisher") // idNXB
  .delete(LMS_DELETE.xoaNhaXuatBan)
router.route("/delete-author") // idTacGia
  .delete(LMS_DELETE.xoaTacGia)
router.route("/delete-genre") // idTheLoaiSach
  .delete(LMS_DELETE.xoaTheLoaiSach)


module.exports = router;