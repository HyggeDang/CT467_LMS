import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Select from '@mui/material/Select';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import { API_MAIN_URL, HEADER_REQUEST_POST } from "../../config/Constants";
import { formatTrangThaiSach, formatTrangThaiMuon, formatDate } from "../../config/CommonFunctions";
import "./BooksLibrarian.scss";

/**
 * BooksLibrarian component
 * @param {BooksLibrarian} props
 * @return {jsx}
 */
const BooksLibrarian = (props) => {
    
    const [mangSach, setMangSach] = useState([]);
    const [openModalBook, setOpenModalBook] = useState(false);
    const [openModalListTick, setOpenModalListTick] = useState(false);
    const [mangTicket, setMangTicket] = useState([]);
    const [idBookSelected, setIdBookSelected] = useState(false);
    const [mangTheLoai, setMangTheLoai] = useState([]);
    const [mangNXB, setMangNXB] = useState([]);
    const [mangAuthor, setMangAuthor] = useState([]);
    const [objSach, setObjSach] = useState({
        tenSach: "", 
        moTa: "",  
        trangThai: "available",
        idTacGia: "", 
        idTheLoaiSach: "",
        idNhaXuatBan: "",
        tenTacGia: "",
        tenTheLoai: "",
        nhaXuatBan: "",
    })
    const [cdtSearch, setCdtSearch] = useState('');

    // componentDidMout
    useEffect(() => {
        getAllSach();
        getAllTheLoai();
        getAllPublisher();
        getAllAuthor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalBook){
            setIdBookSelected(null);
            setObjSach({
                tenSach: "", 
                moTa: "",  
                trangThai: "",
                idTacGia: "", 
                idTheLoaiSach: "",
                idNhaXuatBan: "",
                tenTacGia: "",
                tenTheLoai: "",
                nhaXuatBan: "",
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalBook]);

    useEffect(() => {
        if(!openModalListTick){
            setMangTicket([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListTick]);

    const getAllSach = () => {
        fetch(
            `${API_MAIN_URL}/get-books`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangSach(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getAllTheLoai = () => {
        fetch(
            `${API_MAIN_URL}/get-genres`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangTheLoai(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getAllPublisher = () => {
        fetch(
            `${API_MAIN_URL}/get-publishers`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangNXB(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getAllAuthor = () => {
        fetch(
            `${API_MAIN_URL}/get-authors`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangAuthor(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderModalBook = () => {
        return  <MDBModal id="modalBook" open={openModalBook} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        {
                            idBookSelected
                            ? <MDBModalTitle>Cập nhật thông tin sách</MDBModalTitle>
                            : <MDBModalTitle>Thêm mới sách</MDBModalTitle>
                        }
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="tenSach"
                                    label="Tên Sách"
                                    type="text"
                                    id="tenSach"
                                    autoComplete="tenSach"
                                    value={objSach.tenSach}
                                    onChange={e => setObjSach({ ...objSach, tenSach: e.target.value } )}
                                />
                            </Grid>
                            {/* tacGia */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true} className="form-slc">
                                    <InputLabel id="lb-slc-ten-tac-gia">Tên Tác Giả</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="lb-slc-ten-tac-gia"
                                        id="slc-ten-tac-gia"
                                        value={objSach.idTacGia}
                                        label="Tên Sách"
                                        onChange={e => setObjSach({ ...objSach, idTacGia: e.target.value } )}
                                    >
                                        {

                                            mangAuthor.map((item) => {
                                                return <MenuItem key={`tacgia-${item.TG_ID}`} value={item.TG_ID}>{item.TG_TenTacGia}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* tenTheLoai */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true} className="form-slc">
                                    <InputLabel id="lb-slc-ten-theloai">Tên Thể Loại</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="lb-slc-ten-theloai"
                                        id="slc-ten-theloai"
                                        value={objSach.idTheLoaiSach}
                                        label="Tên Thể Loại"
                                        onChange={e => setObjSach({ ...objSach, idTheLoaiSach: e.target.value } )}
                                    >
                                        {

                                            mangTheLoai.map((item) => {
                                                return <MenuItem key={`tacgia-${item.TLS_ID}`} value={item.TLS_ID}>{item.TLS_TenTheLoai}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* NXB */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true} className="form-slc-nxb">
                                    <InputLabel id="lb-slc-ten-tac-gia">Tên Nhà Xuất Bản</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="lb-slc-ten-nxb"
                                        id="slc-ten-nxb"
                                        value={objSach.idNhaXuatBan}
                                        label="Tên Sách"
                                        onChange={e => setObjSach({ ...objSach, idNhaXuatBan: e.target.value } )}
                                    >
                                        {

                                            mangNXB.map((item) => {
                                                return <MenuItem key={`tacgia-${item.NXB_ID}`} value={item.NXB_ID}>{item.NXB_TenNXB}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    multiline
                                    required
                                    fullWidth
                                    name="moTa"
                                    label="Mô Tả"
                                    type="text"
                                    id="moTa"
                                    autoComplete="moTa"
                                    value={objSach.moTa}
                                    onChange={e => setObjSach({ ...objSach, moTa: e.target.value } )}
                                />
                            </Grid>
                            {
                                (!idBookSelected) ? null
                                : <Grid item xs={12}>
                                    <TextField
                                        disabled={true}
                                        required
                                        fullWidth
                                        name="trangThai"
                                        label="Trạng Thái"
                                        type="text"
                                        id="trangThai"
                                        autoComplete="trangThai"
                                        value={formatTrangThaiSach(objSach.trangThai)}
                                    />
                                 </Grid>
                            }
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalBook(false)}>
                            Đóng
                        </MDBBtn>
                        {
                            idBookSelected
                            ? <MDBBtn id="btn-update-book" onClick={(evt) => callApiUpdateBook(evt)}>Cập nhật</MDBBtn>
                            : <MDBBtn id="btn-add-book" onClick={(evt) => callApiAddBook(evt)}>Thêm Mới</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const renderModalListTicket = () => {
        return  <MDBModal id="modalListTicket" open={openModalListTick} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Danh Sách Mượn Của Sách</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <table className="table table-bordered border-primary">
                            <thead>
                                <tr className="table-primary">
                                    <th scope="col">Tên Sách</th>
                                    <th scope="col">Tên Người Mượn</th>
                                    <th scope="col">Trạng Thái</th>
                                    <th scope="col">Ngày Mượn</th>
                                    <th scope="col">Ngày Hẹn Trả</th>
                                    <th scope="col">Ngày Trả Thực Tế</th>
                                    <th scope="col">Thủ Thư</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    mangTicket.map((ticket, index) => {
                                        return <tr key={`tr-muonsach-${ticket.MS_ID}`}>
                                            <td>{ticket.S_TenSach}</td>
                                            <td>{ticket.Ten_Nguoi_Muon}</td>
                                            <td>{formatTrangThaiMuon(ticket.MS_TrangThaiMuon)}</td>
                                            <td>{formatDate(ticket.MS_NgayMuon)}</td>
                                            <td>{formatDate(ticket.MS_NgayHenTra)}</td>
                                            <td>{formatDate(ticket.MS_NgayTraThucTe)}</td>
                                            <td>{ticket.Ten_Thu_Thu}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalListTick(false)}>
                            Đóng
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }
    const searchData = (typeSearch) => {
        let urlSearch = null;
        if(typeSearch === 1){
            urlSearch = `${API_MAIN_URL}/get-book-by-publisher/?${new URLSearchParams({ tenNXB: cdtSearch })}`;
        } else if(typeSearch === 2){
            urlSearch = `${API_MAIN_URL}/get-book-by-genre/?${new URLSearchParams({ tenTheLoai: cdtSearch })}`;
        } else if(typeSearch === 3) {
            urlSearch = `${API_MAIN_URL}/get-book-by-author/?${new URLSearchParams({ tenTacGia: cdtSearch })}`;
        } else {
            urlSearch = `${API_MAIN_URL}/get-books`;
        }
        fetch(
            urlSearch,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangSach(data);
                } else {
                    alert("Thông tin bạn tìm kiếm không có!");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });

    }

    const callApiAddBook = () => {
        if(objSach.tenSach === "" || objSach.moTa === "" || objSach.idTacGia === "" || objSach.idNhaXuatBan === "" || objSach.idTheLoaiSach === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/add-book`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "POST",
                    body: JSON.stringify({ 
                        tenSach: objSach.tenSach, 
                        moTa: objSach.moTa,  
                        idTacGia: objSach.idTacGia, 
                        idTheLoaiSach: objSach.idTheLoaiSach, 
                        idNhaXuatBan: objSach.idNhaXuatBan, 
                    }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã thêm sách thành công!");
                        getAllSach();
                        setOpenModalBook(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const callApiUpdateBook = () => {
        if(objSach.tenSach === "" || objSach.moTa === "" || objSach.idTacGia === "" || objSach.idNhaXuatBan === "" || objSach.idTheLoaiSach === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-book`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    body: JSON.stringify({ 
                        idSach: idBookSelected, 
                        tenSach: objSach.tenSach, 
                        moTa: objSach.moTa,  
                        idTacGia: objSach.idTacGia, 
                        idTheLoaiSach: objSach.idTheLoaiSach, 
                        idNhaXuatBan: objSach.idNhaXuatBan, 
                    }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    if(data?.success){
                        alert("Đã cập nhật thông tin sách thành công!");
                        getAllSach();
                        setOpenModalBook(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const handleAddBook = (e) => {
        setOpenModalBook(true);
    }

    const handleEditBook = (e, idSach) => {
        setIdBookSelected(idSach);
        fetch(
            `${API_MAIN_URL}/get-book/?${new URLSearchParams({ idSach })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const bookInfo = data[0];
                    setObjSach({ 
                        tenSach: bookInfo.S_TenSach,
                        moTa: bookInfo.S_MoTa,
                        trangThai: bookInfo.S_TrangThai,
                        idTacGia: bookInfo.S_IDTacGia,
                        idTheLoaiSach: bookInfo.S_IDTheLoaiSach,
                        idNhaXuatBan: bookInfo.S_IDNhaXuatBan,
                        tenTacGia: bookInfo.TG_TenTacGia,
                        tenTheLoai: bookInfo.TLS_TenTheLoai,
                        nhaXuatBan: bookInfo.NXB_TenNXB,
                    });
                    setOpenModalBook(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleWatchListTicket = (e, idSach) => {
        fetch(
            `${API_MAIN_URL}/get-ticket-by-book/?${new URLSearchParams({ idSach })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data) {
                    setMangTicket(data);
                    setOpenModalListTick(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    return (
        <React.Fragment>
            <div className="book-librarian-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-librarian'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="container-control">
                    <TextField margin="normal"
                        required
                        id="cdtSearch"
                        label="Điều kiện tìm kiếm"
                        name="cdtSearch"
                        autoComplete="cdtSearch"
                        value={cdtSearch}
                        onChange={e => setCdtSearch(e.target.value)}
                        size="small"
                        sx={{
                            marginLeft: "20px",
                            width: "500px"
                        }}
                    />
                    <Button size="medium" variant="contained" 
                        sx={{ 
                            marginLeft: 5,
                            marginTop: 2,
                            'MuiButton-root': { marginLeft: 20 }  
                        }} 
                        onClick={() => searchData(0)}>
                            Hiển thị tất cả
                    </Button>
                    <Button size="medium" variant="contained" 
                        sx={{ 
                            marginLeft: 5, 
                            marginTop: 2 ,
                        }} 
                        onClick={() => searchData(1)}>
                            Tìm kiếm theo nhà xuất bản
                    </Button>
                    <Button size="medium" variant="contained" 
                        sx={{ 
                            marginLeft: 5, 
                            marginTop: 2,
                        }} 
                        onClick={() => searchData(2)}>
                        Tìm kiếm theo thể loại
                    </Button>
                    <Button size="medium" variant="contained" 
                        sx={{ 
                            marginLeft: 5, 
                            marginTop: 2,
                        }} 
                        onClick={() => searchData(3)}>
                        Tìm kiếm theo tác giả
                    </Button>
                    <Button size="medium" variant="contained" 
                        sx={{ marginLeft: 5, marginTop: 2  }} 
                        onClick={(e) => handleAddBook(e)}>
                        <AddBoxIcon /> <label className="lb-add-book"> Thêm Sách </label>
                    </Button>
                </div>

                <div className="book-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">idSach</th>
                                <th scope="col">Tên Sách</th>
                                <th scope="col">Tên Tác Giả</th>
                                <th scope="col">Tên Thể Loại</th>
                                <th scope="col">Tên Nhà Xuất Bản</th>
                                <th scope="col">Mô Tả</th>
                                <th scope="col">Trạng Thái</th>
                                <th scope="col">Chỉnh Sửa</th>
                                <th scope="col">Danh Sách Mượn</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangSach.map((sach) => {
                                    return <tr key={`tr-sach-${sach.S_ID}`}>
                                        <td className="hidden-data">{sach.S_ID}</td>
                                        <td>{sach.S_TenSach}</td>
                                        <td>{sach.TG_TenTacGia}</td>
                                        <td>{sach.TLS_TenTheLoai}</td>
                                        <td>{sach.NXB_TenNXB}</td>
                                        <td>{sach.S_MoTa}</td>
                                        <td>{formatTrangThaiSach(sach.S_TrangThai)}</td>
                                        <td className="col-icon">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleEditBook(e, sach.S_ID)}
                                                >
                                                    <BorderColorIcon />
                                            </IconButton>
                                        </td>
                                        <td className="col-icon">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleWatchListTicket(e, sach.S_ID)}
                                                >
                                                    <ReceiptLongIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {renderModalBook()}
                {renderModalListTicket()}
            </div>
        </React.Fragment>
    );
}

export default BooksLibrarian;