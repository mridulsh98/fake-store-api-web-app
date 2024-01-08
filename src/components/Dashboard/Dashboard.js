import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import StarIcon from '@mui/icons-material/Star';
import Tooltip from '@mui/material/Tooltip';

import './Dashboard.css'

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleDeleteFromCart = (productId) => {
        // Update the session storage
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};
        delete existingCart[productId];
        sessionStorage.setItem('cart', JSON.stringify(existingCart));

        let newCart = { ...cart }
        delete newCart[productId];
        setCart(newCart);

        window.dispatchEvent(new Event('sessionStorageChange'));
    }

    const handleAddToCart = (productId, quantity) => {
        // Update the cart state with the selected product and quantity
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};

        const updatedCart = {
            ...existingCart,
            [productId]: quantity,
        };

        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('sessionStorageChange'));

        setCart(updatedCart);
        setOpenSnackbar(true);
    };


    const handleQuantityChange = (productId, newQuantity) => {

        if (newQuantity == 0) {
            handleDeleteFromCart(productId)
            return
        }
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: newQuantity,
        }));
    };

    useEffect(() => {

        fetch('https://fakestoreapi.com/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching data:', error));

        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {}
        setCart({ ...existingCart })


    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const AddToCart = ({ product }) => {
        return (
            <div className='add-to-cart-wrapper'>
                {product.id in cart && (
                    <div className="quantity-selector">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                            <Button
                                onClick={() =>
                                    handleQuantityChange(
                                        product.id,
                                        Math.max((cart[product.id] || 0) - 1, 0)
                                    )
                                }
                                variant="contained"
                                className='quantity-button'
                            >
                                -
                            </Button>
                            <input
                                type="number"
                                min="1"
                                value={cart[product.id] || 0}
                                onChange={(e) =>
                                    handleQuantityChange(product.id, parseInt(e.target.value, 10))
                                }
                            />
                            <Button
                                onClick={() =>
                                    handleQuantityChange(
                                        product.id,
                                        (cart[product.id] || 0) + 1
                                    )
                                }
                                variant="contained"
                                size="small"
                                className="quantity-button"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                )}
                <Button
                    onClick={() => handleAddToCart(product.id, cart[product.id] || 1)}
                    className="add-to-cart-btn"
                >
                    {product.id in cart ? ('Update Cart') : ('Add to Cart')}
                </Button>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <h1>Products Dashboard</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div>
                            <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
                                <div className='product-content'>
                                    <img src={product.image} alt={product.title} className='product-image' />
                                </div>
                            </Link>
                        </div>
                        <div>
                            <div className='rating-overlay'>
                                <div style={{ color: '#ffd900', marginRight: '5px' }}>
                                    <StarIcon fontSize="small" />
                                </div>
                                <div style={{ fontWeight: 'bold' }}> {product.rating.rate} </div>
                            </div>
                            <Tooltip title={product.title} arrow>
                                <div className="truncate-hover-text">{product.title}</div>
                            </Tooltip>
                            <p> $ {product.price}</p>
                            <AddToCart product={product} />
                        </div>
                    </div>
                ))}
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                className="snackbar-bottom-center"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success"
                    className='snackbar-alert'

                >
                    Product added to cart!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Dashboard;