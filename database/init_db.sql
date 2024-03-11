create database quantridulieu2023_testing_02;
use quantridulieu2023_testing_02;
SET SQL_SAFE_UPDATES = 0;


DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE `nguoidung` (
  `ND_ID` int NOT NULL AUTO_INCREMENT,
  `ND_TaiKhoan` varchar(255) NOT NULL,
  `ND_MatKhau` varchar(255) NOT NULL,
  `ND_VaiTro` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ND_HoTen` varchar(255) NOT NULL,
  `ND_DiaChi` varchar(255) NOT NULL,
  `ND_SoDienThoai` varchar(255) NOT NULL,
  `ND_Email` varchar(255) NOT NULL,
  `ND_TrangThai` varchar(32) NOT NULL,
  PRIMARY KEY (`ND_ID`),
  UNIQUE KEY `ND_TaiKhoan` (`ND_TaiKhoan`),
  KEY `username` (`ND_TaiKhoan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `nhaxuatban`;
CREATE TABLE `nhaxuatban` (
  `NXB_ID` int NOT NULL AUTO_INCREMENT,
  `NXB_TenNXB` varchar(255) NOT NULL,
  `NXB_NamThanhLap` date NOT NULL,
  PRIMARY KEY (`NXB_ID`),
  KEY `publisher_name` (`NXB_TenNXB`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `tacgia`;
CREATE TABLE `tacgia` (
  `TG_ID` int NOT NULL AUTO_INCREMENT,
  `TG_TenTacGia` varchar(255) NOT NULL,
  `TG_ButDanh` varchar(255) NOT NULL,
  PRIMARY KEY (`TG_ID`),
  KEY `author` (`TG_TenTacGia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `theloaisach`;
CREATE TABLE `theloaisach` (
  `TLS_ID` int NOT NULL AUTO_INCREMENT,
  `TLS_TenTheLoai` varchar(128) NOT NULL,
  `TLS_MoTa` text NOT NULL,
  PRIMARY KEY (`TLS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sach`;
CREATE TABLE `sach` (
  `S_ID` int NOT NULL AUTO_INCREMENT,
  `S_TenSach` varchar(255) NOT NULL,
  `S_IDTacGia` int NOT NULL,
  `S_IDNhaXuatBan` int NOT NULL,
  `S_IDTheLoaiSach` int NOT NULL,
  `S_MoTa` text NOT NULL,
  `S_TrangThai` varchar(32) NOT NULL,
  PRIMARY KEY (`S_ID`),
  KEY `book_name` (`S_TenSach`),
  KEY `FK_IDTacGia` (`S_IDTacGia`),
  KEY `FK_IDNhaXuatBan` (`S_IDNhaXuatBan`),
  KEY `FK_IDTheLoaiSach` (`S_IDTheLoaiSach`),
  CONSTRAINT `FK_IDNhaXuatBan` FOREIGN KEY (`S_IDNhaXuatBan`) REFERENCES `nhaxuatban` (`NXB_ID`),
  CONSTRAINT `FK_IDTacGia` FOREIGN KEY (`S_IDTacGia`) REFERENCES `tacgia` (`TG_ID`),
  CONSTRAINT `FK_IDTheLoaiSach` FOREIGN KEY (`S_IDTheLoaiSach`) REFERENCES `theloaisach` (`TLS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `muonsach`;
CREATE TABLE `muonsach` (
  `MS_ID` int NOT NULL AUTO_INCREMENT,
  `MS_IDNguoiDung` int NOT NULL,
  `MS_IDSach` int NOT NULL,
  `MS_NgayMuon` date NOT NULL,
  `MS_NgayHenTra` date NOT NULL,
  `MS_NgayTraThucTe` date DEFAULT NULL,
  `MS_TrangThaiMuon` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MS_IDThuThu` int NOT NULL,
  PRIMARY KEY (`MS_ID`),
  KEY `FK_IDNguoiDung` (`MS_IDNguoiDung`),
  KEY `FK_IDSach` (`MS_IDSach`),
  KEY `FK_IDThuThu` (`MS_IDThuThu`),
  CONSTRAINT `FK_IDNguoiDung` FOREIGN KEY (`MS_IDNguoiDung`) REFERENCES `nguoidung` (`ND_ID`),
  CONSTRAINT `FK_IDSach` FOREIGN KEY (`MS_IDSach`) REFERENCES `sach` (`S_ID`),
  CONSTRAINT `FK_IDThuThu` FOREIGN KEY (`MS_IDThuThu`) REFERENCES `nguoidung` (`ND_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` TRIGGER `KiemTra_ThemMuonSach` 
BEFORE INSERT ON `muonsach` FOR EACH ROW BEGIN
	DECLARE vaiTroID1 VARCHAR(32);
    DECLARE vaiTroID2 VARCHAR(32);
    DECLARE tinhTrangSach VARCHAR(32);
    SET vaiTroID1 = Lay_VaiTro(new.MS_IDNguoiDung);
    SET vaiTroID2 = Lay_VaiTro(new.MS_IDThuThu);
    SET tinhTrangSach = Lay_TrangThaiSach(new.MS_IDSach);
    IF (vaiTroID1 NOT LIKE "reader") THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = "ID Người đọc dùng không đúng!";
    END IF;
    IF (vaiTroID2 NOT LIKE "librarian") THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = "ID Thủ thư dùng không đúng!";
    END IF;
    IF (tinhTrangSach NOT LIKE "available") THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = "Sách đang được mượn!";
    END IF;
    IF (new.MS_NgayMuon > new.MS_NgayHenTra) THEN
		SIGNAL SQLSTATE '45000' 
		SET MESSAGE_TEXT = "Ngày hẹn trả phải lớn hơn Ngày mượn!";
    END IF;
END ;;
DELIMITER ;


DROP TABLE IF EXISTS `khoanphat`;
CREATE TABLE `khoanphat` (
  `KP_ID` int NOT NULL AUTO_INCREMENT,
  `KP_IDMuonSach` int NOT NULL,
  `KP_SoTienPhat` decimal(10,2) NOT NULL,
  `KP_NgayGhiNhan` date NOT NULL,
  `KP_TrangThai` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`KP_ID`),
  KEY `FK_IDMuonSach` (`KP_IDMuonSach`),
  CONSTRAINT `FK_IDMuonSach` FOREIGN KEY (`KP_IDMuonSach`) REFERENCES `muonsach` (`MS_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `Lay_TrangThaiSach`(inp_IDSach INT) RETURNS varchar(32) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
	DECLARE ketqua VARCHAR(32);
    IF ((SELECT S_TrangThai FROM Sach 
         WHERE S_ID = inp_IDSach) IS NOT NULL) THEN
         SET ketqua = (SELECT S_TrangThai FROM Sach 
						WHERE S_ID = inp_IDSach);
	ELSE
		SET ketqua = "ID_NOT_FOUND";
	END IF;
    RETURN ketqua;
END ;;
DELIMITER ;


DROP FUNCTION IF EXISTS `Lay_VaiTro`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `Lay_VaiTro`(inp_IDNguoiDung INT) RETURNS varchar(32) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
	DECLARE ketqua VARCHAR(32);
    IF ((SELECT ND_VaiTro FROM NGUOIDUNG 
         WHERE ND_ID = inp_IDNguoiDung) IS NOT NULL) THEN
         SET ketqua = (SELECT ND_VaiTro FROM NGUOIDUNG 
						WHERE ND_ID = inp_IDNguoiDung);
	ELSE
		SET ketqua = "ID_NOT_FOUND";
	END IF;
    RETURN ketqua;
END ;;
DELIMITER ;


DROP FUNCTION IF EXISTS `XacThuc_DangNhap`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `XacThuc_DangNhap`(inp_TaiKhoan varchar(255), inp_MatKhau varchar(255)) RETURNS tinyint(1)
    DETERMINISTIC
begin
	declare ketqua boolean default false;
    if ((select ND_TaiKhoan
		 from NGUOIDUNG ND 
         where lower(ND.ND_TaiKhoan) = lower(inp_TaiKhoan)
         and ND.ND_MatKhau = inp_MatKhau) is not null) then
         set ketqua = true;
	end if;
    return ketqua;
end ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSDocGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSDocGia`()
SELECT ND_ID, ND_HoTen, ND_DiaChi, ND_SoDienThoai, ND_Email FROM NguoiDung WHERE ND_VaiTro = "reader" AND ND_TrangThai = "active" ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSKhoanPhat`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSKhoanPhat`()
BEGIN
	SELECT KP.KP_ID, KP.KP_IDMuonSach, ND.ND_ID, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, KP.KP_SoTienPhat, KP.KP_NgayGhiNhan, KP.KP_TrangThai FROM KhoanPhat KP
    JOIN MuonSach MS ON MS.MS_ID = KP.KP_IDMuonSach
    JOIN NguoiDung ND ON ND.ND_ID = MS.MS_IDNguoiDung
    JOIN Sach S ON S.S_ID = MS.MS_IDSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSMuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSMuonSach`()
BEGIN
	SELECT MS.MS_ID, MS.MS_IDSach, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, MS.MS_IDNguoiDung, DG.ND_HoTen Ten_Nguoi_Muon, MS.MS_IDThuThu, TT.ND_HoTen Ten_Thu_Thu FROM MuonSach MS
    JOIN NguoiDung DG ON DG.ND_ID = MS.MS_IDNguoiDung
    Join NguoiDung TT ON TT.ND_ID = MS.MS_IDThuThu
    JOIN Sach S ON S.S_ID = MS.MS_IDSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSNhaXuatBan`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSNhaXuatBan`()
BEGIN
	SELECT * FROM NhaXuatBan WHERE NXB_ID <> 0;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSSach`()
BEGIN
	SELECT S.S_ID, S.S_TenSach, TG.TG_TenTacGia, TLS.TLS_TenTheLoai, NXB.NXB_TenNXB, S.S_MoTa, S.S_TrangThai FROM Sach S
    JOIN TheLoaiSach TLS ON TLS.TLS_ID = S.S_IDTheLoaiSach
    JOIN TacGia TG ON TG.TG_ID = S.S_IDTacGia
    JOIN NhaXuatBan NXB ON NXB.NXB_ID = S.S_IDNhaXuatBan
    GROUP BY S.S_ID, S.S_TenSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSTacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSTacGia`()
BEGIN
	SELECT * FROM TacGia WHERE TG_ID <> 0;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_DSTheLoaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_DSTheLoaiSach`()
BEGIN
	SELECT * FROM TheLoaiSach WHERE TLS_ID <> 0;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_KhoanPhat`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_KhoanPhat`(IN inp_ID INT)
BEGIN
	SELECT KP.KP_ID, KP.KP_IDMuonSach, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, KP.KP_SoTienPhat, KP.KP_NgayGhiNhan, KP.KP_TrangThai FROM KhoanPhat KP
    JOIN MuonSach MS ON MS.MS_ID = KP.KP_IDMuonSach
    JOIN Sach S ON S.S_ID = MS.MS_IDSach
    WHERE KP.KP_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_KhoanPhatTheoMuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_KhoanPhatTheoMuonSach`(IN inp_IDMuonSach INT)
BEGIN
	SELECT KP.KP_ID, KP.KP_IDMuonSach, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, KP.KP_SoTienPhat, KP.KP_NgayGhiNhan, KP.KP_TrangThai FROM KhoanPhat KP
    JOIN MuonSach MS ON MS.MS_ID = KP.KP_IDMuonSach
    JOIN Sach S ON S.S_ID = MS.MS_IDSach
    WHERE MS.MS_ID = inp_IDMuonSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_MuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_MuonSach`(IN inp_ID INT)
BEGIN
	SELECT MS.MS_ID, MS.MS_IDSach, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, MS.MS_IDNguoiDung ID_Nguoi_Muon,  DG.ND_HoTen Ten_Nguoi_Muon, MS.MS_IDThuThu ID_Thu_Thu, TT.ND_HoTen Ten_Thu_Thu FROM MuonSach MS
    JOIN NguoiDung DG ON DG.ND_ID = MS.MS_IDNguoiDung
    Join NguoiDung TT ON TT.ND_ID = MS.MS_IDThuThu
    JOIN Sach S ON S.S_ID = MS.MS_IDSach
    WHERE MS.MS_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_MuonSachTheoNguoiDung`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_MuonSachTheoNguoiDung`(IN inp_IDNguoiDung INT)
BEGIN
	SELECT MS.MS_ID, MS.MS_IDSach,  S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, DG.ND_HoTen Ten_Nguoi_Muon, TT.ND_HoTen Ten_Thu_Thu FROM MuonSach MS
    JOIN NguoiDung DG ON DG.ND_ID = MS.MS_IDNguoiDung
    Join NguoiDung TT ON TT.ND_ID = MS.MS_IDThuThu
    JOIN Sach S ON S.S_ID = MS.MS_IDSach
    WHERE DG.ND_ID = inp_IDNguoiDung;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_MuonSachTheoSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_MuonSachTheoSach`(IN inp_IDSach INT)
BEGIN
	SELECT MS.MS_ID, MS.MS_IDSach, S.S_TenSach, MS.MS_NgayMuon, MS.MS_NgayHenTra, MS.MS_NgayTraThucTe, MS.MS_TrangThaiMuon, DG.ND_HoTen Ten_Nguoi_Muon, TT.ND_HoTen Ten_Thu_Thu FROM MuonSach MS
    JOIN NguoiDung DG ON DG.ND_ID = MS.MS_IDNguoiDung
    Join NguoiDung TT ON TT.ND_ID = MS.MS_IDThuThu
    JOIN Sach S ON S.S_ID = MS.MS_IDSach
    WHERE S.S_ID = inp_IDSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_NhaXuatBan`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_NhaXuatBan`(IN inp_ID INT)
BEGIN
	SELECT * FROM NhaXuatBan WHERE NXB_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_Sach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_Sach`(IN inp_ID INT)
BEGIN
	SELECT S.S_ID, S.S_TenSach, S.S_IDTacGia, TG.TG_TenTacGia, S.S_IDTheLoaiSach, TLS.TLS_TenTheLoai, S.S_IDNhaXuatBan, NXB.NXB_TenNXB, S.S_MoTa, S.S_TrangThai FROM Sach S
    JOIN TheLoaiSach TLS ON TLS.TLS_ID = S.S_IDTheLoaiSach
    JOIN TacGia TG ON TG.TG_ID = S.S_IDTacGia
    JOIN NhaXuatBan NXB ON NXB.NXB_ID = S.S_IDNhaXuatBan
    WHERE S.S_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_SachTheoNXB`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_SachTheoNXB`(IN inp_TenNXB VARCHAR(255))
BEGIN
	SELECT S.S_ID, S_TenSach, TG.TG_TenTacGia, NXB.NXB_TenNXB, TLS.TLS_TenTheLoai, S.S_MoTa FROM Sach S
    JOIN TacGia TG ON TG.TG_ID = S.S_IDTacGia
    JOIN NhaXuatBan NXB ON NXB.NXB_ID = S.S_IDNhaXuatBan
    JOIN TheLoaiSach TLS ON TLS.TLS_ID = S.S_IDTheLoaiSach
    WHERE lower(NXB.NXB_TenNXB) like concat('%', lower(inp_TenNXB),'%')
    GROUP BY S.S_ID, S_TenSach
    ORDER BY S.S_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_SachTheoTacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_SachTheoTacGia`(IN inp_TenTacGia VARCHAR(255))
BEGIN
	SELECT S.S_ID, S_TenSach, TG.TG_TenTacGia, NXB.NXB_TenNXB, TLS.TLS_TenTheLoai, S.S_MoTa FROM Sach S
    JOIN TacGia TG ON TG.TG_ID = S.S_IDTacGia
    JOIN NhaXuatBan NXB ON NXB.NXB_ID = S.S_IDNhaXuatBan
    JOIN TheLoaiSach TLS ON TLS.TLS_ID = S.S_IDTheLoaiSach
    WHERE lower(TG.TG_TenTacGia) like concat('%', lower(inp_TenTacGia),'%')
    GROUP BY S.S_ID, S_TenSach
    ORDER BY S.S_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_SachTheoTheLoai`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_SachTheoTheLoai`(IN inp_TenTheLoai VARCHAR(255))
BEGIN
	SELECT S.S_ID, S_TenSach, TG.TG_TenTacGia, NXB.NXB_TenNXB, TLS.TLS_TenTheLoai, S.S_MoTa FROM Sach S
    JOIN TacGia TG ON TG.TG_ID = S.S_IDTacGia
    JOIN NhaXuatBan NXB ON NXB.NXB_ID = S.S_IDNhaXuatBan
    JOIN TheLoaiSach TLS ON TLS.TLS_ID = S.S_IDTheLoaiSach
    WHERE lower(TLS_TenTheLoai) like concat('%', lower(inp_TenTheLoai),'%')
    GROUP BY S.S_ID, S_TenSach
    ORDER BY S.S_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_TacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_TacGia`(IN inp_ID INT)
BEGIN
	SELECT * FROM TacGia WHERE TG_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_TheLoaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_TheLoaiSach`(IN inp_ID INT)
BEGIN
	SELECT * FROM TheLoaiSach WHERE TLS_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_ThongTinNguoiDung`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_ThongTinNguoiDung`(IN `inp_ID` INT)
SELECT ND_ID, ND_TaiKhoan, ND_HoTen, ND_DiaChi, ND_VaiTro, ND_SoDienThoai, ND_Email FROM NguoiDung WHERE ND_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_ThongTinNguoiDungVoiTaiKhoan`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_ThongTinNguoiDungVoiTaiKhoan`(IN inp_TaiKhoan VARCHAR(255))
BEGIN
	SELECT ND_ID, ND_TaiKhoan, ND_HoTen, ND_DiaChi, ND_VaiTro, ND_SoDienThoai, ND_Email FROM NguoiDung WHERE ND_TaiKhoan = inp_TaiKhoan;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Lay_TrangThaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Lay_TrangThaiSach`(IN inp_IDSach INT)
BEGIN
	SELECT S_TrangThai FROM Sach WHERE S_ID = inp_IDSach;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_KhoanPhat`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_KhoanPhat`(IN `inp_ID` INT, IN `inp_IDMuonSach` INT, IN `inp_NgayGhiNhan` DATE, IN `inp_SoTienPhat` DECIMAL(10,2), IN `inp_TrangThai` VARCHAR(32))
UPDATE KhoanPhat
    SET 
        KP_IDMuonSach = inp_IDMuonSach,
        KP_NgayGhiNhan = inp_NgayGhiNhan,
        KP_SoTienPhat = inp_SoTienPhat,
        KP_TrangThai = inp_TrangThai
    WHERE KP_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_MatKhauNguoiDung`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_MatKhauNguoiDung`(IN `inp_ID` INT, IN `inp_MatKhau` VARCHAR(255))
UPDATE NguoiDung
    SET 
        ND_MatKhau = inp_MatKhau
	WHERE ND_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_MuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_MuonSach`(IN `inp_ID` INT, IN `inp_IDNguoiDung` INT, IN `inp_IDSach` INT, IN `inp_NgayMuon` DATE, IN `inp_NgayHenTra` DATE, IN `inp_NgayTraThucTe` DATE, IN `inp_TrangThaiMuon` VARCHAR(32), IN `inp_IDThuThu` INT)
BEGIN
UPDATE MuonSach
    SET 
        MS_IDNguoiDung = inp_IDNguoiDung,
        MS_IDThuThu = inp_IDThuThu,
        MS_IDSach = inp_IDSach,
        MS_NgayMuon = inp_NgayMuon,
        MS_NgayHenTra = inp_NgayHenTra,
        MS_NgayTraThucTe = inp_NgayTraThucTe,
        MS_TrangThaiMuon = inp_TrangThaiMuon
    WHERE MS_ID = inp_ID;
END ;;
DELIMITER ;

DROP PROCEDURE IF EXISTS `Sua_NguoiDung`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_NguoiDung`(IN `inp_ID` INT, IN `inp_HoTen` VARCHAR(255), IN `inp_SoDienThoai` VARCHAR(255), IN `inp_Email` VARCHAR(255), IN `inp_DiaChi` VARCHAR(255))
UPDATE NguoiDung
    SET 
        ND_HoTen = inp_HoTen,
        ND_SoDienThoai = inp_SoDienThoai,
        ND_Email = inp_Email,
        ND_DiaChi = inp_DiaChi
    WHERE ND_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_NXB`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_NXB`(IN `inp_ID` INT, IN `inp_TenNXB` VARCHAR(255), IN `inp_NamThanhLap` DATE)
UPDATE NhaXuatBan
    SET 
        NXB_TenNXB = inp_TenNXB,
        NXB_NamThanhLap = inp_NamThanhLap
    WHERE NXB_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_Sach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_Sach`(IN `inp_ID` INT, IN `inp_IDNhaXuatBan` INT, IN `inp_IDTacGia` INT, IN `inp_IDTheLoaiSach` INT, IN `inp_TenSach` VARCHAR(255), IN `inp_MoTa` TEXT)
UPDATE Sach
    SET 
        S_IDNhaXuatBan = inp_IDNhaXuatBan,
        S_IDTacGia = inp_IDTacGia,
        S_IDTheLoaiSach = inp_IDTheLoaiSach,
        S_TenSach = inp_TenSach,
        S_MoTa = inp_MoTa
    WHERE S_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_TacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_TacGia`(IN `inp_ID` INT, IN `inp_ButDanh` VARCHAR(255), IN `inp_TenTacGia` VARCHAR(255))
UPDATE TacGia
    SET 
    	TG_TenTacGia = inp_TenTacGia,
        TG_ButDanh = inp_ButDanh
    WHERE TG_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_TheLoaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_TheLoaiSach`(IN `inp_ID` INT, IN `inp_TenTheLoai` VARCHAR(255), IN `inp_MoTa` TEXT)
UPDATE TheLoaiSach
    SET 
        TLS_TenTheLoai = inp_TenTheLoai,
        TLS_MoTa = inp_MoTa
    WHERE TLS_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_TinhTrangSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_TinhTrangSach`(IN inp_ID INT, IN inp_TrangThaiSach VARCHAR(32))
BEGIN
    UPDATE Sach
		SET 
        S_TrangThai = inp_TrangThaiSach
		WHERE S_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Sua_TrangThaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Sua_TrangThaiSach`(IN `inp_ID` INT, IN `inp_TrangThai` VARCHAR(32))
UPDATE Sach
    SET 
        S_TrangThai = inp_TrangThai
    WHERE S_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_DocGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_DocGia`(IN `inp_TaiKhoan` VARCHAR(255), IN `inp_MatKhau` VARCHAR(255), IN `inp_HoTen` VARCHAR(255), IN `inp_DiaChi` VARCHAR(255), IN `inp_SoDienThoai` VARCHAR(255), IN `inp_Email` VARCHAR(255))
INSERT INTO NguoiDung
	(ND_TaiKhoan, ND_MatKhau, ND_VaiTro, ND_HoTen, ND_DiaChi, ND_SoDienThoai, ND_Email, ND_TrangThai)
    VALUES
    (inp_TaiKhoan, inp_MatKhau, "reader", inp_HoTen, inp_DiaChi, inp_SoDienThoai, inp_Email, "active") ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_KhoanPhat`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_KhoanPhat`(IN `inp_IDMuonSach` INT, IN `inp_NgayGhiNhan` DATE, IN `inp_SoTienPhat` DECIMAL(10,2))
INSERT INTO KhoanPhat
	(KP_IDMuonSach, KP_NgayGhiNhan, KP_SoTienPhat, KP_TrangThai)
    VALUES
    (inp_IDMuonSach, inp_NgayGhiNhan, inp_SoTienPhat, "unpaid") ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_MuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_MuonSach`(IN `inp_IDNguoiDung` INT, IN `inp_IDSach` INT, IN `inp_NgayMuon` DATE, IN `inp_NgayHenTra` DATE, IN `inp_IDThuThu` INT)
BEGIN
	INSERT INTO MuonSach
		(MS_IDNguoiDung, MS_IDSach, MS_NgayMuon, MS_NgayHenTra, MS_TrangThaiMuon, MS_IDThuThu)
    VALUES
		(inp_IDNguoiDung, inp_IDSach, inp_NgayMuon, inp_NgayHenTra, "borrowing", inp_IDThuThu);
    call Sua_TrangThaiSach(inp_IDSach, "unavailable");
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_NhaXuatBan`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_NhaXuatBan`(IN `inp_TenNXB` VARCHAR(255), IN `inp_NamThanhLap` DATE)
    COMMENT 'YYYY-MM-DD'
INSERT INTO NhaXuatBan
	(NXB_TenNXB, NXB_NamThanhLap)
    VALUES
    (inp_TenNXB, inp_NamThanhLap) ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_Sach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_Sach`(IN `inp_TenSach` VARCHAR(255), IN `inp_MoTa` TEXT, IN `inp_IDNhaXuatban` INT, IN `inp_IDTacGia` INT, IN `inp_IDTheLoaiSach` INT)
INSERT INTO Sach
	(S_TenSach, S_MoTa, S_IDNhaXuatban, S_IDTacGia, S_IDTheLoaiSach, S_TrangThai)
    VALUES
    (inp_TenSach, inp_MoTa, inp_IDNhaXuatban, inp_IDTacGia, inp_IDTheLoaiSach, "available") ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_TacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_TacGia`(IN `inp_TenTacGia` VARCHAR(255), IN `inp_ButDanh` VARCHAR(255))
INSERT INTO TacGia
	(TG_TenTacGia, TG_ButDanh)
    VALUES
    (inp_TenTacGia, inp_ButDanh) ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_TheLoaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_TheLoaiSach`(IN `inp_TenTheLoai` VARCHAR(255), IN `inp_MoTa` TEXT)
INSERT INTO TheLoaiSach
	(TLS_TenTheLoai, TLS_MoTa)
    VALUES
    (inp_TenTheLoai, inp_MoTa) ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Them_ThuThu`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Them_ThuThu`(IN `inp_TaiKhoan` VARCHAR(255), IN `inp_MatKhau` VARCHAR(255), IN `inp_HoTen` VARCHAR(255), IN `inp_DiaChi` VARCHAR(255), IN `inp_SoDienThoai` VARCHAR(255), IN `inp_Email` VARCHAR(255))
INSERT INTO NguoiDung
	(ND_TaiKhoan, ND_MatKhau, ND_VaiTro, ND_HoTen, ND_DiaChi, ND_SoDienThoai, ND_Email, ND_TrangThai)
    VALUES
    (inp_TaiKhoan, inp_MatKhau, "librarian", inp_HoTen, inp_DiaChi, inp_SoDienThoai, inp_Email, "active") ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Tra_MuonSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Tra_MuonSach`(IN inp_ID INT, IN inp_NgayTraThucTe DATE, IN inp_TrangThaiMuon VARCHAR(32))
BEGIN
	DECLARE SACH_ID INT; 
	IF inp_NgayTraThucTe IS NULL THEN
		SET inp_NgayTraThucTe = current_date();
	END IF;
    UPDATE MUONSACH
		SET 
        MS_NgayTraThucTe = inp_NgayTraThucTe,
        MS_TrangThaiMuon = inp_TrangThaiMuon
		WHERE MS_ID = inp_ID;
	SET SACH_ID = (SELECT MS.MS_IDSach FROM MUONSACH MS WHERE MS_ID = inp_ID);
	IF (inp_TrangThaiMuon NOT LIKE "damaged" AND inp_TrangThaiMuon NOT LIKE "lost")
    THEN
		call Sua_TrangThaiSach(SACH_ID, "available");
	ELSE 
		call Sua_TrangThaiSach(SACH_ID, "unavailable");
	END IF;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Xoa_NguoiDung`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Xoa_NguoiDung`(IN `inp_ID` INT)
UPDATE NguoiDung
    SET 
        ND_TrangThai = "inactive"
    WHERE ND_ID = inp_ID ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Xoa_NhaXuatBan`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Xoa_NhaXuatBan`(IN `inp_ID` INT)
BEGIN
UPDATE Sach SET S_IDNhaXuatBan = 0 WHERE S_IDNhaXuatBan = inp_ID;
DELETE FROM NhaXuatBan WHERE NXB_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Xoa_TacGia`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Xoa_TacGia`(IN `inp_ID` INT)
BEGIN
UPDATE Sach SET S_IDTacGia = 0 WHERE S_IDTacGia = inp_ID;
DELETE FROM TacGia WHERE TG_ID = inp_ID;
END ;;
DELIMITER ;


DROP PROCEDURE IF EXISTS `Xoa_TheLoaiSach`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Xoa_TheLoaiSach`(IN `inp_ID` INT)
BEGIN
UPDATE Sach SET S_IDTheLoaiSach = 0 WHERE S_IDTheLoaiSach = inp_ID;
DELETE FROM TheLoaiSach WHERE TLS_ID = inp_ID;
END ;;
DELIMITER ;


INSERT INTO `TacGia` (`TG_TenTacGia`, `TG_ButDanh`) VALUES ('Đang cập nhật Tên Tác Giả', 'Đang cập nhật Bút Danh');
UPDATE TacGia SET TG_ID = 0 WHERE TG_TenTacGia = "Đang cập nhật Tên Tác Giả" AND TG_ButDanh = "Đang cập nhật Bút Danh";

INSERT INTO TheLoaiSach (`TLS_TenTheLoai`, `TLS_MoTa`) VALUES ('Đang cập nhật Thể Loại Sách', 'Đang cập nhật Mô Tả');
UPDATE TheLoaiSach SET TLS_ID = 0 WHERE TLS_TenTheLoai = "Đang cập nhật Thể Loại Sách" AND TLS_MoTa = "Đang cập nhật Mô Tả";

INSERT INTO NhaXuatban (`NXB_TenNXB`, `NXB_NamThanhLap`) VALUES ('Đang cập nhật Tên NXB', "0001-01-01");
UPDATE NhaXuatban SET NXB_ID = 0 WHERE NXB_TenNXB = "Đang cập nhật Tên NXB" AND NXB_NamThanhLap = "0001-01-01";


CALL Them_TheLoaiSach('Tiểu thuyết','Tiểu thuyết lãng mạn có lẽ là một trong số các thể loại sách phổ biến nhất khi so về doanh số bán sách. Các nhánh phụ trong thể loại sách lãng mạn phổ biến còn bao gồm các ấn phẩm tiểu thuyết lãng mạn huyền bí và lãng mạng mang tính lịch sử.');
CALL Them_TheLoaiSach('Bí ẩn','Tiểu thuyết bí ẩn bắt đầu bằng một câu chuyện hấp dẫn, khiến người đọc thích thú với nhịp độ hồi hộp và kết thúc bằng một cái kết thỏa mãn trả lời tất cả các câu hỏi nổi bật của người đọc.');
CALL Them_TheLoaiSach('Khoa học viễn tưởng','Sách giả tưởng thường diễn ra trong một khoảng thời gian khác với thời gian hiện tại của chúng ta. Chúng thường có các sinh vật huyền bí, từ pháp sư / phù thuỷ cho đến những thây ma không có thật.');
CALL Them_TheLoaiSach('Kinh dị','Các thể loại sách này bao gồm các ấn phẩm thường có mối liên hệ mật thiết đến những thể loại sách Mystery và đôi khi là giả tưởng – Fantasy, yếu tố ly kỳ và kinh dị tạo nên sự hồi hộp và điểm nổi bật của thể loại sách phổ biến này.');
CALL Them_TheLoaiSach('Truyền cảm hứng','Các thể loại sách được sáng tác dựa trên các trải nghiệm thực tế này ngày càng tiếp cận được đông đảo khán giả trên toàn thế giới. Nhiều cuốn sách về self-help liên quan đến các bài học thành công trong kinh doanh hoặc bí quyết kinh doanh hiện đang đứng dầu trong các danh sách Best Sellers của thị trường này.');
CALL Them_TheLoaiSach('Tự truyện','Đây là các thể loại sách phi hư cấu dùng để kể những câu chuyện về cuộc đời của một người. Trong trường hợp tự truyện và hồi ký, chủ thể sẽ là tác giả của cuốn sách. Tuy nhiên, danh mục tiểu sử lại có thể được viết bởi một người nào đó có quan tâm và tìm hiểu đến nhân vật, chứ không nhất thiết phải là chủ thể được nhắc đến trong cuốn sách.');
CALL Them_TheLoaiSach('Truyện ngắn','Truyện ngắn là văn xuôi ngắn gọn, tốt, ngắn hơn đáng kể so với tiểu thuyết. Các nhà văn kể câu chuyện của họ một cách nghiêm túc thông qua một chủ đề cụ thể và một loạt các cảnh ngắn gọn.');
CALL Them_TheLoaiSach('Cổ tích','Cổ tích là một thể loại văn học được tự sự dân gian sáng tác có xu thế hư cấu, bao gồm cổ tích thần kỳ, cổ tích thế sự, cổ tích phiêu lưu và cổ tích loài vật.');
CALL Them_TheLoaiSach('Bài luận','Các thể loại sách này thông thường được viết ở ngôi thứ nhất, người viết sử dụng kinh nghiệm cá nhân của chính họ để phản ánh về một chủ đề hoặc chủ đề cho người đọc.');
CALL Them_TheLoaiSach('Lịch sử','Những cuốn sách này ghi lại và bố cục một thời điểm cụ thể, với mục tiêu giáo dục và cung cấp thông tin cho người đọc, về mọi nơi trên thế giới tại bất kỳ thời điểm nào. Thể loại sách lịch sử cực kỳ hấp dẫn đối với những người yêu thích tìm hiểu về các nhân vật, triều đại trong quá khứ.');


CALL Them_TacGia('Jacob Ludwig Karl, Wilhelm Karl Grimm','Anh em nhà Grimm');
CALL Them_TacGia('William Shakespeare','William Shakespeare');
CALL Them_TacGia('Lev Nikolayevich Tolstoy','Lev Tolstoy');
CALL Them_TacGia('Charles John Huffam Dickens','Charles Dickens');
CALL Them_TacGia('Victor Hugo','Victor Hugo');
CALL Them_TacGia('Samuel Langhorne Clemens','Mark Twain');
CALL Them_TacGia('Aleksandr Sergeyevich Pushkin','Pushkin');
CALL Them_TacGia('Marcel Proust','Valentin Louis Georges Eugene Marcel Proust');
CALL Them_TacGia('Ernest Miller Hemingway','Ernest Hemingway');
CALL Them_TacGia('Francois-Marie Arouet','Voltaire');


CALL Them_NhaXuatBan('Nhà xuất bản giáo dục','1957-01-02');
CALL Them_NhaXuatBan('Nhà xuất bản Kim Đồng','1956-06-15');
CALL Them_NhaXuatBan('Nhà xuất bản Trẻ','1981-12-16');
CALL Them_NhaXuatBan('Nhà xuất bản Tổng hợp thành phố Hồ Chí Minh','1977-02-09');
CALL Them_NhaXuatBan('Nhà xuất bản chính trị quốc gia sự thật','1945-12-05');
CALL Them_NhaXuatBan('Nhà xuất bản Hội Nhà văn','1957-04-23');
CALL Them_NhaXuatBan('Nhà xuất bản Tư pháp','1988-11-02');
CALL Them_NhaXuatBan('Nhà xuất bản Thông tin và Truyền thông (ICPublisher)','1997-08-12');
CALL Them_NhaXuatBan('Nhà xuất bản lao động','1945-11-01');
CALL Them_NhaXuatBan('Nhà xuất bản Đại học Quốc Gia Hà Nội','1955-04-20');


CALL Them_Sach('Chú bé chăn cừu', 'Chú bé chăn cừu là truyện ngụ ngôn Aesop, nhắc nhở chúng ta phải biết vui đùa đúng lúc, đúng chỗ, và không nên nói dối người khác làm trò đùa vui cho mình.', '8', '2', '10'); -- Cổ tích-- 
CALL Them_Sach('Romeo và Juliet', 'Romeo và Juliet được viết vào khoảng 1594 - 1595, dựa trên một cốt truyện có sẵn kể về một mối tình oan trái vốn là câu chuyện có thật, từng xảy ra ở Ý thời Trung Cổ.', '8', '3', '2'); -- Bi kịch -- 
CALL Them_Sach('Chiến tranh và Hòa bình', 'Chiến tranh và hòa bình (tiếng Nga: Война и мир) là một tiểu thuyết của Lev Nikolayevich Tolstoy, được xuất bản rải rác trong giai đoạn 1865–1869. Tác phẩm được xem là thành tựu văn học xuất sắc nhất của Tolstoy, cũng như một tác phẩm kinh điển của văn học thế giới.', '3', '4', '8'); -- Tiểu thuyết -- 
CALL Them_Sach('Great Expectations', 'Great Expectations là một tiểu thuyết giáo dục nhân cách. Tác phẩm là sự mô tả quá trình trưởng thành của cậu bé mồ côi Pip. Cuốn tiểu thuyết được đăng hàng kì trên tạp chí văn học All the Year Round từ ngày 1/12/1860 đến tháng 8/1961. Vào tháng 10/1861, nhà xuất bản Chapman and Hall đã xuất bản thành một bộ tiểu thuyết gồm 3 tập. Great Expectations là cuốn tiểu thuyết sinh động, phản ánh các sự kiện, các mối quan tâm của nhà văn và mối quan hệ giữa xã hội và con người. Great Expectations quy tụ đầy đủ các sắc thái trong nền văn hóa bình dân: một quý bà Havisham giàu có nhưng rất khó tính và tàn nhẫn, một cô gái Estella xinh đẹp nhưng lạnh lùng, một người thợ rèn Joe tốt bụng và hào phóng, một bác Pumblechook hiền lành… Xuyên suốt câu chuyện, chủ đề chủ yếu mà nhà văn muốn đề cập tới là: giàu có và nghèo đói, tình yêu và sự cự tuyệt, và chiến thắng cuối cùng của cái thiện trước cái ác. Tác phẩm trở nên phổ biến và được giảng dạy ở các trường học tại Anh.', '7', '5', '9'); -- Truyện ngắn -- 
CALL Them_Sach('Những người khốn khổ', 'Những người khốn khổ là câu chuyện về xã hội nước Pháp trong khoảng hơn 20 năm đầu thế kỷ 19 kể từ thời điểm Napoléon I lên ngôi và vài thập niên sau đó. Nhân vật chính của tiểu thuyết là Jean Valjean, một cựu tù khổ sai tìm cách chuộc lại những lỗi lầm đã gây ra thời trai trẻ. Bộ tiểu thuyết không chỉ nói tới bản chất của cái tốt, cái xấu, của luật pháp, mà tác phẩm còn là cuốn bách khoa thư đồ sộ về lịch sử, kiến trúc của Paris, nền chính trị, triết lý, luật pháp, công lý, tín ngưỡng của nước Pháp nửa đầu thế kỷ 19.', '5', '6', '9');
CALL Them_Sach('Con ếch nhảy trứ danh ở Calaveras', 'Qua cuốn truyện, Mark Twain đã chế giễu sự điên khùng của nhiều du khách Mỹ đã phải băng qua đại dương để đi coi các ngôi mộ của người chết trong khi còn rất nhiều thứ đang sống, đáng coi hơn tại Mỹ. ', '2', '7', '9');
CALL Them_Sach('Ông lão đánh cá và con cá vàng', 'Trong truyện, Pushkin kể về một ông già cao tuổi sống cùng người vợ trong một căn chòi tồi tàn. Hằng ngày, ông ra biển đánh cá. Sau ba ngày không bắt được thứ gì ngoại trừ rong biển và rác rưởi, đến một ngày, ông bắt được một con cá vàng - vốn là một con cá thần. Con cá xin ông thả tự do và hứa sẽ thực hiện một điều mà ông mong muốn. Tuy nhiên, ông già không mong muốn cho mình bất cứ điều gì và thả cho cá đi.', '2', '8', '9');
CALL Them_Sach('Đi tìm thời gian đã mất', 'Đi tìm thời gian đã mất là tiểu thuyết có dấu ấn tự truyện với nhân vật chính là người kể chuyện ở ngôi thứ nhất xưng "tôi". Nhân vật "tôi" kể chuyện mình từ ngày còn nhỏ, với những ước mơ, dằn vặt, mối tình với Gilberte - con gái của Swann; với Albertine - một trong "những cô gái tuổi hoa", mối tình thơ mộng và đau xót làm cho nhân vật quằn quại. Còn có những thiên đường tuổi ấu thơ; một xã hội thượng lưu giả dối, nhạt nhẽo; Albertine sống bên cạnh Marcel như một "nữ tù nhân", rồi chết một cách thảm thương. Cuối cùng "thời gian lại tìm thấy", có nghĩa là người kể chuyện tìm ra lẽ sống của mình là cống hiến cuộc đời cho nghệ thuật. Tất cả những hoạt động xã hội chỉ là "thời gian đã mất" và người kể chuyện biến cái thời gian đã mất ấy thành một hành động sáng tạo nghệ thuật.', '6', '9', '2');
CALL Them_Sach('Ông già và biển cả', 'Câu chuyện xoay quanh cuộc sống đánh cá lênh đênh, gian nan của ông lão người Cuba, Santiago, người đã cố gắng chiến đấu trong ba ngày đêm với một con cá kiếm khổng lồ trên biển vùng Giếng Lớn khi ông câu được nó. Sang đến ngày thứ ba, ông dùng lao đâm chết được con cá, buộc nó vào mạn thuyền và mang về nhưng đàn cá mập lại đánh hơi thấy mùi của con cá mà ông bắt được nên đã ùa tới, ông cũng rất dũng cảm đem hết sức mình chống chọi với lũ cá mập, phóng lao và thậm chí dùng cả mái chèo để đánh. Cuối cùng ông giết được khá nhiều con và đuổi được chúng đi, nhưng cuối cùng khi ông về đến bờ và nhìn lại thì con cá kiếm của mình thì nó đã bị rỉa hết thịt và chỉ còn trơ lại một bộ xương trắng.', '4', '10', '8');
CALL Them_Sach('La Henriade', 'Henriade là một trong hai bài thơ sử thi của Voltaire, bài còn lại là La Pucelle dOrléans lấy Joan of Arc làm chủ đề châm biếm. Voltaire đã viết những bài thơ khác trong cuộc đời mình, nhưng không bài nào dài và chi tiết như hai bài này. Trong khi Henriade được coi là một bài thơ hay và là một trong những bài thơ hay nhất của Voltaire, nhiều người không tin rằng đây là kiệt tác của ông, hay bài thơ hay nhất mà ông có thể làm được; nhiều người cho rằng nó thiếu tính độc đáo hoặc cảm hứng mới lạ và nó không có gì thực sự phi thường. Một số nhận xét rằng tiêu chuẩn chất lượng thấp này là do Voltaire không hiểu những gì ông đang viết và sự thiếu nhiệt tình trong việc viết bài thơ.', '3', '11', '11');


CALL Them_DocGia('phucngo2208','ngothiphuc','Ngô Thị Phúc','Sô´1, Đường 3 Tháng 2, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ','0943476839','ntphuc2208@gmail.com');
CALL Them_DocGia('phghao94','phuonghaobui.94','Bùi Phương Hảo','Ấp Phước Lộc, Xã Thạnh Phú, Huyện Cờ Đỏ, Cần Thơ','0834452679','phghao94@gmail.com');
CALL Them_DocGia('truonglan13896','truongphonglan1996','Trương Phong Lan','Sô´420, Ấp Nhơn Lộc 2, Thị trấn Phong Điền, Huyện Phong Điền, Cần Thơ','0988856513','truonglan13896@gmail.com');
CALL Them_DocGia('huyvisinh','quochuy27.7','Nguyễn Quốc Huy','Ấp Đông Giang, Xã Đông Bình, Huyện Thới Lai, Cần Thơ','0902916609','huyvisinh@gmail.com');
CALL Them_DocGia('tienlucf1','tien.luc.96','Hồ Tiến Lực','Ấp F1, Xã Thạnh An, Huyện Vĩnh Thạnh, Cần Thơ','0774405994','tienlucf1@gmail.com');
CALL Them_DocGia('hangmai026','maithihang@90','Mai Thị Hằng','Sô´19A, Đường Cách Mạng Tháng 8, Phường An Thới, Quận Bình Thủy, Cần Thơ','0833110057','hangmai026@gmail.com');
CALL Them_DocGia('huydoan42','nguyendoan#1999','Nguyễn Huy Đoàn','Sô´1, Đường Đinh Tiên Hoàng, Phường Lê Bình, Quận Cái Răng, Cần Thơ','0935553593','huydoan42@gmail.com');
CALL Them_DocGia('thanhthuydiem','thuydiem.kdd$21','Diêm Thị Thanh Thủy','Sô´D1, Khu vực Thạnh Thuận, Phường Phú Thứ, Quận Cái Răng, Cần Thơ','0972122044','thanhthuydiem@gmail.com');
CALL Them_DocGia('nguyendthanh','dthanh.nguyen','Nguyễn Đình Thành','Sô´190, Đường 30 Tháng 4, Phường Hưng Lợi, Quận Ninh Kiều, Cần Thơ','09778980168','nguyendthanh@gmail.com');
CALL Them_DocGia('chinhchinh','huychinh.88n09','Nguyễn Huy Chính','Sô´24B, Đường Nguyễn Trãi, Phường Cái Khế, Quận Ninh Kiều, Cần Thơ','0905548031','chinhchinh@gmail.com');


CALL Them_ThuThu('nguyenngocmai','ngocmai@123','Nguyễn Ngọc Mai','Sô´24, Đường Lê Thị Tạo, Phường Thốt Nốt, Quận Thốt Nốt','0923863100','nguyenngocmai@gmail.com');
CALL Them_ThuThu('hoangdieulinh','dieulinh@123','Hoàng Diệu Linh','Sô´1866, Khu vực Thới Hưng, Phường Long Hưng, Quận Ô Môn','0923693228','hoangdieulinh@gmail.com');
CALL Them_ThuThu('nguyentthanhtam','thanhtam@123','Nguyễn Thị Thanh Tâm','Sô´759/6, Khu vực 5, Phường Châu Văn Liêm, Quận Ô Môn','0923667111','nguyentthanhtam@gmail.com');
CALL Them_ThuThu('trinhdinhtoan','dinhtoan@123','Trịnh Đình Dân','Sô´369, Đường Nguyễn Văn Cừ (nối dài), Phường An Khánh, Quận Ninh Kiều','0923667669','trinhdinhtoan@gmail.com');
CALL Them_ThuThu('nguyenvannghi','vannghi@123','Nguyễn Văn Nghị','Sô´159A/3, Tổ 1, Khu vực 1, Phường An Bình, Quận Ninh Kiều','0923853800','nguyenvannghi@gmail.com');
CALL Them_ThuThu('vutiendat','tiendat@123','Vũ Tiến Đạt','Sô´02, Đường Hòa Bình, Phường An Hội, Quận Ninh Kiều','0923659503','vutiendat@gmail.com');

CALL Them_MuonSach('1','5','2023-10-20','2023-10-27','11');
CALL Them_MuonSach('3','2','2023-08-15','2023-08-22','11');
CALL Them_MuonSach('5','1','2023-09-02','2023-09-07','12');
CALL Them_MuonSach('2','4','2023-03-07','2023-03-14','13');
CALL Them_MuonSach('7','6','2023-02-21','2023-02-28','15');
CALL Them_MuonSach('8','8','2023-02-27','2023-03-07','16');
CALL Them_MuonSach('4','9','2023-06-18','2023-06-25','13');
CALL Them_MuonSach('10','3','2023-07-24','2023-08-31','15');
CALL Them_MuonSach('9','10','2023-04-30','2023-05-07','16');
CALL Them_MuonSach('3','7','2023-06-13','2023-06-20','14');


CALL Them_KhoanPhat('9','2023-05-18','50000');
CALL Them_KhoanPhat('5','2023-09-07','150000');
CALL Them_KhoanPhat('3','2023-06-28','50000');
CALL Them_KhoanPhat('10','2023-09-07','150000');