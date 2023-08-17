import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../assets/poster1.jpeg'
import img2 from '../../assets/poster2.avif'
import img3 from '../../assets/poster3.avif'
import Container from 'react-bootstrap/Container';
import React from 'react';

function Courosel() {
  return (
    <Container>
    <Carousel data-bs-theme="dark">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img1}
          alt="First slide"
        />
        <Carousel.Caption>
          {/* <h5>it's the place where all starts</h5>
          <p>Kids can learn with their friends.</p> */}
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img2}
            alt="Second slide"
        />
        <Carousel.Caption> 
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img3}
          alt="Third slide"
        />
        <Carousel.Caption>
        
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </Container>
  );
}

export default Courosel;