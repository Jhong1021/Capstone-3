import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import Carousel from 'react-bootstrap/Carousel';
import Catalog from '../components/Catalog';

export default function Home() {

  const title = "Welcome to SunRise Moto";
  const content = "Let the Good Time Roll";
  const destination = "/products";
  const label = "Check products and Buy Now!";

  const data = { title, content, destination, label };

  return (
    <>
      <div className="carousel-container p-0">  <Carousel data-bs-theme="dark">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2022/12/kawasaki-ninja-h2r.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <Banner data={data} />
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/07/comfort.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <Banner data={data} />
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://static1.topspeedimages.com/wordpress/wp-content/uploads/jpg/201608/2016-honda-rc213v-s-11.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <Banner data={data} />
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <Catalog />
    </>
  );
}
