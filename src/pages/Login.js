import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1628519592419-bf288f08cef5?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNwb3J0cyUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D'; // Replace with your actual image URL

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false); 

    function authenticate(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(typeof data.access !== "undefined") {

                localStorage.setItem('token', data.access);


                retrieveUserDetails(localStorage.getItem('token'));


                Swal.fire({
                    title: 'Login Successful',
                    icon: 'success',
                    text: 'Welcome to Zuitt!'
                })
            
            } else if (data.message == "No email found") {


                Swal.fire({
                    title: 'No email found',
                    icon: 'error',
                    text: 'Email does not exist.'
                })

            } else {

                Swal.fire({
                    title: 'Authentication faile',
                    icon: 'error',
                    text: 'Check your login etails and try again.'
                })
            }
        })

        setEmail('');
        setPassword('');
    };

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    useEffect(() => {

        if(email !== '' && password !== '') {

            setIsActive(true);

        } else {

            setIsActive(false);
        }

    }, [email, password]);

    return ( 
        user.id !== null ?
            <Navigate to="/" />
        :
        <div 
         className="p-4 border rounded shadow"
         style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', // Transparent white background
                  backdropFilter: 'blur(10px)' // Optional: Adds a blur effect to the background
               }}
                            >
            <Form onSubmit={(e) => authenticate(e)}>
                <h1 className="my-5 text-center">Login</h1>

                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                { 
                    isActive ? 
                        <Button variant="primary" type="submit" id="submitBtn" className="mt-3">Submit</Button>
                    : 
                        <Button variant="danger" type="submit" id="submitBtn" className="mt-3" disabled>Submit</Button>
                }
            </Form> 
        </div>      
    )
}
