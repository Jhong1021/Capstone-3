import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import AddProduct from './AddProduct';

export default function AdminView({fetchData}) {

const [fetchProducts, setFetchProducts] = useState([]);
const [products, setProducts] = useState([]);
const [showModal, setShowModal] = useState(false);




    useEffect(() => {

        fetch('http://localhost:4004/b4/products/all', {
            headers : { 
                Authorization : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            setFetchProducts(data.products)
            const productsArr = fetchProducts.map(product => {
                return (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td className={product.isActive ? "text-success" : "text-danger"}>
                                {product.isActive ? "Available" : "Unavailable"}
                            </td>
                            <td><EditProduct product={product._id} fetchData={fetchData} /></td>
                            <td><ArchiveProduct product={product._id} isActive={product.isActive} fetchData={fetchData} /></td>    
                        </tr>
                    )
            })
            setProducts(productsArr)
        })

    }, [fetchProducts]);



    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    return(
        <>
        <Container className="text-center">
            <h1 className="text-center my-4"> Admin Dashboard</h1>
            <Button variant="primary" onClick={handleModalOpen} className="m-2">Add New Product</Button>
            <Button variant="success" className="m-2">Show User Orders</Button>
            <Table striped bordered hover responsive variant="dark">
                <thead>
                    <tr className="text-center">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>
            <AddProduct showModal={showModal} handleClose={handleModalClose} />
        </Container>  
        </>
    )
}