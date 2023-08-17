import style from '../footer.module.css';
import { Row,Col,Container } from 'react-bootstrap';
import logofoot from '../../assets/logo.png';
import {useNavigate} from 'react-router-dom';
import React from 'react';

function Footer()
{
    
    const navigate = useNavigate();
    return(<>
    <Container className={style.footerTop}>
        <span className={style.footerTopItem}><img src={logofoot} alt="..."/></span>
    </Container>
    <Container fluid className={style.footerMain}>
        <Row className={style.footRow}>
            <Col md={6} sm={6}  xs={6}><ul type="none" className={style.footLi}>
                <li onClick={()=>{navigate('/')}}>About Sparrow Shelf</li>
                <li onClick={()=>{navigate('/')}}>Home</li>
                <li onClick={()=>{navigate('/')}}>Contact Us</li>
                <li onClick={()=>{navigate('/book')}}>Books</li>
                <li  onClick={()=>{navigate('/')}}>Support</li>
                <li>Careers</li>
                </ul></Col>
            <Col md={6} sm={6} xs={6}>
                <ul type="none" className={style.footLi}>
                   <li>Blog</li>
                    <li>Info</li>
                    <li>Business Partner</li>
                    <li onClick={()=>{navigate('/')}}>Become a Merchant</li>
                    <li>Privacy Policy</li>
                    <li>Terms & Conditions</li>
                    {/* &#38; */}
                </ul>
            </Col>
        </Row>
    </Container>
    <Container fluid className={style.footerEnd}>
        <p className={style.footerEndTxt}>© 2023 Team Sparrow. All rights reserved.</p>
    </Container>
    </>);
}
export default Footer;