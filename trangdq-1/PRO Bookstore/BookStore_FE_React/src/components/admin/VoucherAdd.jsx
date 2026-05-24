import React from "react";
import req, {be_url, fe_url, role} from "../share/Share";
import NotFound from "../share/notfound/NotFound";
import Header from "../share/header/Header";
import Footer from "../share/footer/Footer";
import axios from "axios";

export default class VoucherAdd extends React.Component {
    state = {
        title: '',
        userEmail: '',
        rate: 0,
        dueDate: ''
    }

    logout = () => {
        axios.post(`${be_url}logout`).then((res) => {
            if (res.status === 200) {
                localStorage.clear()
                alert("Logout successfully!")
                window.location = "/home"
            }
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const voucher = {
            title: this.state.title,
            userEmail: this.state.userEmail,
            rate: this.state.rate,
            dueDate: this.state.dueDate
        }

        req.post(be_url + 'admin/voucher', voucher)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Voucher created!")
                    event.target.reset();
                    this.setState({
                        title: '',
                        userEmail: '',
                        rate: 0,
                        dueDate: ''
                    })
                    window.location = "/admin/vouchers";
                }
            })
            .catch(error => {
                alert(error.response.data.message)
            })
    }

    render() {
        if (role() === "ROLE_ADMIN") {
            return (
                <div className="container">
                    {/*aside*/}
                    <div className="row admin-layout-row">
                        <div className="col-3">
                            <aside className="admin-aside">
                                <div className="web-name">
                                    <a href={fe_url + 'home'}><img className="admin-logo" src="/images/account.jpg"
                                                                   alt="logo"/>&nbsp;<span>PRO BOOKSTORE</span></a>

                                </div>
                                <a className="admin-navigation" href={fe_url + "admin/products"}>Manage
                                    books</a>
                                <div className="dropdown">
                                    <a className="admin-navigation"
                                       href={fe_url + "admin/orders/1?status=customer_confirmed"}>Manage
                                        orders <i className="bi bi-chevron-down dropdown_icon"></i></a>
                                    <div className="dropdown-content">
                                        <a href={fe_url + "admin/orders?status=customer_confirmed"}>Checked out
                                            orders</a>
                                        <a href={fe_url + "admin/orders?status=admin_preparing"}>Preparing orders</a>
                                        <a href={fe_url + "admin/orders?status=shipping"}>Shipping orders</a>
                                        <a href={fe_url + "admin/orders?status=customer_request_cancel"}>Canceling
                                            orders</a>
                                        <a href={fe_url + "admin/orders?status=canceled"}>Canceled orders</a><a
                                        href={fe_url + "admin/orders?status=success"}>Successful orders</a>
                                    </div>
                                </div>
                                <a className="admin-navigation current-pos" href={fe_url + "admin/vouchers"}>Manage
                                    vouchers</a>
                            </aside>
                        </div>
                        {/*header*/}
                        <div className="col-9">
                            <article className="admin-header">
                                <span className="welcome">Welcome ADMIN!</span>&nbsp;
                                <span onClick={this.logout} className="bi bi-box-arrow-right"/>&nbsp;
                            </article>
                            {/*admin*/}
                            <article className="admin-body">
                                <div className="container text-center mt-3 mb-5">
                                    <h2 className="p-2">
                                        ADD NEW VOUCHER
                                    </h2>
                                    <form className="form add card text-left p-4" onSubmit={this.handleSubmit}>
                                        <label className="h6 guide">Title</label>
                                        <input type="text" className="form-control enter" id="title"
                                               value={this.state.title} required
                                               onChange={this.handleChange}/>

                                        <label className="h6 guide">User Email</label>
                                        <input type="text" className="form-control enter" min="0" id="userEmail"
                                               value={this.state.userEmail} required
                                               onChange={this.handleChange}/>

                                        <label className="h6 guide">Rate</label>
                                        <input type="number" min="0" className="form-control enter" id="rate"
                                               value={this.state.rate} required
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Due Date</label>
                                        <input type="date" className="form-control enter" id="dueDate"
                                               value={this.state.dueDate}
                                               required
                                               onChange={this.handleChange}/>

                                        <div className="btnSubmit mt-3">
                                            <button type="submit" className="btn checkoutBtn mx-0">Add Voucher
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <Header/>
                    <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
                    <Footer/>
                </>
            )
        }
    }
}





