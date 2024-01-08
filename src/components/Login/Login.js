import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './Login.css'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (response.ok) {
                // Successful login logic (redirect, state update, etc.)
                const data = await response.json();

                // Extract the token from the response
                const token = data.token;

                // Store the token in session storage
                sessionStorage.setItem('token', token);

                window.dispatchEvent(new Event('sessionStorageChange'));

                // Successful login logic (redirect, state update, etc.)
                navigate('/dashboard')
                console.log('Login successful');
            } else {
                // Handle login failure
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Enter User Credentials</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <div className='login-button-wrapper'>
                    <Button className='login-button' type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
