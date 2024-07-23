import { useState, useEffect, useContext } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function AddProductModal({ showModal, handleClose }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function addProduct(e) {
        e.preventDefault();
        let token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price
            })
        })
        .then(res => res.json())
        .then(data => {
            console.table(data);

            if(data.error === 'Product already exists') {
                Swal.fire({
                    title: 'Product already exists',
                    icon: 'error'
                });
            } else if(data.message === 'Failed to save the product') {
                Swal.fire({
                    title: 'Unsuccessful to save the product',
                    icon: 'error',
                    text: 'Try again'
                });
            } else if(data !== null) {
                Swal.fire({
                    title: 'Product Added',
                    icon: 'success'
                }).then(() => {
                    // Close the modal upon successful addition
                    handleClose();
                    navigate("/products");
                });
            } else {
                Swal.fire({
                    title: 'Unsuccessful product creation',
                    icon: 'error'
                });
            }
        })
        .catch(error => {
            console.error('Error adding product:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to add product. Please try again later.',
                icon: 'error'
            });
        })
        .finally(() => {
            setName("");
            setDescription("");
            setPrice("");
        });
    }

    useEffect(() => {
        setIsActive(name !== "" && description !== "" && price !== "");
    }, [name, description, price]);

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => addProduct(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" placeholder="Enter Price" value={price} onChange={e => setPrice(e.target.value)} required />
                    </Form.Group>

                    {
                        isActive ?
                            <Button variant="primary" type="submit" className="my-3">Submit</Button>
                            :
                            <Button variant="danger" type="submit" className="my-3" disabled>Submit</Button>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    );
}
