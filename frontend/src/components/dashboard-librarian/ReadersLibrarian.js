import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
import { API_MAIN_URL } from "../../config/Constants";
import { formatTrangThaiMuon, formatDate } from "../../config/CommonFunctions";
import "./ReadersLibrarian.scss";

/**
 * ReadersLibrarian component
 * @param {ReadersLibrarian} props
 * @return {jsx}
 */
const ReadersLibrarian = (props) => {
    
    const [mangReaders, setMangReaders] = useState([]);
    const [openModalReaderTicket, setOpenModalReaderTicket] = useState(false);
    const [mangTicket, setMangTicket] = useState([]);

    // componentDidMout
    useEffect(() => {
        getAllReaders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(!openModalReaderTicket){
            setMangTicket([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalReaderTicket]);

    const getAllReaders = () => {
        fetch(
            `${API_MAIN_URL}/get-readers`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangReaders(data);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderModalListTicket = () => {
        return  <MDBModal id="modalTicket" open={openModalReaderTicket} tabIndex="-1" staticBackdrop={true}>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Danh Sách Mượn Sách</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <table className="table table-bordered border-primary">
                            <thead>
                                <tr className="table-primary">
                                    <th scope="col">Tên Sách</th>
                                    {/* <th scope="col">Tên Người Mượn</th> */}
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
                                            {/* <td>{ticket.Ten_Nguoi_Muon}</td> */}
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
                        <MDBBtn color='secondary' onClick={() => setOpenModalReaderTicket(false)}>
                            Đóng
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
      </MDBModal>
    }

    const handleWatchReaderTicket = (evt, idNguoiDung) => {
        evt.preventDefault();
        fetch(
            `${API_MAIN_URL}/get-ticker-by-user/?${new URLSearchParams({ idNguoiDung })}`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data){
                    setMangTicket(data);
                    setOpenModalReaderTicket(true);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }


    return (
        <React.Fragment>
            <div className="reader-librarian-container">
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
                <div className="reader-librarian-table">
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr className="table-primary">
                                <th scope="col" className="hidden-data">ND_ID</th>
                                <th scope="col">Họ Tên</th>
                                <th scope="col">Email</th>
                                <th scope="col">Địa Chỉ</th>
                                <th scope="col">Mượn Sách</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mangReaders.map((reader) => {
                                    return <tr key={`tr-fine-${reader.ND_ID}`}>
                                        <td className="hidden-data">{reader.ND_ID}</td>
                                        <td>{reader.ND_HoTen}</td>
                                        <td>{reader.ND_Email}</td>
                                        <td>{reader.ND_DiaChi}</td>
                                        <td className="col-control-data">
                                            <IconButton aria-label="fingerprint" color="primary"
                                                    onClick={(e) => handleWatchReaderTicket(e, reader.ND_ID)}
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
                {renderModalListTicket()}
            </div>
        </React.Fragment>
    );
}

export default ReadersLibrarian;