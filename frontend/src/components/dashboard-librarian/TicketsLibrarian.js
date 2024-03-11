import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
import PostAddIcon from '@mui/icons-material/PostAdd';
import QueueIcon from '@mui/icons-material/Queue';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NextWeekIcon from '@mui/icons-material/NextWeek';
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
import { 
    formatSoTienPhat, 
    formatTrangThaiPhat, 
    formatTrangThaiMuon, 
    formatDate, 
} from "../../config/CommonFunctions";
import moment from 'moment';
import "./TicketsLibrarian.scss";

/**
 * TicketsLibrarian component
 * @param {TicketsLibrarian} props
 * @return {jsx}
 */
const TicketsLibrarian = (props) => {
    
    const [mangTicket, setMangTicket] = useState([]);
    const [dataModalFine, setDataModalFine] = useState([]);
    const [openModalFine, setOpenModalFine] = useState(false);
    const [openModalTicket, setOpenModalTicket] = useState(false);
    const [openModalReturnTicket, setOpenModalReturnTicket] = useState(false);
    const [openModalAddFine, setOpenModalAddFine] = useState(false);
    const [idMuonSachSelected, setIdMuonSachSelected] = useState(null);
    const [objTicketSelected, setObjTicketSelected] = useState({
        idNguoiDung: "",
        idSach: "",
        ngayMuon: "",
        ngayHenTra: "",
        ngayTraThucTe: "",
        trangThaiMuon: "borrowing",
        idThuThu: localStorage.getItem("idNguoiDung"),
        tenThuThu: localStorage.getItem("tenNguoiDung"),
    });
    const [objFine, setObjFine] = useState({
        NgayGhiNhan: moment().format("YYYY-MM-DD"),
        SoTienPhat: 0,
    })
    const [mangSach, setMangSach] = useState([]);
    const [mangSachAvailable, setMangSachAvailable] = useState([]);
    const [mangReader, setMangReader] = useState([]);
    
    // componentDidMout
    useEffect(() => {
        getAllTickets();
        getAllSach();
        getAllReaders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalTicket){
            setIdMuonSachSelected(null);
            refreshObjTicketSelected();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalTicket]);

    useEffect(() => {
        if(!openModalReturnTicket){
            setIdMuonSachSelected(null);
            refreshObjTicketSelected();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalReturnTicket]);

    useEffect(() => {
        if(!openModalAddFine){
            setIdMuonSachSelected(null);
            setObjFine({
                NgayGhiNhan: moment().format("YYYY-MM-DD"),
                SoTienPhat: 0,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalAddFine]);

    const refreshObjTicketSelected = () => {
        setObjTicketSelected({
            idNguoiDung: "",
            idSach: "",
            ngayMuon: "",
            ngayHenTra: "",
            ngayTraThucTe: "",
            trangThaiMuon: "borrowing",
            idThuThu: localStorage.getItem("idNguoiDung"),
            tenThuThu: localStorage.getItem("tenNguoiDung"),
        });
    }
    
    const getAllTickets = () => {
        fetch(
            `${API_MAIN_URL}/get-tickets`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data) {
                    setMangTicket(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getAllSach = () => {
        fetch(
            `${API_MAIN_URL}/get-books`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    const arrSachAva = data.filter((book) => book.S_TrangThai === "available");
                    setMangSach(data);
                    setMangSachAvailable(arrSachAva);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getAllReaders = () => {
        fetch(
            `${API_MAIN_URL}/get-readers`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangReader(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const getDataKhoanPhat = (idMuonSach) => {
        fetch(
            `${API_MAIN_URL}/get-fine-by-ticket/?${new URLSearchParams({ idMuonSach })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                setDataModalFine(data);
                setOpenModalFine(true);
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderModalFines = () => {
        return  <MDBModal id="modalFine" open={openModalFine} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Thông tin khoản phạt</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <table className="table table-bordered border-primary">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" className="hidden-data">idMuonSach</th>
                                        <th scope="col">Tên Sách</th>
                                        <th scope="col">Trạng Thái</th>
                                        <th scope="col">Ngày Mượn</th>
                                        <th scope="col">Ngày Hẹn Trả</th>
                                        <th scope="col">Ngày Trả Thực Tế</th>
                                        <th scope="col">Ngày Ghi Nhận</th>
                                        <th scope="col">Số Tiền</th>
                                        <th scope="col">Trạng Thái Phạt</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        dataModalFine.map((fine) => {
                                            return <tr key={`tr-fine-${fine.KP_ID}`}>
                                                <td className="hidden-data">{fine.KP_IDMuonSach}</td>
                                                <td>{fine.S_TenSach}</td>
                                                <td>{formatTrangThaiMuon(fine.MS_TrangThaiMuon)}</td>
                                                <td>{formatDate(fine.MS_NgayMuon)}</td>
                                                <td>{formatDate(fine.MS_NgayHenTra)}</td>
                                                <td>{formatDate(fine.MS_NgayTraThucTe)}</td>
                                                <td>{formatDate(fine.KP_NgayGhiNhan)}</td>
                                                <td>{formatSoTienPhat(fine.KP_SoTienPhat)}</td>
                                                <td>{formatTrangThaiPhat(fine.KP_TrangThai)}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                        </table>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalFine(false)}>
                            Đóng
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const renderModalTicket = () => {
        const mangSachRender = (idMuonSachSelected) ? mangSach : mangSachAvailable;
        return  <MDBModal id="modalTicket" open={openModalTicket} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        {
                            idMuonSachSelected
                            ? <MDBModalTitle>Cập nhật thông tin mượn sách</MDBModalTitle>
                            : <MDBModalTitle>Thêm thông tin mượn sách</MDBModalTitle>
                        }
                        
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            {/* tenSach */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id="lb-slc-ten-sach">Tên Sách</InputLabel>
                                    <Select
                                        disabled={(idMuonSachSelected) ? true : false}
                                        fullWidth={true}
                                        labelId="lb-slc-ten-sach"
                                        id="slc-ten-sach"
                                        value={objTicketSelected.idSach}
                                        label="Tên Sách"
                                        onChange={e => setObjTicketSelected({ ...objTicketSelected, idSach: e.target.value } )}
                                    >
                                        {

                                            mangSachRender.map((item) => {
                                                return <MenuItem key={`sach-${item.S_ID}`} value={item.S_ID}>{item.S_TenSach}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* idNguoiDung */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true} id="form-slc-nguoimuon">
                                    <InputLabel id="lb-slc-ten-sach">Tên Người Mượn</InputLabel>
                                    <Select
                                        disabled={(idMuonSachSelected) ? true : false}
                                        fullWidth={true}
                                        labelId="lb-slc-ten-nguoi-muon"
                                        id="slc-ten-nguoi-muon"
                                        value={objTicketSelected.idNguoiDung}
                                        label="Tên Người Mượn"
                                        onChange={e => setObjTicketSelected({ ...objTicketSelected, idNguoiDung: e.target.value } )}
                                    >
                                        {
                                            mangReader.map((item) => {
                                                return <MenuItem key={`reader-${item.ND_ID}`} value={item.ND_ID}>{item.ND_HoTen}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* trangThaiMuon */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id="lb-slc-trang-thai">Trạng Thái</InputLabel>
                                    <Select
                                        disabled={(!idMuonSachSelected) ? true : false}
                                        fullWidth={true}
                                        labelId="lb-slc-trang-thai"
                                        id="slc-trang-thai"
                                        value={objTicketSelected.trangThaiMuon}
                                        label="Trạng Thái"
                                        onChange={e => setObjTicketSelected({ ...objTicketSelected, trangThaiMuon: e.target.value } )}
                                    >
                                        <MenuItem key="borrowing" value={"borrowing"}>Đang mượn</MenuItem>
                                        <MenuItem key="on_time" value={"on_time"}>Trả đúng hạn</MenuItem>
                                        <MenuItem key="overdue" value={"overdue"}>Trễ hạn</MenuItem>
                                        <MenuItem key="damaged" value={"damaged"}>Hư hại</MenuItem>
                                        <MenuItem key="lost" value={"lost"}>Thất lạc</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* ngayMuon */}
                            <Grid item xs={12}>
                                <TextField
                                    // className={`lbDatePicker ${(idMuonSachSelected) ? "disable-item" : ""}`}
                                    className={`lbDatePicker`}
                                    required
                                    name="ngayMuon"
                                    type="text"
                                    id="ngayMuon"
                                    label="Ngày Mượn"
                                    autoComplete="ngayMuon"
                                    value={(objTicketSelected.ngayMuon === "") ? "" : formatDate(objTicketSelected.ngayMuon, "DD/MM/YYYY")}
                                />
                                <input
                                    // readOnly={(idMuonSachSelected) ? true : false}
                                    type="date" 
                                    id="ngayMuonPicker" 
                                    className="ipDatePicker"
                                    name="ngayMuonPicker" 
                                    value={formatDate(objTicketSelected.ngayMuon, "YYYY-MM-DD")}
                                    onChange={e => setObjTicketSelected({ ...objTicketSelected, ngayMuon: e.target.value } )}
                                />
                            </Grid>
                            {/* ngayHenTra */}
                            <Grid item xs={12}>
                                <TextField
                                    // className={`lbDatePicker ${(idMuonSachSelected) ? "disable-item" : ""}`}
                                    className={`lbDatePicker`}
                                    required
                                    name="ngayHenTra"
                                    type="text"
                                    id="ngayHenTra"
                                    label="Ngày Hẹn Trả"
                                    autoComplete="ngayHenTra"
                                    value={(objTicketSelected.ngayHenTra === "") ? "" : formatDate(objTicketSelected.ngayHenTra, "DD/MM/YYYY")}
                                />
                                <input
                                    // readOnly={(idMuonSachSelected) ? true : false}
                                    type="date" 
                                    id="ngayHenTraPicker" 
                                    className="ipDatePicker"
                                    name="ngayHenTraPicker" 
                                    value={formatDate(objTicketSelected.ngayHenTra, "YYYY-MM-DD")}
                                    onChange={e => setObjTicketSelected({ ...objTicketSelected, ngayHenTra: e.target.value } )}
                                />
                            </Grid>
                            {/* ngayTraThucTe */}
                            <Grid item xs={12} sx={{ display: (!idMuonSachSelected) ? "none": "auto" }}>
                                <TextField
                                    className={`lbDatePicker ${(!idMuonSachSelected) ? "disable-item" : ""}`}
                                    name="ngayTraThucTe"
                                    type="text"
                                    id="ngayTraThucTe"
                                    label="Ngày Trả Thực Tế"
                                    autoComplete="ngayTraThucTe"
                                    value={
                                        (!idMuonSachSelected ||objTicketSelected.ngayTraThucTe === "" ) ? "" 
                                        : formatDate(objTicketSelected.ngayTraThucTe, "DD/MM/YYYY")
                                    }
                                />
                                <input
                                    type="date"
                                    readOnly={(!idMuonSachSelected) ? true : false}
                                    id="ngayTraThucTePicker" 
                                    className="ipDatePicker"
                                    name="ngayTraThucTePicker" 
                                    value={formatDate(objTicketSelected.ngayTraThucTe, "YYYY-MM-DD")}
                                    onChange={e => setObjTicketSelected({ ...objTicketSelected, ngayTraThucTe: e.target.value } )}

                                />
                            </Grid>
                            {/* tenThuThu */}
                            <Grid item xs={12}>
                                <TextField
				                    inputProps={{ readOnly: true }}
                                    required
                                    name="tenThuThu"
                                    type="text"
                                    id="tenThuThu"
                                    label="Tên Thủ thư"
                                    autoComplete="tenThuThu"
                                    value={objTicketSelected.tenThuThu}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalTicket(false)}>
                            Đóng
                        </MDBBtn>
                        {
                            idMuonSachSelected
                            ? <MDBBtn id="btn-update-publisher" onClick={(evt) => callApiUpdateTicket(evt)}>Cập nhật</MDBBtn>
                            : <MDBBtn id="btn-add-publisher" onClick={(evt) => callApiAddTicket(evt)}>Thêm Mới</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const renderModalReturnTicket = () => {
        return  <MDBModal id="modalReturnTicket" open={openModalReturnTicket} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Trả thông tin mượn sách</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            {/* trangThaiMuon */}
                            <Grid item xs={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id="lb-slc-trang-thai">Trạng Thái</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="lb-slc-trang-thai"
                                        id="slc-trang-thai"
                                        value={objTicketSelected.trangThaiMuon}
                                        label="Trạng Thái"
                                        onChange={e => setObjTicketSelected({ ...objTicketSelected, trangThaiMuon: e.target.value } )}
                                    >
                                        <MenuItem key="borrowing" value={"borrowing"}>Đang mượn</MenuItem>
                                        <MenuItem key="on_time" value={"on_time"}>Trả đúng hạn</MenuItem>
                                        <MenuItem key="overdue" value={"overdue"}>Trễ hạn</MenuItem>
                                        <MenuItem key="damaged" value={"damaged"}>Hư hại</MenuItem>
                                        <MenuItem key="lost" value={"lost"}>Thất lạc</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* ngayTraThucTe */}
                            <Grid item xs={12}>
                                <TextField
                                    className={`lbDatePicker`}
                                    name="ngayTraThucTe"
                                    type="text"
                                    id="ngayTraThucTe"
                                    label="Ngày Trả Thực Tế"
                                    autoComplete="ngayTraThucTe"
                                    value={
                                        (objTicketSelected.ngayTraThucTe === "" ) ? "" 
                                        : formatDate(objTicketSelected.ngayTraThucTe, "DD/MM/YYYY")
                                    }
                                />
                                <input
                                    type="date"
                                    id="ngayTraThucTePicker" 
                                    className="ipDatePicker"
                                    name="ngayTraThucTePicker" 
                                    value={objTicketSelected.ngayTraThucTe !== "" ? formatDate(objTicketSelected.ngayTraThucTe, "YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                    onChange={e => setObjTicketSelected({ ...objTicketSelected, ngayTraThucTe: e.target.value } )}

                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalReturnTicket(false)}>
                            Đóng
                        </MDBBtn>
                        <MDBBtn id="btn-update-publisher" onClick={(evt) => callApiReturnTicket(evt)}>Trả sách</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const renderModalAddFine = () => {
        return  <MDBModal id="modalAddFine" open={openModalAddFine} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Thêm Khoản Phạt</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="soTienPhat"
                                    type="text"
                                    id="soTienPhat"
                                    label="Số tiền phạt"
                                    autoComplete="Số tiền phạt"
                                    value={objFine.SoTienPhat}
                                    onChange={(evt) => setObjFine({...objFine, SoTienPhat: evt.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalAddFine(false)}>
                            Đóng
                        </MDBBtn>
                        <MDBBtn id="btn-add-fine" onClick={(evt) => callApiAddFine(evt)}>Thêm khoản phạt</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const callApiAddTicket = (evt) =>{
        if(objTicketSelected.idNguoiDung === "" 
            || objTicketSelected.idSach === ""
            || objTicketSelected.ngayMuon === ""
            || objTicketSelected.ngayHenTra === ""
            || objTicketSelected.trangThaiMuon === ""
        ){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/add-ticket`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "POST",
                    // idNguoiDung, idSach, ngayMuon, ngayHenTra, idThuThu
                    body: JSON.stringify({ 
                        idNguoiDung: objTicketSelected.idNguoiDung,
                        idSach: objTicketSelected.idSach,
                        ngayMuon: (objTicketSelected.ngayMuon) ? formatDate(objTicketSelected.ngayMuon, "YYYY-MM-DD") : null,
                        ngayHenTra: (objTicketSelected.ngayHenTra) ? formatDate(objTicketSelected.ngayHenTra, "YYYY-MM-DD") : null,
                        idThuThu: objTicketSelected.idThuThu,
                    }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if them thanh cong
                    if(data?.success){
                        alert("Đã thêm thông tin thành công");
                        getAllTickets();
                        setOpenModalTicket(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const callApiUpdateTicket = (evt) =>{
        if(objTicketSelected.ngayMuon === ""
            || objTicketSelected.ngayHenTra === ""
            || objTicketSelected.trangThaiMuon === ""
        ){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-ticket`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    // idMuonSach, idNguoiDung, idSach, ngayMuon, ngayHenTra, ngayTraThucTe, TrangThaiMuon, idThuThu
                    body: JSON.stringify({ 
                        idMuonSach: idMuonSachSelected,
                        idNguoiDung: objTicketSelected.idNguoiDung,
                        idSach: objTicketSelected.idSach,
                        ngayMuon: formatDate(objTicketSelected.ngayMuon, "YYYY-MM-DD"),
                        ngayHenTra: formatDate(objTicketSelected.ngayHenTra, "YYYY-MM-DD"),
                        ngayTraThucTe: objTicketSelected.ngayTraThucTe === "" ? null : formatDate(objTicketSelected.ngayTraThucTe, "YYYY-MM-DD"),
                        trangThaiMuon: objTicketSelected.trangThaiMuon,
                        idThuThu: objTicketSelected.idThuThu,
                    }), 
                })
            .then((response)  => {
            response.json().then((data) => {
                    // if them thanh cong
                    if(data?.success){
                        alert("Đã cập nhật thông tin thành công");
                        getAllTickets();
                        setOpenModalTicket(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const callApiReturnTicket = (evt) => {
        fetch(
            `${API_MAIN_URL}/add-book-return`,
            {
                ...HEADER_REQUEST_POST,
                method: "POST",
                // idMuonSach, TrangThaiMuon, ngayTraThucTe
                body: JSON.stringify({ 
                    idMuonSach: idMuonSachSelected,
                    trangThaiMuon: objTicketSelected.trangThaiMuon,
                    ngayTraThucTe: (objTicketSelected.ngayTraThucTe === "") 
                                    ? moment().format("YYYY-MM-DD") : formatDate(objTicketSelected.ngayTraThucTe , "YYYY-MM-DD")
                }), 
            })
        .then((response)  => {
        response.json().then((data) => {
                if(data?.success){
                    alert("Đã cập nhật thông tin trả sách thành công");
                    getAllTickets();
                    setOpenModalReturnTicket(false);
                } else {
                    alert("Đã xảy ra lỗi, không thành công");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }
    
    const callApiAddFine = () => {
        fetch(
            `${API_MAIN_URL}/add-fine`,
            {
                ...HEADER_REQUEST_POST,
                method: "POST",
                // idMuonSach, NgayGhiNhan, SoTienPhat
                body: JSON.stringify({ 
                    idMuonSach: idMuonSachSelected,
                    NgayGhiNhan: objFine.NgayGhiNhan,
                    SoTienPhat: parseInt(objFine.SoTienPhat),
                }), 
            })
        .then((response)  => {
        response.json().then((data) => {
                if(data?.success){
                    alert("Đã thêm khoản phạt");
                    getAllTickets();
                    setOpenModalAddFine(false);
                } else {
                    alert("Đã xảy ra lỗi, không thành công");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleAddTicket = (evt) =>{
        evt.preventDefault();
        setOpenModalTicket(true);
    }

    const handleEditTicket = (evt, idMuonSach, flgReturnTicket = false) =>{
        evt.preventDefault();
        setIdMuonSachSelected(idMuonSach);
        fetch(
            `${API_MAIN_URL}/get-ticket/?${new URLSearchParams({ idMuonSach })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const ticketInfo = data[0];
                    setObjTicketSelected({
                        idNguoiDung: ticketInfo.ID_Nguoi_Muon,
                        idSach: ticketInfo.MS_IDSach,
                        ngayMuon: (ticketInfo.MS_NgayMuon) ? ticketInfo.MS_NgayMuon : "",
                        ngayHenTra: (ticketInfo.MS_NgayHenTra) ? ticketInfo.MS_NgayHenTra : "",
                        ngayTraThucTe: (ticketInfo.MS_NgayTraThucTe) ? ticketInfo.MS_NgayTraThucTe : "",
                        trangThaiMuon: ticketInfo.MS_TrangThaiMuon,
                        idThuThu: ticketInfo.ID_Thu_Thu,
                        tenThuThu: ticketInfo.Ten_Thu_Thu,
                    });
                    if(flgReturnTicket){
                        setOpenModalReturnTicket(true);
                    } else {
                        setOpenModalTicket(true);
                    }
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleAddFine = (evt, idMuonSach) => {
        setIdMuonSachSelected(idMuonSach);
        setOpenModalAddFine(true);
    }

    return (
        <React.Fragment>
            <div className="ticket-librarian-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-librarian'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={(e) => handleAddTicket(e)}>
                    <PostAddIcon /> <label className="lb-add-ticket"> Thêm Mượn Sách </label>
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="ticket-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">idDdata</th>
                                <th scope="col" className="hidden-data">idMuonSach</th>
                                <th scope="col" className="hidden-data">idSach</th>
                                <th scope="col" className="hidden-data">idThuThu</th>
                                <th scope="col">Tên Sách</th>
                                <th scope="col">Tên Người Mượn</th>
                                <th scope="col">Trạng Thái</th>
                                <th scope="col">Ngày Mượn</th>
                                <th scope="col">Ngày Hẹn Trả</th>
                                <th scope="col">Ngày Trả Thực Tế</th>
                                <th scope="col">Thủ Thư</th>
                                <th scope="col">Khoản Phạt</th>
                                <th scope="col">Thêm Khoản Phạt</th>
                                <th scope="col">Chỉnh sửa</th>
                                <th scope="col">Trả Sách</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangTicket.map((ticket, index) => {
                                    return <tr key={`tr-muonsach-${ticket.MS_ID}`}>
                                        <td className="idxMS hidden-data">{index}</td>
                                        <td className="hidden-data">{ticket.MS_ID}</td>
                                        <td className="hidden-data">{ticket.MS_IDSach}</td>
                                        <td className="hidden-data">{ticket.MS_IDThuThu}</td>
                                        <td>{ticket.S_TenSach}</td>
                                        <td>{ticket.Ten_Nguoi_Muon}</td>
                                        <td>{formatTrangThaiMuon(ticket.MS_TrangThaiMuon)}</td>
                                        <td>{formatDate(ticket.MS_NgayMuon)}</td>
                                        <td>{formatDate(ticket.MS_NgayHenTra)}</td>
                                        <td>{formatDate(ticket.MS_NgayTraThucTe)}</td>
                                        <td>{ticket.Ten_Thu_Thu}</td>
                                        <td className="col-icon">
                                            {
                                                (
                                                    ticket.MS_TrangThaiMuon !== "borrowing"
                                                    && ticket.MS_TrangThaiMuon !== "on_time"
                                                )
                                                ? (
                                                    <IconButton aria-label="fingerprint" color="warning"
                                                        onClick={() => getDataKhoanPhat(ticket.MS_ID)}
                                                    >
                                                        <NearbyErrorIcon />
                                                    </IconButton>
                                                )
                                                : null
                                            }
                                        </td>
                                        <td className="col-icon">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleAddFine(e, ticket.MS_ID)}
                                                >
                                                    <QueueIcon />
                                            </IconButton>
                                        </td>
                                        <td className="col-icon">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleEditTicket(e, ticket.MS_ID)}
                                                >
                                                    <BorderColorIcon />
                                            </IconButton>
                                        </td>
                                        <td className="col-icon">
                                            {
                                                ticket.MS_TrangThaiMuon === "borrowing" ? (
                                                <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleEditTicket(e, ticket.MS_ID, true)}
                                                >
                                                    <NextWeekIcon />
                                                </IconButton>) : <></>
                                            }

                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {renderModalFines()}
                {renderModalTicket()}
                {renderModalReturnTicket()}
                {renderModalAddFine()}
            </div>
        </React.Fragment>
    );
}

export default TicketsLibrarian;