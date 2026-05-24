import React, {Component} from 'react';
import './Header.css'
import {Link, useNavigate} from "react-router-dom";
import req, {accessToken, be_url, fe_url, role, userId} from '../Share';
import axios from "axios";

class HeaderWithNavigate extends Component {
    url = be_url + "search"

    state = {
        name: "",
        numberOfItemInCart: 0,
        avatar: null,
        isActive: '',
        menuOpen: false,
        openDropdown: null
    }
    baseLink = fe_url + "category/"

    componentDidMount() {
        if (userId()) {
            this.getNumberOfItem();
            this.getUserProfile();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.menuOpen !== this.state.menuOpen) {
            document.body.classList.toggle('nav-menu-open', this.state.menuOpen);
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('nav-menu-open');
    }

    getUserProfile = () => {
        let url
        if (role() === "ROLE_CUSTOMER") {
            url = `${be_url}customer/${userId()}`
        } else {
            url = `${be_url}admin/user/${userId()}`
        }
        req.get(url).then((res) => {
            const avatarUrl = res.data.data.avatar;
            console.log("Avatar loaded.")
            if (avatarUrl !== '/account.jpg') {
                this.setState({
                    avatar: avatarUrl
                })
            } else {
                this.setState({
                    avatar: "/images" + avatarUrl
                })
            }

        }).catch((error) => {
            console.log(error)
            this.logout()
        })
    }

    search = (event) => {
        event.preventDefault();
        this.setState({menuOpen: false});
        this.props.navigate(`/home?name=${this.state.name}`, {state: {name: this.state.name}})
    }

    toggleMenu = () => {
        this.setState((prev) => ({menuOpen: !prev.menuOpen}));
    }

    closeMenu = () => {
        this.setState({menuOpen: false, openDropdown: null});
    }

    toggleDropdown = (name) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState((prev) => ({
            openDropdown: prev.openDropdown === name ? null : name
        }));
    }

