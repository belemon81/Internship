import React, {Component} from 'react'
import withRouter from './WithRouter';
import {be_url} from '../share/Share';
import axios from "axios";
import NotFound from "../share/notfound/NotFound";
import "../homepage/Homepage.css";

class ProductsByCategory extends Component {
    state = {
        products: [],
        pages: 0,
        current: 0,
    }

    componentDidMount() {
        const category = this.props.params.category;
        this.fetchProducts(category, 0);
    }

    handleSwitch(i) {
        this.fetchProducts(this.props.params.category, i)
    }

    fetchProducts(category, page) {
        axios.get(be_url + "product/category/" + category + "/" + page)
            .then((res) => {
                console.log("Fetch product by category " + category + ", page " + page)
                this.setState({
                    products: res.data.data.content,
                    pages: res.data.data.totalPages,
                    current: res.data.data.number,
                })

            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const arr = [];
        let max = 5;
        arr.push(<button disabled={this.state.current === 0} className="page page-click p-2"
                         key={"search_pre_page_" + 0}
                         onClick={() => {
                             this.handleSwitch(0)
                         }}>◄</button>)
        for (let i = 0; i < this.state.pages; i++) {
            max--;
            if (this.state.current === i) {
                arr.push(<button className="page page-clicked" key={"search_page_" + i}>{i + 1}</button>)
            } else {
                arr.push(<button className="page page-click" key={"search_page_" + i} onClick={() => {
                    this.handleSwitch(i)
                }}>{i + 1}</button>)
            }
            if (max === 0) break
        }
        arr.push(<button disabled={this.state.current === this.state.pages - 1} className="page page-click p-2"
                         key={"search_pos_page_" + 0} onClick={() => {
            this.handleSwitch(this.state.pages - 1)
        }}>►</button>)
        if (this.state.products && this.state.products.length !== 0) {
            return (
                <section className="container page-container home-page">
                    <div className="hero-section">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <div className="hero-copy">
                            <h1 className="name_page">PRO BOOKSTORE</h1>
                            <p className="subtitle">Every book is a journey, waiting to be opened.</p>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="wrapper">
                        <div className="inner">
                            <div className="grid mg-left-10">
                                <div className="products mt-0">
                                    <div className="box">
                                        {
                                            this.state.products.map(product => (
                                                <div className="product text-center" key={product.id}>
                                                    <a href={"/product/" + product.id} className="product-item">
                                                        <div className="product-img">
                                                            <img className="lazy-load"
                                                                 src={product.images[0]}
                                                                 data-src={product.images}
                                                                 alt={product.name}/>
                                                            {product.discount !== 0 && <div
                                                                className="sale-off">-{product.discount}%</div>}
                                                        </div>
                                                        <div className="product-title">{product.name}</div>
                                                        <div className="product-price">
                                                            <span
                                                                className="current-price">{((product.price - product.price * product.discount / 100)).toFixed(2)}$</span>
                                                            <span
                                                                className="original-price"><s>{(product.price).toFixed(2)}$</s></span>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="pagination text-center pt-4">
                                        {arr.map((item, index) => (<span key={"p_" + index}>
                                                    {item}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        } else {
            return (
                <section className="container page-container home-page">
                    <div className="hero-section">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <div className="hero-copy">
                            <h1 className="name_page">PRO BOOKSTORE</h1>
                            <p className="subtitle">Every book is a journey, waiting to be opened.</p>
                        </div>
                    </div>
                    <hr></hr>
                    <NotFound title='(˶˃⤙˂˶) Nothing was found!'
                              details='Perhaps you should try viewing another category!'/>
                </section>
            )
        }
    }
}

export default withRouter(ProductsByCategory);