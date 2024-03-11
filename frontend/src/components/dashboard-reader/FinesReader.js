import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { API_MAIN_URL } from "../../config/Constants";
import { 
    formatSoTienPhat, 
    formatTrangThaiPhat, 
    formatTrangThaiMuon, 
    formatDate, 
} from "../../config/CommonFunctions";
import "./FinesReader.scss";

/**
 * FinesReader component
 * @param {FinesReader} props
 * @return {jsx}
 */
const FinesReader = (props) => {
    
    const [mangKhoanPhat, setMangKhoanPhat] = useState([]);

    // componentDidMout
    useEffect(() => {
        fetch(
            `${API_MAIN_URL}/get-fines`,
            { method: "GET" }
        )
        .then((response)  => {
           response.json().then((data) => {
                if(data && data.length > 0) {
                    const idNguoiDung = localStorage.getItem("idNguoiDung");
                    const arrData = data.filter((ticket) => ticket.ND_ID === +idNguoiDung);
                    setMangKhoanPhat(arrData);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div className="fines-reader-container">
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
                <div className="fines-reader-table">
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
                            </tr>
                        </thead>
                        <tbody>

                            {
                                mangKhoanPhat.map((fine) => {
                                    return <tr key={`tr-fines-${fine.MS_ID}`}>
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
                </div>
            </div>
        </React.Fragment>
    );
}

export default FinesReader;