import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate, Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function ProductView() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1); // Add quantity state

    const addCart = (productId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                subtotal: price * quantity // Calculate subtotal
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error === 'Admin is forbidden') {
                Swal.fire({
                    title: 'Admin add cart is forbidden',
                    icon: 'error',
                    text: 'You are an administrator; you may not add a cart'
                });
            } else if(data.message === 'Item added to cart successfully') {
                Swal.fire({
                    title: 'Successfully added to cart',
                    icon: 'success',
                    text: 'You have successfully added a product to the cart'
                });
                navigate("/products");
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please try again.'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Network Error',
                icon: 'error',
                text: 'Please check your network connection.'
            });
        });
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                icon: 'error',
                text: 'Error fetching product data'
            });
        });
    }, [productId]);

  return (
<>

    <Container className="mt-5">
      <Row className="justify-content-center" noGutters>
        <Col md={8} className="d-flex align-items-center">
                <Card.Img src='https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/r6_right_hand-side.jpg' alt={name} className="img-fluid" />
              </Col>
        <Col md={4} >
                <Card.Body className="mt-5">
                  <Card.Title><h1><strong>{name}</strong></h1></Card.Title>
                  <Card.Text><p>Description: {description}</p></Card.Text>
                  <Card.Text><h4><strong>Price:</strong> Php {price}</h4></Card.Text>
                  <Form.Group>
                    <Form.Label><b>Quantity:</b></Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="text-center"
                      required
                    />
                  </Form.Group>
                  {user.id !== null ? (
                    <Button variant="primary" block onClick={() => addCart(productId)} className="mt-2">
                      Add to Cart
                    </Button>
                  ) : (
                    <Link className="btn btn-danger btn-block mt-2" to="/login" >
                      Login to Add to Cart
                    </Link>
                  )}
                </Card.Body>
              </Col>
      </Row>
    </Container>

</>
  );
}
