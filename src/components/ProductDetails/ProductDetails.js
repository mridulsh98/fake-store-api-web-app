import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './ProductDetails.css'

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleAddToCart = () => {
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};

        // Update the cart data with the selected product and quantity
        const updatedCart = {
            ...existingCart,
            [id]: quantity,
        };

        // Store the updated cart data in sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('sessionStorageChange'));
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(() => {
        // Fetch product data from your API using the product ID
        // Replace the URL with the actual API endpoint
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error('Error fetching product details:', error));

        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {}
        if (id in existingCart) {
            setQuantity(existingCart[id])
        }
        //console.log('existingCart:', existingCart)
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const AddToCart = () => {
        return (
            <div className="add-to-cart-section">
                {quantity > 0 &&
                    <div className='quantity-selector'>
                        <Button variant="contained" className="quantity-button-new" onClick={() => setQuantity(Math.max(quantity - 1, 1))}>-</Button>
                        <span className='quantity-value'>{quantity}</span>
                        <Button variant="contained" className="quantity-button-new" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    </div>
                }
                <div>
                    <Button onClick={handleAddToCart} variant="contained" className="add-to-cart-button">
                        Add to Cart
                    </Button>
                </div>
            </div>

        )
    }

    return (
        <div className="product-detail-container">
            <div className="title-container">
                <h2>{product.title}</h2>
            </div>
            <div className="content-container">
                <div className="left-half">
                    <div className="product-image-container">
                        <img src={product.image} alt={product.title} className="product-image" />
                    </div>
                </div>
                <div className="right-half">
                    <p>
                        <div className='detail-header'>Price </div>
                        <div className='detail-content'>$ {product.price}</div>
                    </p>
                    <hr className="separator" />
                    <AddToCart />
                    <hr className="separator" />
                    <p>
                        <div className='detail-header'>Category </div>
                        <div className='detail-content'>{product.category}</div>
                    </p>
                    <hr className="separator" />
                    <p>
                        <div className='detail-header'>Description </div>
                        <div className='detail-content'>{product.description}</div>
                    </p>
                    <hr className="separator" />
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                className="snackbar-bottom-center"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success"
                    className='snackbar-alert'>
                    Product added to cart!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductDetail;