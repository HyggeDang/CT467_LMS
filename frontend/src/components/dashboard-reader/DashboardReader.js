import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
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
import "./DashboardReader.scss";

/**
 * DashboardReader component
 * @param {DashboardReader} props
 * @return {jsx}
 */
const DashboardReader = (props) => {
    const [openModalUserInfo, setOpenModalUserInfo] = useState(false);
    const [openModalUserPass, setOpenModalUserPass] = useState(false);
    const [userNewPass, setUserNewPass] = useState('');
    const [userInfo, setUserInfo] = useState({
        diaChi: "",
        email: "",
        hoTen: "",
        soDienThoai: "",
    });
    const getDataNguoiDung = () => {
        const idNguoiDung = localStorage.getItem("idNguoiDung");
        fetch(
            `${API_MAIN_URL}/get-user-info/?${new URLSearchParams({ idNguoiDung })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                console.log(data)
                if(data && data.length > 0){
                    const userInfo = data[0];
                    setUserInfo({ 
                        diaChi: userInfo.ND_DiaChi,
                        email: userInfo.ND_Email,
                        hoTen: userInfo.ND_HoTen,
                        soDienThoai: userInfo.ND_SoDienThoai,
                    });
                    setOpenModalUserInfo(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const updateUserInfo = (evt) => {
        evt.preventDefault();
        const { hoTen, diaChi, soDienThoai, email } = userInfo;
        const idNguoiDung = localStorage.getItem("idNguoiDung");
        fetch(
            `${API_MAIN_URL}/edit-user`,
            {
                ...HEADER_REQUEST_POST,
                method: "PUT",
                body: JSON.stringify({ idNguoiDung, hoTen, diaChi, soDienThoai, email }), 
            })
        .then((response)  => {
           response.json().then((data) => {
                // if cap nhat thanh cong
                if(data?.success){
                    alert("Thông tin của bạn đã được cập nhật!");
                } else {
                    alert("Đã xảy ra lỗi, không thành công");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const updateUserPass = (evt) => {
        evt.preventDefault();
        const idNguoiDung = localStorage.getItem("idNguoiDung");
        fetch(
            `${API_MAIN_URL}/edit-user-password`,
            {
                ...HEADER_REQUEST_POST,
                method: "PUT",
                body: JSON.stringify({ idNguoiDung, matKhauMoi: userNewPass }), 
            })
        .then((response)  => {
           response.json().then((data) => {
                // if cap nhat thanh cong
                if(data?.success){
                    alert("Thông tin của bạn đã được cập nhật!");
                } else {
                    alert("Đã xảy ra lỗi, không thành công");
                }
            }).catch((err) => {
                alert(err);
            }) 
        });
    }
    
    const renderModalEditUserInfo = () => {
        return  <MDBModal id="modal-edit-user-info" open={openModalUserInfo} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Thông tin người dùng</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="hoTen"
                                    label="Họ Tên"
                                    type="text"
                                    id="hoTen"
                                    autoComplete="Ho Ten"
                                    value={userInfo.hoTen}
                                    onChange={e => setUserInfo({ ...userInfo, hoTen: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="diaChi"
                                    label="Địa Chỉ"
                                    type="text"
                                    id="diaChi"
                                    autoComplete="diaChi"
                                    value={userInfo.diaChi}
                                    onChange={e => setUserInfo({ ...userInfo, diaChi: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="soDienThoai"
                                    label="Số Điện Thoại"
                                    type="text"
                                    id="soDienThoai"
                                    autoComplete="So Dien Thoai"
                                    value={userInfo.soDienThoai}
                                    onChange={e => setUserInfo({ ...userInfo, soDienThoai: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    id="email"
                                    autoComplete="Email"
                                    value={userInfo.email}
                                    onChange={e => setUserInfo({ ...userInfo, email: e.target.value } )}
                                />
                            </Grid>
                            </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalUserInfo(false)}>
                            Đóng
                        </MDBBtn>
                        <MDBBtn id="btn-update-user-info" onClick={(evt) => updateUserInfo(evt)}>Cập nhật</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const renderModalEditUserPass = () => {
        return  <MDBModal id="modal-edit-user-pass" open={openModalUserPass} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Thay đổi mật khẩu</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="userNewPass"
                                    label="Mật Khẩu Mới"
                                    type="password"
                                    id="userNewPass"
                                    autoComplete="Mật Khẩu Mới"
                                    value={userNewPass}
                                    onChange={e => setUserNewPass(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalUserPass(false)}>
                            Đóng
                        </MDBBtn>
                        <MDBBtn id="btn-update-user-pass" onClick={(evt) => updateUserPass(evt)}>Cập nhật</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    }

    const goToScreen = (path) => {
        window.location = path;
    }

    return (
        <React.Fragment>
            <div className="reader-container">
                <h1> ỨNG DỤNG QUẢN LÝ THƯ VIỆN </h1>
                <h3> Xin chào đọc giả, {localStorage.getItem("tenNguoiDung")} </h3>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => goToScreen('books-reader')}>Sách</Button>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => goToScreen('tickets-reader')}>Mượn Sách</Button>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => goToScreen('fines-reader')}>Khoản Phạt</Button>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => getDataNguoiDung()}>Chỉnh sửa thông tin người dùng</Button>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => setOpenModalUserPass(true)}>Thay đổi mật khẩu người dùng</Button>
                <Button variant="contained" sx={{ marginLeft: 5, marginTop: 5  }} 
                        onClick={() => logout()}>Đăng Xuất</Button> 
            </div>
            {renderModalEditUserInfo()}
            {renderModalEditUserPass()}
        </React.Fragment>
    );
}

export default DashboardReader;