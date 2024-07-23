import React, { useState, useEffect, useContext } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import Image from 'react-bootstrap/Image';
import { useNavigate, Navigate } from 'react-router-dom';

export default function UserCartView() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCartData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(cartData => {
            console.log('Fetched cart data:', cartData);
            if (cartData && cartData.cart.length > 0) {
                setCart(cartData.cart[0]);
            } else {
                setCart({ cartItems: [], totalPrice: 0 });
            }
        })
        .catch(error => {
        });
    };

    const fetchProductData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(productData => {
            console.log('Fetched product data:', productData);
            if (productData && productData.products) {
                setProducts(productData.products);
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            Swal.fire({
                title: 'Network Error',
                icon: 'error',
                text: 'Please check your network connection.'
            });
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        // Ensure quantity does not go below 1
        if (newQuantity < 1) {
            return; // Prevent further action if quantity is less than 1
        }

        // Update the quantity locally
        const updatedCartItems = cart.cartItems.map(item => {
            if (item.productId === productId) {
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: getProductDetails(productId).price * newQuantity
                };
            }
            return item;
        });

        // Update cart in backend via API
        updateCartQuantity(productId, newQuantity);
    };

    const updateCartQuantity = (productId, newQuantity) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: newQuantity
            })
        })
        .then(res => res.json())
        .then(updatedCart => {
            console.log('Updated cart:', updatedCart);

            // Check if updatedCart has the expected structure
            if (updatedCart && updatedCart.updatedCart && updatedCart.updatedCart.cartItems) {
                setCart(updatedCart.updatedCart); // Update cart state
            } else {
                console.error('Invalid cart structure received:', updatedCart);
                // Handle unexpected response from API
                Swal.fire({
                    title: 'Update Error',
                    icon: 'error',
                    text: 'Failed to update cart quantity. Please try again.'
                });
            }
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            Swal.fire({
                title: 'Update Error',
                icon: 'error',
                text: 'Failed to update cart quantity. Please try again.'
            });
        });
    };

    const handleRemoveFromCart = (productId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: 'PATCH', // Use PATCH method for removing item
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(removedItem => {
            console.log('Removed item:', removedItem);

            // Update the cart state after removing the item
            if (removedItem.updatedCart) {
                setCart(removedItem.updatedCart); // Update cart state
                Swal.fire({
                    title: 'Item Removed',
                    icon: 'success',
                    text: 'Item removed from cart successfully.'
                });
            } else {
                Swal.fire({
                    title: 'Remove Error',
                    icon: 'error',
                    text: 'Failed to remove item from cart. Please try again.'
                });
            }
        })
        .catch(error => {
            console.error('Error removing item from cart:', error);
            Swal.fire({
                title: 'Remove Error',
                icon: 'error',
                text: 'Failed to remove item from cart. Please try again.'
            });
        });
    };

    const handleClearCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
            method: 'PUT', // Use PUT method for clearing the cart
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to clear cart');
            }
        })
        .then(clearedCart => {
            console.log('Cleared cart:', clearedCart);
            if (clearedCart && clearedCart.cart) {
                setCart(clearedCart.cart); // Update cart state
                Swal.fire({
                    title: 'Cart Cleared',
                    icon: 'success',
                    text: 'Cart cleared successfully.'
                });
            } else {
                throw new Error('Invalid response received');
            }
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            Swal.fire({
                title: 'Clear Cart Error',
                icon: 'error',
                text: 'Failed to clear cart. Please try again.'
            });
        });
    };

    const getProductDetails = (productId) => {
        return products.find(product => product._id === productId) || {};
    };

    useEffect(() => {
        fetchCartData();
        fetchProductData();
    }, []);

    useEffect(() => {
        if (cart.cartItems.length > 0 && products.length > 0) {
            setLoading(false);
        }
    }, [cart, products]);


    const checkoutCart = () => {
        Swal.fire({
            title: 'You are about to checkout all items in the cart',
            text: "Are you sure you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        })
        .then((result) => {
            if(result.isConfirmed){
                fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if(data.message === 'Ordered Successfully'){
                        Swal.fire({
                            title: 'Ordered Successfuly',
                            icon: 'success'
                        })
                        .then((result) => {
                            navigate('/myOrders');
                        })
                    }
                })
            }
        })
    }

    return (
         user.id === null ?
            <Navigate to="/" />
        :
        <>
            <h1>Your Shopping Cart</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th className="px-3">Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center">No Existing Data.</td>
                        </tr>
                    ) : (
                        cart.cartItems.length > 0 ? (
                            cart.cartItems.map(item => {
                                const product = getProductDetails(item.productId);
                                return (
                                    <tr key={item._id}>
                                        <td><Image src="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/r6_right_hand-side.jpg" thumbnail /></td>
                                        <td>{product.name || 'Loading...'}</td>
                                        <td>{product.description || 'Loading...'}</td>
                                        <td>&#8369; {product.price || 'Loading...'}</td>
                                        <td>
                                            <InputGroup>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </Button>
                                                <FormControl
                                                    aria-label="Quantity"
                                                    aria-describedby="basic-addon2"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </Button>
                                            </InputGroup>
                                        </td>
                                        <td>&#8369; {item.subtotal}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleRemoveFromCart(item.productId)}>Remove</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No items in cart.</td>
                            </tr>
                        )
                    )}
                    <tr>
                    	<td  colSpan="4"><Button variant="success" onClick={() => checkoutCart()}>Checkout</Button></td>
                        <td colSpan="" className="text-right"><h2>Total: &#8369; {cart.totalPrice}</h2></td>
                        <td>
                            <Button variant="danger" onClick={handleClearCart}>Clear Cart</Button>
                        </td>
                        
                    </tr>
                </tbody>
            </Table>
        </>
    );
}
