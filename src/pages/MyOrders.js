import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import { Table, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(ordersData => {
        console.log('Fetched Orders:', ordersData);
        if (ordersData && ordersData.orders) {
          setOrders(ordersData.orders);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders data:', error);
        Swal.fire({
          title: 'Network Error',
          icon: 'error',
          text: 'Please check your network connection.',
        });
        setLoading(false);
      });
  };

  const fetchProductData = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
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
          text: 'Please check your network connection.',
        });
      });
  };

  const getProductDetails = productId => {
    return products.find(product => product._id === productId) || {};
  };

  useEffect(() => {
    fetchMyOrders();
    fetchProductData();
  }, []);

  const sortedOrders = orders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));

  return user.id === null ? (
    <Navigate to="/" />
  ) : (
    <>
      <h1>Your Orders</h1>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        sortedOrders.map(order => (
          <div key={order._id}>
            <h2>Order ID: {order._id}</h2>
            <h4>Ordered On: {new Date(order.orderedOn).toLocaleDateString()}</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th className="px-3">Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.productsOrdered.map(item => {
                  const product = getProductDetails(item.productId);
                  return (
                    <tr key={item._id}>
                      <td>{product.name || 'Loading...'}</td>
                      <td>{product.description || 'Loading...'}</td>
                      <td>&#8369; {product.price || 'Loading...'}</td>
                      <td>{item.quantity}</td>
                      <td>&#8369; {item.subtotal}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="4" className="text-right">
                    <strong>Total Price:</strong>
                  </td>
                  <td>&#8369; {order.totalPrice}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        ))
      )}
    </>
  );
};

export default Orders;
