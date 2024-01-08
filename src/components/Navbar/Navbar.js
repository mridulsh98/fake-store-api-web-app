import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.css'


const Navbar = () => {

    const [count, setCount] = useState(0)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        const handleStorageChange = () => {
            const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};
            const cartLen = Object.keys(existingCart).length;
            setCount(cartLen);
        };
        handleStorageChange()
        window.addEventListener('sessionStorageChange', handleStorageChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('sessionStorageChange', handleStorageChange);
        };
    }, [])

    useEffect(() => {
        const existingToken = (sessionStorage.getItem('token')) || null;

        if (existingToken !== null) {
            setIsVerified(true)
        }
    }, [])

    const LoginNavbar = () => {
        return (
            <AppBar position="static">
                <Toolbar className="toolbar">
                    <div className='login-toolbar'>
                        <Avatar
                            alt="My Shop Logo"
                            src={require('../../person.svg').default}
                            style={{ marginRight: 10 }}
                        />
                        <Typography className='typography' >
                            Login
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }

    const AppNavbar = () => {
        return (
            <AppBar position="static">
                <Toolbar className="toolbar">
                    <Link to={"/dashboard"} className="product-dashboard-link">
                        <Avatar
                            alt="My Shop Logo"
                            src={require('../../storefront.svg').default}
                            style={{ marginRight: 10 }}
                        />
                        <Typography className='typography' >
                            My Shop
                        </Typography>
                    </Link>

                    <Link to={"/cart"} className="product-dashboard-link">
                        <Avatar
                            alt="My Shop Logo"
                            src={require('../../shopping_cart.svg').default}
                            style={{ marginRight: 10 }}
                        />
                        <div style={{ marginLeft: 'auto' }}>
                            <Typography className='typography'>
                                Cart {count === 0 ? null : `(${count})`}
                            </Typography>
                        </div>
                    </Link>
                </Toolbar>
            </AppBar>
        )
    }
    return (
        isVerified ? <AppNavbar /> : <LoginNavbar />
    );
};

export default Navbar;