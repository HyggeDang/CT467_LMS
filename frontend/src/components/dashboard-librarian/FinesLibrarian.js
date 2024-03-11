import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
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
import { formatDate, formatTrangThaiPhat, formatSoTienPhat, formatTrangThaiMuon } from "../../config/CommonFunctions";
import "./FinesLibrarian.scss";

/**
 * FinesLibrarian component
 * @param {FinesLibrarian} props
 * @return {jsx}
 */
const FinesLibrarian = (props) => {
    
    const [mangFines, setMangFines] = useState([]);
    const [openModalFine, setOpenModalFine] = useState(false);
    const [idFineSelected, setIdFineSelected] = useState(null); // neu khac null thi luu id tac gia update, neu null la dang ky moi
    const [objFine, setObjFine] = useState({
        idMuonSach: "",
        ngayGhiNhan: "",
        soTienPhat: "",
        trangThai: "unpaid"
    });

    // componentDidMout
    useEffect(() => {
        getAllFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalFine){
            setIdFineSelected(null);
            setObjFine({
                idMuonSach: "",
                ngayGhiNhan: "",
                soTienPhat: "",
                trangThai: "unpaid"
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalFine]);

    const getAllFines = () => {
        fetch(
            `${API_MAIN_URL}/get-fines`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangFines(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderModalFine = () => {
        return  <MDBModal id="modalFine" open={openModalFine} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Cập nhật khoản phạt</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    className={`lbDatePicker`}
                                    required
                                    name="ngayGhiNhan"
                                    type="text"
                                    id="ngayGhiNhan"
                                    label="Ngày Ghi Nhận"
                                    autoComplete="ngayGhiNhan"
                                    value={(objFine.ngayGhiNhan === "") ? "" : formatDate(objFine.ngayGhiNhan, "DD/MM/YYYY")}
                                />
                                <input
                                    type="date" 
                                    id="ngayGhiNhanPicker" 
                                    className="ipDatePicker"
                                    name="ngayGhiNhanPicker" 
                                    value={formatDate(objFine.ngayGhiNhan, "YYYY-MM-DD")}
                                    onChange={e => setObjFine({ ...objFine, ngayGhiNhan: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="soTienPhat"
                                    type="text"
                                    id="soTienPhat"
                                    label="Số tiền phạt"
                                    autoComplete="Số tiền phạt"
                                    value={objFine.soTienPhat}
                                    onChange={(evt) => setObjFine({...objFine, soTienPhat: evt.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth={true}>
                                    <InputLabel id="lb-slc-trang-thai">Trạng Thái</InputLabel>
                                    <Select
                                        fullWidth={true}
                                        labelId="lb-slc-trang-thai"
                                        id="slc-trang-thai"
                                        value={objFine.trangThai}
                                        label="Trạng Thái"
                                        onChange={e => setObjFine({ ...objFine, trangThai: e.target.value } )}
                                    >
                                        <MenuItem key="unpaid" value={"unpaid"}>Chưa thanh toán</MenuItem>
                                        <MenuItem key="paid" value={"paid"}>Đã thanh toán</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalFine(false)}>
                            Đóng
                        </MDBBtn>
                        <MDBBtn id="btn-update-fine" onClick={(evt) => callApiEditFine(evt)}>Cập nhật</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const callApiEditFine = () => {
        if(objFine.ngayGhiNhan === "" || objFine.soTienPhat === "" || objFine.trangThai === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-fine`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    body: JSON.stringify({ idKhoanPhat: idFineSelected, ...objFine, soTienPhat: parseInt(objFine.soTienPhat) }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    if(data?.success){
                        alert("Đã cập nhật thông tin khoản phạt!");
                        getAllFines();
                        setOpenModalFine(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const handleEditFine = (evt, idKhoanPhat) => {
        evt.preventDefault();
        setIdFineSelected(idKhoanPhat);
        fetch(
            `${API_MAIN_URL}/get-fine/?${new URLSearchParams({ idKhoanPhat })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const fineInfo = data[0];
                    setObjFine({ 
                        idMuonSach: fineInfo.KP_IDMuonSach,
                        ngayGhiNhan: formatDate(fineInfo.KP_NgayGhiNhan, "YYYY-MM-DD"),
                        soTienPhat: Math.trunc(fineInfo.KP_SoTienPhat),
                        trangThai: fineInfo.KP_TrangThai,
                    });
                    setOpenModalFine(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }


    return (
        <React.Fragment>
            <div className="fine-librarian-container">
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
                <div className="fine-librarian-table">
                    <table className="table table-bordered border-primary">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" className="hidden-data">idKhoanPhat</th>
                                        <th scope="col" className="hidden-data">idMuonSach</th>
                                        <th scope="col">Tên Sách</th>
                                        <th scope="col">Trạng Thái</th>
                                        <th scope="col">Ngày Mượn</th>
                                        <th scope="col">Ngày Hẹn Trả</th>
                                        <th scope="col">Ngày Trả Thực Tế</th>
                                        <th scope="col">Ngày Ghi Nhận</th>
                                        <th scope="col">Số Tiền</th>
                                        <th scope="col">Trạng Thái Phạt</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        mangFines.map((fine) => {
                                            return <tr key={`tr-fine-${fine.KP_ID}`}>
                                                <td className="hidden-data">{fine.ID}</td>
                                                <td className="hidden-data">{fine.KP_IDMuonSach}</td>
                                                <td>{fine.S_TenSach}</td>
                                                <td>{formatTrangThaiMuon(fine.MS_TrangThaiMuon)}</td>
                                                <td>{formatDate(fine.MS_NgayMuon)}</td>
                                                <td>{formatDate(fine.MS_NgayHenTra)}</td>
                                                <td>{formatDate(fine.MS_NgayTraThucTe)}</td>
                                                <td>{formatDate(fine.KP_NgayGhiNhan)}</td>
                                                <td>{formatSoTienPhat(fine.KP_SoTienPhat)}</td>
                                                <td>{formatTrangThaiPhat(fine.KP_TrangThai)}</td>
                                                <td className="col-control-data">
                                                    <IconButton aria-label="fingerprint" color="primary"
                                                            onClick={(e) => handleEditFine(e, fine.KP_ID)}
                                                        >
                                                        <AppRegistrationIcon />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                        </table>
                </div>
                {renderModalFine()}
            </div>
        </React.Fragment>
    );
}

export default FinesLibrarian;