import React, {useCallback, useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Menu } from '@mui/icons-material';
import {TodolistList} from "../features/TodolistList/TodolistList";
import LinearProgress from '@mui/material/LinearProgress';
import {AppRootStateType, useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {initializeAppTC} from "./app-reducer";
import {useDispatch} from "react-redux";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "../features/Login/auth-reducer";


function App() {
    const status = useAppSelector( state => state.app.status)
    const isInitialized = useAppSelector( state => state.app.isInitialized)
    const isLoggedIn = useAppSelector( state => state.auth.isLoggedIn);
    const dispatch = useDispatch<any>()

    useEffect(()=>{
        dispatch(initializeAppTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logoutHandler = ()=>{
        dispatch(logoutTC())
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress color="secondary" />}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistList/>} />
                    <Route path='/login' element={<Login/>} />
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