    logout = () => {
        if (accessToken()) {
            axios.post(`${be_url}logout`).then((res) => {
                if (res.status === 200) {
                    localStorage.clear()
                    console.log("Logout successfully!")
                    window.location = "/home"
                }
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    getNumberOfItem = () => {
        req.get(`${be_url}cart/${userId()}`)
            .then((res) => {
                console.log("Cart loaded.")
                this.setState({numberOfItemInCart: res.data.data.length})
            })
    }

    isActive = (category) => {
        const pathname = window.location.pathname;
        return pathname.startsWith(`/category/${category}`);
    }

    render() {
        return (
            <nav className="site-header">
                <div className='top'>
                    {!accessToken() ?
                        <nav className='top-auth ml-auto'>
                            <Link to='/login' className="top-auth-link">Login</Link>
                            <span className="top-auth-sep">|</span>
                            <Link to='/register' className="top-auth-link">Register</Link>
                        </nav>
                        : <nav className='top-auth ml-auto'>
                            <button type="button" className="top-auth-link top-auth-btn logout"
                                  onClick={this.logout}>Logout</button>
                        </nav>
                    }
                </div>
                {this.state.menuOpen &&
                    <button
                        type="button"
                        className="menu-backdrop"
                        aria-label="Close menu"
                        onClick={this.closeMenu}
                    />
                }
                <div className='menu'>
                    <div className="menu-brand">
                        <a href='/home' onClick={this.closeMenu}>
                            <img src='/images/icon.jpg' alt='logo' className='logo mt-1'/>
                        </a>
                        <button
                            type="button"
                            className="menu-toggle show-on-mobile-only"
                            onClick={this.toggleMenu}
                            aria-label="Toggle navigation menu"
                            aria-expanded={this.state.menuOpen}
                        >
                            <i className={`bi ${this.state.menuOpen ? 'bi-x-lg' : 'bi-list'}`}/>
                        </button>
                    </div>

                    <div className={`menu-panel ${this.state.menuOpen ? 'menu-panel-open' : ''}`}>
                        <span className="category-links">
                            <a href={this.baseLink + "detective"}
                               className={this.isActive('detective') ? 'active' : ''}
                               onClick={this.closeMenu}>Detective</a>
                            <a href={this.baseLink + "fiction"}
                               className={this.isActive('fiction') ? 'active' : ''}
                               onClick={this.closeMenu}>Fiction</a>
                            <a href={this.baseLink + "horror"}
                               className={this.isActive('horror') ? 'active' : ''}
                               onClick={this.closeMenu}>Horror</a>
                            <a href={this.baseLink + "comic"}
                               className={this.isActive('comic') ? 'active' : ''}
                               onClick={this.closeMenu}>Comic</a>
                            <a href={this.baseLink + "adventure"}
                               className={this.isActive('adventure') ? 'active' : ''}
                               onClick={this.closeMenu}>Adventure</a>
                            <a href={this.baseLink + "literature"}
                               className={this.isActive('literature') ? 'active' : ''}
                               onClick={this.closeMenu}>Literature</a>
                        </span>

                        <form className='search-bar menu-search' onSubmit={this.search}>
                            <input type='search' placeholder='Enter name of book'
                                   className={userId() ? 'search-input pl-2' : 'search search-input pl-2'}
                                   id="name" onChange={this.handleChange}/>
                            <button type="submit" className='btn green-btn menu-search-btn'>Search</button>
                        </form>

                        <div className="menu-user-nav">
                            {(role() === "ROLE_ADMIN" || role() === "ROLE_CUSTOMER") &&
                                <div className={`dropdown menu-dropdown ${this.state.openDropdown === 'orders' ? 'is-open' : ''}`}>
                                    <button type="button" className="drop-btn drop-btn-compact" aria-expanded={this.state.openDropdown === 'orders'}
                                            onClick={this.toggleDropdown('orders')} title="Orders">
                                        <i className="bi bi-cart-check"/>
                                        <span className="drop-label">Orders</span>
                                    </button>
                                    <div className="dropdown-content">
                                        <a href={fe_url + 'my_orders?status=customer_confirmed'} onClick={this.closeMenu}>Checked out orders</a>
                                        <a href={fe_url + 'my_orders?status=admin_preparing'} onClick={this.closeMenu}>Preparing orders</a>
                                        <a href={fe_url + 'my_orders?status=shipping'} onClick={this.closeMenu}>Shipping orders</a>
                                        <a href={fe_url + 'my_orders?status=customer_request_cancel'} onClick={this.closeMenu}>Canceling orders</a>
                                        <a href={fe_url + 'my_orders?status=canceled'} onClick={this.closeMenu}>Canceled orders</a>
                                        <a href={fe_url + 'my_orders?status=success'} onClick={this.closeMenu}>Successful orders</a>
                                    </div>
                                </div>}
                            {role() === "ROLE_ADMIN" &&
                                <div className={`dropdown menu-dropdown ${this.state.openDropdown === 'admin' ? 'is-open' : ''}`}>
                                    <button type="button" className="drop-btn drop-btn-compact" aria-expanded={this.state.openDropdown === 'admin'}
                                            onClick={this.toggleDropdown('admin')} title="Admin">
                                        <i className="bi bi-person"/>
                                        <span className="drop-label">Admin</span>
                                    </button>
                                    <div className="dropdown-content">
                                        <a href={fe_url + 'admin/products'} onClick={this.closeMenu}>Manage books</a>
                                        <a href={fe_url + 'admin/orders?status=customer_confirmed'} onClick={this.closeMenu}>Manage orders</a>
                                        <a href={fe_url + 'admin/vouchers'} onClick={this.closeMenu}>Manage vouchers</a>
                                    </div>
                                </div>}
                            {(role() === "ROLE_ADMIN" || role() === "ROLE_CUSTOMER") &&
                                <div className="menu-actions">
                                    <Link to={fe_url + "cart"} className="menu-cart" onClick={this.closeMenu}>
                                        <i className="bi bi-cart2 customCart">
                                            <span className='numberOfItem'>{this.state.numberOfItemInCart}</span>
                                        </i>
                                    </Link>
                                    <Link to='/my_profile' onClick={this.closeMenu}>
                                        <img className="account" src={this.state.avatar} alt="avatar"/>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <hr className="mb-0"></hr>
            </nav>
        );
    }
}

function Header(props) {
    let navigate = useNavigate();
    return <HeaderWithNavigate {...props} navigate={navigate}/>
}

export default Header;