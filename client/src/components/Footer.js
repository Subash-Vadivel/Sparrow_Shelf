import { Row, Col, Container } from 'react-bootstrap';
import logofoot from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import React from 'react';

function Footer() {
    const navigate = useNavigate();

    return (<>
        <Container className="footerTop">
            <span className="footerTopItem"><img src={logofoot} alt="..." /></span>
        </Container>
        <Container fluid className="footerMain">
            <Row className="footRow">
                <Col md={4} sm={6} xs={12}><ul type="none" className="footLi">
                    <li onClick={() => { navigate('/') }}>About Sparrow Shelf</li>
                    <li onClick={() => { navigate('/') }}>Home</li>
                    <li onClick={() => { navigate('/') }}>Contact Us</li>
                    <li onClick={() => { navigate('/book') }}>Books</li>
                </ul></Col>
                <Col md={4} sm={6} xs={12}>
                    <ul type="none" className="footLi">
                        <li onClick={() => { navigate('/') }}>Support</li>
                        <li>Careers</li>
                        <li>Blog</li>
                        <li>Info</li>
                    </ul>
                </Col>
                <Col md={4} sm={6} xs={12}>
                    <ul type="none" className="footLi">

                        <li>Business Partner</li>
                        <li onClick={() => { navigate('/') }}>Become a Merchant</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>
                </Col>

            </Row>
        </Container>
        <Container fluid className="footerEnd">
            <p className="footerEndTxt">© 2023 Team Sparrow. All rights reserved.</p>
        </Container>
    </>);
}
export default Footer;