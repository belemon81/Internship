import React, {Component} from 'react'
import axios from "axios";
import "./Homepage.css";
import {Link, useLocation} from 'react-router-dom';
import {be_url, fe_url} from '../share/Share';
import NotFound from "../share/notfound/NotFound";

class HomepageWithLocation extends Component {
    state = {
        products: [],
        pages: 0,
        current: 0,
        search: '',
        urlParams: new URLSearchParams(this.props.location.search)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.state?.name && prevProps.location.state?.name !== this.props.location.state?.name) {
            this.fetchSearch();
        }
    }

    componentDidMount = () => {
        if ((this.props.location.state !== null && this.props.location.state.name !== this.state.search)) {
            this.fetchSearch()
        } else if (this.state.urlParams.get("asc") || this.state.urlParams.get("desc")) {
            let direction = this.state.urlParams.get("asc") === 'true' ? 'asc' : 'desc'
            let criteria = this.state.urlParams.get("price") ? 'price' :
                (this.state.urlParams.get("inStock") ? 'inStock' :
                    (this.state.urlParams.get("name") ? 'name' : 'category'))
            this.fetchSort(direction, criteria)
        } else {
            this.fetchProductList()
        }
    }

    getRightFetch = (i) => {
        if (this.props.location.state?.name) {
            this.handleSearchSwitch(i)
        } else if (this.state.urlParams.size) {
            this.handleSortSwitch(i)
        } else {
            this.handleSwitch(i)
        }
    }

    fetchSearch = () => {
        axios.get(`${be_url}search`, {params: {name: this.props.location.state.name}}).then((res) => {
            console.log("Fetch searched products.")
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: res.data.data.number,
                search: this.props.location.state.name
            });
        })
    }

    fetchSort = (direction, criteria) => {
        let config = {};
        if (criteria === 'price') {
            config = {params: {price: true, direction: direction}}
        }
        if (criteria === 'name') {
            config = {params: {name: true, direction: direction}}
        }
        if (criteria === 'inStock') {
            config = {params: {inStock: true, direction: direction}}
        }
        if (criteria === 'category') {
            config = {params: {category: true, direction: direction}}
        }
        axios.get(be_url, config).then((res) => {
            console.log("Fetch sorted products.")
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: res.data.data.number,
                urlParams: new URLSearchParams(this.props.location.search)
            });
        })
    }

    fetchProductList = () => {
        axios.get(`${be_url}`).then((res) => {
            console.log("Fetch product list.")
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: res.data.data.number
            });
        })
    }

    handleSwitch = (i) => {
        axios.get(`${be_url}${i}`).then((res) => {
            console.log("[Normal] Switch to page " + i)
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: i
            });
        })
    }

    handleSearchSwitch = (i) => {
        axios.get(`${be_url}search/${i}`, {params: {name: this.props.location.state.name}}).then((res) => {
            console.log("[Search] Switch to page " + i)
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: i
            });
        })
    }

    handleSortSwitch = (i) => {
        let direction = this.state.urlParams.get("asc") === 'true' ? 'asc' : 'desc'
        let criteria = this.state.urlParams.get("price") ? 'price' :
            (this.state.urlParams.get("inStock") ? 'inStock' :
                (this.state.urlParams.get("name") ? 'name' : 'category'))
        let config = {};
        if (criteria === 'price') {
            config = {params: {price: true, direction: direction}}
        }
        if (criteria === 'name') {
            config = {params: {name: true, direction: direction}}
        }
        if (criteria === 'inStock') {
            config = {params: {inStock: true, direction: direction}}
        }
        axios.get(`${be_url}${i}`, config).then((res) => {
            console.log("[Sort] Switch to page " + i)
            this.setState({
                products: res.data.data.content,
                pages: res.data.data.totalPages,
                current: res.data.data.number,
                urlParams: new URLSearchParams(this.props.location.search)
            });
        })
    }

    render() {
        const arr = [];
        let max = 5;
        arr.push(<button disabled={this.state.current === 0} className="page page-click p-2"
                         key={"pre_page_" + 0}
                         onClick={() => {
                             this.getRightFetch(0)
                         }}>◄</button>)
        for (let i = 0; i < this.state.pages; i++) {
            max--;
            if (this.state.current === i) {
                arr.push(<button className="page page-clicked" key={"page_" + i}>{i + 1}</button>)
            } else {
                arr.push(<button className="page page-click" key={"pos_page_" + i} onClick={() => {
                    this.getRightFetch(i)
                }}>{i + 1}</button>)
            }
            if (max === 0) break
        }
        arr.push(<button disabled={this.state.current === this.state.pages - 1} className="page page-click p-2"
                         key={"search_pos_page_" + 0} onClick={() => {
            this.getRightFetch(this.state.pages - 1)
        }}>►</button>)
        if (this.state.products && this.state.products.length !== 0) {
            return (
                <>
                    <div className="hero-section hero-fullwidth">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <div className="hero-copy">
                            <h1 className="name_page">PRO BOOKSTORE</h1>
                            <p className="subtitle">Every book is a journey, waiting to be opened.</p>
                        </div>
                    </div>
                    <section className="container page-container home-page">
                        <hr className="home-divider"></hr>
                        <div className="wrapper">
                            <div className="text-center p-2 home-sort-toolbar">
                                <span className="mx-2">
                                <Link to={fe_url + 'home?price=true&asc=true'}
                                      className="bi-sort-numeric-up-alt btn btn-outline-success m-2"
                                      onClick={() => {
                                          this.fetchSort("asc", "price")
                                      }}> Price
                                </Link>
                                <Link to={fe_url + 'home?price=true&desc=true'}
                                      className="bi-sort-numeric-down-alt btn btn-outline-success m-2"
                                      onClick={() => {
                                          this.fetchSort("desc", "price")
                                      }}> Price
                                </Link>
                                </span>
                                <span className="mx-2">
                                <Link to={fe_url + 'home?name=true&asc=true'}
                                      className="bi-sort-alpha-up-alt btn btn-outline-secondary m-2"
                                      onClick={() => {
                                          this.fetchSort("asc", "name")
                                      }}> Name
                                </Link>
                                <Link to={fe_url + 'home?name=true&desc=true'}
                                      className="bi-sort-alpha-down-alt btn btn-outline-secondary m-2"
                                      onClick={() => {
                                          this.fetchSort("desc", "name")
                                      }}> Name
                                </Link>
                                </span>
                                <span className="mx-2">
                                <Link to={fe_url + 'home?inStock=true&asc=true'}
                                      className="bi-sort-numeric-up-alt btn btn-outline-info m-2"
                                      onClick={() => {
                                          this.fetchSort("asc", "inStock")
                                      }}> In Stock
                                </Link>
                                <Link to={fe_url + 'home?inStock=true&desc=true'}
                                      className="bi-sort-numeric-down-alt btn btn-outline-info m-2"
                                      onClick={() => {
                                          this.fetchSort("desc", "inStock")
                                      }}> In Stock
                                </Link>
                                </span>
                            </div>
                            <div className="inner">
                                <div className="grid mg-left-10">
                                    <div className="products">
                                        <div className="box">
                                            {
                                                this.state.products.map(product => (
                                                    <div className="product text-center" key={product.id}>
                                                        <Link to={"/product/" + product.id} className="product-item">
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
                                                                {product.discount !== 0 && <>
                                                                    <span
                                                                        className="current-price">{(product.price - product.price * product.discount / 100).toFixed(2)}$</span>
                                                                    <span
                                                                        className="original-price"><s>{(product.price).toFixed(2)}$</s></span></>}
                                                                {product.discount === 0 &&
                                                                    <span
                                                                        className="core-price">{(product.price).toFixed(2)}$</span>}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="pagination center">
                                            {arr.map((item, index) => (<span key={"p" + index}>
                                                    {item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )
        } else {
            return (
                <NotFound title="(˚ ˃̣̣̥⌓˂̣̣̥ ) Book not existed!" details="Perhaps you should try viewing other pages!"
                />
            )
        }
    }
}

function Homepage(props) {
    let location = useLocation();
    return <HomepageWithLocation {...props} location={location}/>
}

export default Homepage;