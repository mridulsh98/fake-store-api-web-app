import React, { useEffect, useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './Cart.css'
import Button from '@mui/material/Button';

const Cart = () => {
    const [cartDetails, setCartDetails] = useState([]);

    useEffect(() => {
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};

        const fetchProductDetails = async () => {
            const details = await Promise.all(
                Object.keys(existingCart).map(async (productId) => {
                    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
                    const productData = await response.json();
                    return { productId, quantity: existingCart[productId], productData };
                })
            );

            setCartDetails(details);
        };

        fetchProductDetails();
    }, []);

    const handleDeleteFromCart = (productId) => {
        const updatedCart = cartDetails.filter(item => item.productId != productId);
        // Update the cart state
        setCartDetails(updatedCart);

        // Update the session storage
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};
        delete existingCart[productId];
        sessionStorage.setItem('cart', JSON.stringify(existingCart));

        window.dispatchEvent(new Event('sessionStorageChange'));
    }

    const handleQuantityChange = (productId, newQuantity) => {

        if (newQuantity === 0) {
            handleDeleteFromCart(productId)
            return
        }
        // Update the cart details state
        const updatedCartDetails = cartDetails.map(item => {
            if (item.productId == productId) {
                return {
                    ...item,
                    quantity: newQuantity
                };
            }
            return item;
        });

        // Update the cart state
        setCartDetails(updatedCartDetails);

        // Update the session storage
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || {};
        existingCart[productId] = newQuantity;
        sessionStorage.setItem('cart', JSON.stringify(existingCart));

        // Trigger event for components listening to session storage changes
        window.dispatchEvent(new Event('sessionStorageChange'));
    };

    // Calculate total price
    const totalPrice = cartDetails.length > 0 ? cartDetails.reduce((total, { quantity, productData }) => {
        return total + quantity * productData.price;
    }, 0) : 0;

    return (
        <div className="cart-container">
            <div className="cart-details">
                <h1>Cart Details</h1>
                {cartDetails.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        {cartDetails.map(({ productId, quantity, productData }) => (
                            <div key={productId} className="cart-item">
                                <img
                                    src={productData.image}
                                    alt={productData.title}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-details">
                                    <h3>{productData.title}</h3>
                                    <p>
                                        Quantity: {quantity} | Price: $ {productData.price}
                                    </p>
                                    <div className="quantity-selector">
                                        <label>Quantity:</label>
                                        <div className="quantity-controls">
                                            <Button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        productData.id,
                                                        Math.max((quantity || 0) - 1, 0)
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
                                                value={quantity || 0}
                                                onChange={(e) =>
                                                    handleQuantityChange(productData.id, parseInt(e.target.value, 10))
                                                }
                                            />
                                            <Button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        productData.id,
                                                        (quantity || 0) + 1
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
                                </div>
                                <IconButton
                                    onClick={() => handleDeleteFromCart(productId)}
                                    className="delete-button"
                                >
                                    <DeleteIcon style={{ color: '#1976d2' }} />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="cart-divider"></div>
            <div className="cart-total">
                <h2>Total Price</h2>
                <p>${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default Cart;

