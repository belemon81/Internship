import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./Footer.css";


function Footer() {
    return (
        <footer className="dark-footer">
            <div className="slogans">
                <div>
                    <img src="/images/service.png" alt="service 5 star" className="imgFooter"></img>
                    <p>Dedicated service</p>
                </div>
                <div>
                    <img src="/images/diversity.png" alt="diversity" className="imgFooter"></img>
                    <p>Different products</p>
                </div>
                <div>
                    <img src="/images/delivery.png" alt="good delivery" className="imgFooter"></img>
                    <p>Fast delivery</p>
                </div>
                <div>
                    <img src="/images/price.png" alt="suitable price" className="imgFooter"></img>
                    <p>Dedicated service</p>
                </div>
            </div>
            <hr></hr>
            <div className="container">
                <div className="footer-columns">
                    <div className="footer-col footer-col-contact">
                        <h3>Contact Us</h3>
                        <p>Tel: (84-24) 38544338</p>
                        <p>Address: Km9, đường Nguyễn Trãi, quận Nam Từ Liêm, Hà Nội, Việt Nam</p>
                        <p>Email: hanu@hanu.edu.vn | tuyensinh@hanu.edu.vn</p>
                        <ul>
                            <li><a href="/public#"><i className="bi bi-facebook"></i></a></li>
                            <li><a href="/public#"><i className="bi bi-instagram"></i></a></li>
                            <li><a href="/public#"><i className="bi bi-tiktok"></i></a></li>
                        </ul>
                    </div>
                    <div className="footer-col-group">
                        <div className="footer-col footer-col-side">
                            <h3>About Us</h3>
                            <p>This is where you can buy any book you want!</p>
                        </div>
                        <div className="footer-col footer-col-side">
                            <h3>Our partners</h3>
                            <p>Bookworm Group</p>
                            <p>FIT, Hanoi University</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
