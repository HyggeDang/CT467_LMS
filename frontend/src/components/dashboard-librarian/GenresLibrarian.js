import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
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
import "./GenresLibrarian.scss";

/**
 * GenresLibrarian component
 * @param {GenresLibrarian} props
 * @return {jsx}
 */
const GenresLibrarian = (props) => {
    
    const [mangTheLoai, setMangTheLoai] = useState([]);
    const [openModalGenre, setOpenModalGenre] = useState(false);
    const [idGenreSelected, setIdGenreSelected] = useState(null); // neu khac null thi luu id tac gia update, neu null la dang ky moi
    const [objGenre, setObjGenre] = useState({
        tenTheLoai: "",
        moTa: "",
    });

    // componentDidMout
    useEffect(() => {
        callAPIGetGenreList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalGenre){
            setIdGenreSelected(null);
            setObjGenre({
                tenTheLoai: "",
                moTa: "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalGenre]);

    const callAPIGetGenreList = () => {
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

    const renderModalGenres = () => {
        return  <MDBModal id="modal-genres" open={openModalGenre} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        {
                            idGenreSelected
                            ? <MDBModalTitle>Cập nhật thể loại</MDBModalTitle>
                            : <MDBModalTitle>Thêm mới thể loại</MDBModalTitle>
                        }
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="tenTheLoai"
                                    label="Tên Thể Loại Sách"
                                    type="text"
                                    id="tenTheLoai"
                                    autoComplete="tenTheLoai"
                                    value={objGenre.tenTheLoai}
                                    onChange={e => setObjGenre({ ...objGenre, tenTheLoai: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    multiline
                                    required
                                    name="moTa"
                                    label="Mô Tả Thể Loại"
                                    type="text"
                                    id="moTa"
                                    autoComplete="moTa"
                                    value={objGenre.moTa}
                                    onChange={e => setObjGenre({ ...objGenre, moTa: e.target.value } )}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalGenre(false)}>
                            Đóng
                        </MDBBtn>
                        {
                            idGenreSelected
                            ? <MDBBtn id="btn-update-genres" onClick={(evt) => callApiEditGenre(evt)}>Cập nhật</MDBBtn>
                            : <MDBBtn id="btn-add-genres" onClick={(evt) => callApiAddGenre(evt)}>Thêm Mới</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const callApiAddGenre = () => {
        if(objGenre.tenTheLoai === "" || objGenre.moTa === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/add-genre`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "POST",
                    body: JSON.stringify({ ...objGenre }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if them thanh cong
                    if(data?.success){
                        alert("Đã thêm thể loại");
                        callAPIGetGenreList();
                        setOpenModalGenre(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const callApiEditGenre = () => {
        if(objGenre.tenTheLoai === "" || objGenre.moTa === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-genre`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    body: JSON.stringify({ idTheLoaiSach: idGenreSelected, ...objGenre }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã cập nhật thông tin thể loại!");
                        callAPIGetGenreList();
                        setOpenModalGenre(false);
                    } else {
                        alert("Đã xảy ra lỗi, không thành công");
                    }
                }).catch((err) => {
                    console.log(err);
                }) 
            });
        }
    }

    const handleAddGenre = (evt) => {
        evt.preventDefault();
        setOpenModalGenre(null);
        setObjGenre({ 
            tenTheLoai: "",
            moTa: "",
        });
        setOpenModalGenre(true);
    }

    const handleEditGenres = (evt, idTheLoaiSach) => {
        evt.preventDefault();
        setIdGenreSelected(idTheLoaiSach);
        fetch(
            `${API_MAIN_URL}/get-genre/?${new URLSearchParams({ idTheLoaiSach })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const genreInfo = data[0];
                    setObjGenre({ 
                        tenTheLoai: genreInfo.TLS_TenTheLoai,
                        moTa: genreInfo.TLS_MoTa,
                    });
                    setOpenModalGenre(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleRemoveGenres = (evt, idTheLoaiSach) => {
        evt.preventDefault();
        if(window.confirm("Bạn chắn chắn xóa thể loại này?")){
            fetch(
                `${API_MAIN_URL}/delete-genre`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "DELETE",
                    body: JSON.stringify({ idTheLoaiSach }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã xóa thể loại!");
                        callAPIGetGenreList();
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
            <div className="genres-librarian-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-librarian'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={(e) => handleAddGenre(e)}
                >
                    <BookmarkAddIcon /> <label className="lb-add-genres"> Thêm Thể Loại </label>
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="genres-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">idTheLoaiSach</th>
                                <th scope="col">Tên Thể loại Sách</th>
                                <th scope="col">Mô Tả</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangTheLoai.map((theloai) => {
                                    return <tr key={`tr-theloai-${theloai.TLS_ID}`}>
                                        <td className="hidden-data">{theloai.TLS_ID}</td>
                                        <td>{theloai.TLS_TenTheLoai}</td>
                                        <td>{theloai.TLS_MoTa}</td>
                                        <td className="col-control-data">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleEditGenres(e, theloai.TLS_ID)}
                                                >
                                                <AppRegistrationIcon />
                                            </IconButton>
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleRemoveGenres(e, theloai.TLS_ID)}
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
                {renderModalGenres()}
            </div>
        </React.Fragment>
    );
}

export default GenresLibrarian;