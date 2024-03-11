import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { API_MAIN_URL } from "../../config/Constants";
import "./BooksReader.scss";

/**
 * BooksReader component
 * @param {DashboardReader} props
 * @return {jsx}
 */
const BooksReader = (props) => {
    
    const [mangSach, setMangSach] = useState([]);
    const [cdtSearch, setCdtSearch] = useState('');

    // componentDidMout
    useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                if(data.length > 0){
                    setMangSach(data);
                } else {
                    alert("Thông tin bạn tìm kiếm không có!");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });

    }

    return (
        <React.Fragment>
            <div className="book-reader-container">
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
                            width: "300px"
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
                </div>


                <div className="book-reader-table">
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
                                        <td>{sach.S_TrangThai === 'unavailable' ? 'Không khả dụng' : 'Khả dụng'}</td>
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

export default BooksReader;