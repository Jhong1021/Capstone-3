import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
  const { breakPoint, data } = props;
  const { _id, name, description, price, imageUrl } = data;

  return (
    <Col xs={12} md={breakPoint} className="m-3 ">
      <Card className="h-100 shadow-sm">
        <Card.Img variant="top" src='https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/r6_right_hand-side.jpg' alt={name} />
        <Card.Body>
          <Card.Title className="text-center">
            <Link to={`/products/${_id}`}>{name}</Link>
          </Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <h5 className="text-center">Php {price}</h5>
          <Link className="btn btn-primary d-block" to={`/products/${_id}`}>
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}