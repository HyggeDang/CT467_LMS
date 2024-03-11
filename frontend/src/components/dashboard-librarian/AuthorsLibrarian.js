import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
import "./AuthorsLibrarian.scss";

/**
 * AuthorsLibrarian component
 * @param {AuthorsLibrarian} props
 * @return {jsx}
 */
const AuthorsLibrarian = (props) => {
    
    const [mangTacGia, setMangTacGia] = useState([]);
    const [openModalAuthor, setOpenModalAuthor] = useState(false);
    const [modeModalAuthor, setModeModalAuthor] = useState(null); // neu khac null thi luu id tac gia update, neu null la dang ky moi
    const [objAuthor, setObjAuthor] = useState({
        tenTacGia: "",
        butDanh: "",
    });

    // componentDidMout
    useEffect(() => {
        callAPIGetAuthorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalAuthor){
            setModeModalAuthor(null);
            setObjAuthor({
                tenTacGia: "",
                butDanh: "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalAuthor]);

    const callAPIGetAuthorList = () => {
        fetch(
            `${API_MAIN_URL}/get-authors`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangTacGia(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderModalAuthor = () => {
        return  <MDBModal id="modal-author" open={openModalAuthor} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        {
                            modeModalAuthor
                            ? <MDBModalTitle>Cập nhật tác giả</MDBModalTitle>
                            : <MDBModalTitle>Thêm mới tác giả</MDBModalTitle>
                        }
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="tenTacGia"
                                    label="Tên Tác Giả"
                                    type="text"
                                    id="tenTacGia"
                                    autoComplete="tenTacGia"
                                    value={objAuthor.tenTacGia}
                                    onChange={e => setObjAuthor({ ...objAuthor, tenTacGia: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="butDanh"
                                    label="Bút Danh"
                                    type="text"
                                    id="butDanh"
                                    autoComplete="butDanh"
                                    value={objAuthor.butDanh}
                                    onChange={e => setObjAuthor({ ...objAuthor, butDanh: e.target.value } )}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalAuthor(false)}>
                            Đóng
                        </MDBBtn>
                        {
                            modeModalAuthor
                            ? <MDBBtn id="btn-update-author" onClick={(evt) => callApiEditAuthor(evt)}>Cập nhật</MDBBtn>
                            : <MDBBtn id="btn-add-author" onClick={(evt) => callApiAddAuthor(evt)}>Thêm Mới</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const callApiAddAuthor = () => {
        if(objAuthor.tenTacGia === "" || objAuthor.butDanh === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/add-author`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "POST",
                    body: JSON.stringify({ ...objAuthor }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã thêm tác giả!");
                        callAPIGetAuthorList();
                        setOpenModalAuthor(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const callApiEditAuthor = () => {
        if(objAuthor.tenTacGia === "" || objAuthor.butDanh === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-author`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    body: JSON.stringify({ idTacGia: modeModalAuthor, ...objAuthor }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã cập nhật thông tin tác giả!");
                        callAPIGetAuthorList();
                        setOpenModalAuthor(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const handleAddAuthor = (evt) => {
        evt.preventDefault();
        setModeModalAuthor(null);
        setObjAuthor({ 
            tenTacGia: "",
            butDanh: "",
        });
        setOpenModalAuthor(true);
    }

    const handleEditAuthor = (evt, idTacGia) => {
        evt.preventDefault();
        setModeModalAuthor(idTacGia);
        fetch(
            `${API_MAIN_URL}/get-author/?${new URLSearchParams({ idTacGia })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const userInfo = data[0];
                    setObjAuthor({ 
                        tenTacGia: userInfo.TG_TenTacGia,
                        butDanh: userInfo.TG_ButDanh,
                    });
                    setOpenModalAuthor(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleRemoveAuthor = (evt, idTacGia) => {
        evt.preventDefault();
        if(window.confirm("Bạn chắn chắn xóa tác giả này?")){
            fetch(
                `${API_MAIN_URL}/delete-author`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "DELETE",
                    body: JSON.stringify({ idTacGia }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã xóa tác giả!");
                        callAPIGetAuthorList();
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    return (
        <React.Fragment>
            <div className="author-librarian-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-librarian'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={(e) => handleAddAuthor(e)}>
                    <PersonAddAlt1Icon /> <label className="lb-add-author"> Thêm Tác Giả </label>
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="author-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">idTacGia</th>
                                <th scope="col">Tên Tác Giả</th>
                                <th scope="col">Bút danh</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangTacGia.map((tacgia) => {
                                    return <tr key={`tr-sach-${tacgia.TG_ID}`}>
                                        <td className="hidden-data">{tacgia.TG_ID}</td>
                                        <td>{tacgia.TG_TenTacGia}</td>
                                        <td>{tacgia.TG_ButDanh}</td>
                                        <td className="col-control-data">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleEditAuthor(e, tacgia.TG_ID)}
                                                >
                                                <AppRegistrationIcon />
                                            </IconButton>
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleRemoveAuthor(e, tacgia.TG_ID)}
                                                >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {renderModalAuthor()}
            </div>
        </React.Fragment>
    );
}

export default AuthorsLibrarian;