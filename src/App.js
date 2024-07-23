import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Error from './pages/Error';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import Register from './pages/Register';
import CartView from './pages/CartView';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
             if (typeof data.user !== "undefined") {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
            } else {
                setUser({
                    id: null
                });
            }
        });
    }, []);

    return (
        <Router>
            <UserProvider value={{ user, setUser, unsetUser }}>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Error />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:productId" exact="true" element={<ProductView />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cartView" element={<CartView />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/myOrders" element={<MyOrders />} />
                    </Routes>
                </Container>
            </UserProvider>
        </Router>
    );
}

export default App;
