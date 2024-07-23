import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  const { name, description, price, imageUrl, _id } = productProp;

  return (
    <Col sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Card.Img variant="top" src='https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/r6_right_hand-side.jpg' alt={name} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text className="mb-2">{description}</Card.Text>
          <Card.Text className="font-weight-bold mb-3">
            ${price.toFixed(2)}
          </Card.Text>
          <Link to={`/products/${_id}`} className="btn btn-primary">
            Details
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}