import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from '@mui/material/TextField';
import moment from 'moment';
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
import { formatDate } from "../../config/CommonFunctions";
import "./PublisherLibrarian.scss";

/**
 * PublisherLibrarian component
 * @param {PublisherLibrarian} props
 * @return {jsx}
 */
const PublisherLibrarian = (props) => {
    
    const FORMAT_DATE = "DD/MM/YYYY";
    const [mangNXB, setMangNXB] = useState([]);
    const [openModalPublisher, setOpenModalPublisher] = useState(false);
    const [idPublisherSelected, setIdPublisherSelected] = useState(null); // luu id update, neu null la dang ky moi
    const [objPushlisher, setObjPushlisher] = useState({
        tenNXB: "",
        namThanhLap: "",
    });

    // componentDidMout
    useEffect(() => {
        callAPIGetPublisherList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalPublisher){
            setIdPublisherSelected(null);
            setObjPushlisher({
                tenNXB: "",
                namThanhLap: "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalPublisher]);

    const callAPIGetPublisherList = () => {
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

    const renderModalPublisher = () => {
        return  <MDBModal id="modal-publisher" open={openModalPublisher} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        {
                            idPublisherSelected
                            ? <MDBModalTitle>Cập nhật thông tin nhà xuất bản</MDBModalTitle>
                            : <MDBModalTitle>Thêm mới nhà xuất bản</MDBModalTitle>
                        }
                    </MDBModalHeader>
                    <MDBModalBody>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="tenNXB"
                                    label="Tên Nhà Xuất Bản"
                                    type="text"
                                    id="tenNXB"
                                    autoComplete="tenNXB"
                                    value={objPushlisher.tenNXB}
                                    onChange={e => setObjPushlisher({ ...objPushlisher, tenNXB: e.target.value } )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    name="namThanhLap"
                                    type="text"
                                    id="namThanhLap"
                                    label="Thời gian thành lập"
                                    autoComplete="namThanhLap"
                                    value={objPushlisher.namThanhLap !== "" ? formatDate(objPushlisher.namThanhLap, "DD/MM/YYYY") : moment().format("DD/MM/YYYY")}
                                />
                                <input
                                    type="date" 
                                    id="namThanhLapPicker" 
                                    name="namThanhLapPicker" 
                                    value={objPushlisher.namThanhLap !== "" ? formatDate(objPushlisher.namThanhLap, "YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                    onChange={e => setObjPushlisher({ ...objPushlisher, namThanhLap: e.target.value } )}
                                />
                            </Grid>
                        </Grid>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => setOpenModalPublisher(false)}>
                            Đóng
                        </MDBBtn>
                        {
                            idPublisherSelected
                            ? <MDBBtn id="btn-update-publisher" onClick={(evt) => callApiEditGenre(evt)}>Cập nhật</MDBBtn>
                            : <MDBBtn id="btn-add-publisher" onClick={(evt) => callApiAddGenre(evt)}>Thêm Mới</MDBBtn>
                        }
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const callApiAddGenre = () => {
        if(objPushlisher.tenNXB === "" || objPushlisher.namThanhLap === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/add-publisher`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "POST",
                    body: JSON.stringify({ 
                        tenNXB: objPushlisher.tenNXB, 
                        namThanhLap: objPushlisher.namThanhLap
                    }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if them thanh cong
                    if(data?.success){
                        alert("Đã thêm nhà xuất bản");
                        callAPIGetPublisherList();
                        setOpenModalPublisher(false);
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
        if(objPushlisher.tenNXB === "" || objPushlisher.namThanhLap === ""){
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            fetch(
                `${API_MAIN_URL}/edit-publisher`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "PUT",
                    body: JSON.stringify({ idNXB: idPublisherSelected, ...objPushlisher }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã cập nhật thông tin nhà xuất bản!");
                        callAPIGetPublisherList();
                        setOpenModalPublisher(false);
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
        setIdPublisherSelected(null);
        setObjPushlisher({ 
            tenNXB: "",
            namThanhLap: moment().format("YYYY-MM-DD"),
        });
        setOpenModalPublisher(true);
    }

    const handleEditGenres = (evt, idNhaXuatBan) => {
        evt.preventDefault();
        setIdPublisherSelected(idNhaXuatBan);
        fetch(
            `${API_MAIN_URL}/get-publisher/?${new URLSearchParams({ idNhaXuatBan })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0){
                    const publisherInfo = data[0];
                    setObjPushlisher({ 
                        tenNXB: publisherInfo.NXB_TenNXB,
                        namThanhLap: publisherInfo.NXB_NamThanhLap,
                    });
                    setOpenModalPublisher(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const handleRemovePublisher = (evt, idNXB) => {
        evt.preventDefault();
        if(window.confirm("Bạn chắn chắn xóa nhà xuất bản này?")){
            fetch(
                `${API_MAIN_URL}/delete-publisher`,
                {
                    ...HEADER_REQUEST_POST,
                    method: "DELETE",
                    body: JSON.stringify({ idNXB }), 
                })
            .then((response)  => {
               response.json().then((data) => {
                    // if xoa thanh cong
                    if(data?.success){
                        alert("Đã xóa nhà xuất bản!");
                        callAPIGetPublisherList();
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
            <div className="publisher-librarian-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-librarian'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={(e) => handleAddGenre(e)}
                >
                    <AddBusinessIcon /> <label className="lb-add-publisher"> Thêm Nhà Xuất Bản </label>
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="publisher-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">idNXB</th>
                                <th scope="col">Tên Nhà Xuất Bản</th>
                                <th scope="col">Thời gian thành lập</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangNXB.map((nxb) => {
                                    return <tr key={`tr-theloai-${nxb.NXB_ID}`}>
                                        <td className="hidden-data">{nxb.NXB_ID}</td>
                                        <td>{nxb.NXB_TenNXB}</td>
                                        <td>{formatDate(nxb.NXB_NamThanhLap, FORMAT_DATE)}</td>
                                        <td className="col-control-data">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                onClick={(e) => handleEditGenres(e, nxb.NXB_ID)}
                                            >
                                                <AppRegistrationIcon />
                                            </IconButton>
                                            <IconButton aria-label="fingerprint" color="primary"
                                                onClick={(e) => handleRemovePublisher(e, nxb.NXB_ID)}
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
                {renderModalPublisher()}
            </div>
        </React.Fragment>
    );
}

export default PublisherLibrarian;