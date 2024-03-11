import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import NearbyErrorIcon from '@mui/icons-material/NearbyError';
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
import { 
    formatSoTienPhat, 
    formatTrangThaiPhat, 
    formatTrangThaiMuon, 
    formatDate, 
} from "../../config/CommonFunctions";

import "./TicketsReader.scss";

/**
 * TicketsReader component
 * @param {TicketsReader} props
 * @return {jsx}
 */
const TicketsReader = (props) => {
    
    const [mangTicket, setMangTicket] = useState([]);
    const [dataModalFine, setDataModalFine] = useState([]);
    const [openModalFine, setOpenModalFine] = useState(false);
    
    // componentDidMout
    useEffect(() => {
        fetch(
            `${API_MAIN_URL}/get-tickets`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0) {
                    const idNguoiDung = localStorage.getItem("idNguoiDung");
                    const arrData = data.filter((ticket) => ticket.MS_IDNguoiDung === +idNguoiDung);
                    setMangTicket(arrData);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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

    return (
        <React.Fragment>
            <div className="ticket-reader-container">
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.location = 'dashboard-reader'}}>
                    Trở về
                </Button>
                <Button size="medium" variant="contained" 
                    sx={{ marginLeft: 5, marginTop: 2  }} 
                    onClick={() => {window.print();}}>
                    In thông tin
                </Button>
                <div className="ticket-reader-table">
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
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {renderModalFines()}
            </div>
        </React.Fragment>
    );
}

export default TicketsReader;