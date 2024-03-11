import React, { useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { API_MAIN_URL, HEADER_REQUEST_POST } from "../../config/Constants";
import "./SignInSignUp.scss";

const defaultTheme = createTheme();


/**
 * SignInSignUp component
 * @param {SignInSignUp} props
 * @return {jsx}
 */
const SignInSignUp = (props) => {

    const [openLoading, setOpenLoading] = useState(false); // 0: signin, 1: signup
    const [modeAuth, setModeAuth] = useState(0); // 0: signin, 1: signup
    const [taiKhoan, settaiKhoan] = useState('');
    const [matKhau, setmatKhau] = useState('');
    const [hoTen, sethoTen] = useState('');
    const [diaChi, setdiaChi] = useState('');
    const [soDienThoai, setsoDienThoai] = useState('');
    const [email, setEmail] = useState('');

    // componentDidMout
    useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        settaiKhoan('');
        setmatKhau('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modeAuth]);

    const Copyright = (props) => {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {`B2016955 Lê Nguyễn Bảo Đăng & B2016964 Đặng Thị Hiệp`}
                <br/>
                {`Nhóm 3 - Quản trị dữ liệu 2023`}
            </Typography>
        );
    }

    const handleSignIn = (evt) => {
        evt.preventDefault();
        setOpenLoading(true);
        fetch(
            `${API_MAIN_URL}/authenticate`,
            {
                ...HEADER_REQUEST_POST,
                body: JSON.stringify({ taiKhoan, matKhau }), 
            })
        .then((response)  => {
           response.json().then((data) => {
                if(data?.message){
                    fetch(
                        `${API_MAIN_URL}/get-user-info-by-account/?${new URLSearchParams({ taiKhoan })}`,
                        { method: "GET" }
                    )
                    .then((response)  => {
                       response.json().then((data) => {
                            if(data && data.length > 0){
                                localStorage.setItem("idNguoiDung", data[0].ND_ID);
                                localStorage.setItem("taiKhoan", data[0].ND_TaiKhoan);
                                localStorage.setItem("vaiTro", data[0].ND_VaiTro);
                                localStorage.setItem("tenNguoiDung", data[0].ND_HoTen);
                                if(data[0].ND_VaiTro === "reader"){
                                    window.location = '/dashboard-reader';
                                } else {
                                    window.location = '/dashboard-librarian';
                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                        }) 
                    });
                } else {
                    alert("Sai thông tin đăng nhập. Xin vui lòng kiểm tra lại.");
                    setOpenLoading(false);
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }
 
    const handleSignUp = (evt) => {
        evt.preventDefault();
        fetch(
            `${API_MAIN_URL}/add-reader`,
            {
                ...HEADER_REQUEST_POST,
                body: JSON.stringify({ taiKhoan, matKhau, hoTen, diaChi, soDienThoai, email }), 
            })
        .then((response)  => {
           response.json().then((data) => {
                // if dang ki thanh cong
                if(data?.success){
                    setModeAuth(0);
                } else {
                    alert("Đã xảy ra lỗi, đăng kí không thành công");
                }
            }).catch((err) => {
                console.log(err);
            }) 
        });
    }

    const renderSignIn = () => {
        return <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đăng nhập
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="taiKhoan"
                            label="Tài Khoản"
                            name="taiKhoan"
                            autoComplete="taiKhoan"
                            autoFocus
                            value={taiKhoan}
                            onChange={e => settaiKhoan(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="matKhau"
                            label="Mật Khẩu"
                            type="password"
                            id="matKhau"
                            autoComplete="current-matKhau"
                            value={matKhau}
                            onChange={e => setmatKhau(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={(e) => handleSignIn(e)}
                        >
                            Đăng Nhập
                        </Button>
                        <Grid container sx={{ textAlign: 'right' }}>
                            <Grid item xs={12}>
                                <Link href="#" variant="body2" onClick={() => setModeAuth(1)}>
                                    Không có tài khoản? Đăng kí
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    }

    const renderSignUp = () => {
        return <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đăng kí thông tin
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="taiKhoan"
                                    label="Tài Khoản"
                                    name="taiKhoan"
                                    autoComplete="Tài Khoản"
                                    value={taiKhoan}
                                    onChange={e => settaiKhoan(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="matKhau"
                                    label="Mật Khẩu"
                                    type="password"
                                    id="matKhau"
                                    autoComplete="new-matKhau"
                                    value={matKhau}
                                    onChange={e => setmatKhau(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="hoTen"
                                    label="Họ Tên"
                                    type="text"
                                    id="hoTen"
                                    autoComplete="Ho Ten"
                                    value={hoTen}
                                    onChange={e => sethoTen(e.target.value)}
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
                                    value={diaChi}
                                    onChange={e => setdiaChi(e.target.value)}
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
                                    value={soDienThoai}
                                    onChange={e => setsoDienThoai(e.target.value)}
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
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={(e) => handleSignUp(e)}
                        >
                            Đăng kí
                        </Button>
                        <Grid container justifyContent="flex-end" 
                            sx={{
                                marginTop: 1
                            }}
                        >
                            <Grid item>
                                <Link href="#" variant="body2" onClick={() => setModeAuth(0)}>
                                    Bạn có tài khoản? Đăng nhập
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    }

    const renderBackdrop = () => {
        return <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoading}
            onClick={() => setOpenLoading(false)}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    }

    return (
        <React.Fragment>
            {modeAuth === 0 ? renderSignIn() : renderSignUp()}
            {renderBackdrop()}
        </React.Fragment>
    );
};

export default SignInSignUp;
