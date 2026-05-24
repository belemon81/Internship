import req, {be_url, fe_url, role} from "../share/Share";
import './Admin.css'
import React from "react";
import axios from "axios";
import NotFound from "../share/notfound/NotFound";
import Header from "../share/header/Header";
import Footer from "../share/footer/Footer";

export default class AdminVouchers extends React.Component {
    state = {
        vouchers: [],
        current: 0,
        pages: 0,
        total: 0
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

    componentDidMount() {
        this.fetchVoucherList();
    }

    fetchVoucherList = () => {
        req.get(be_url + "admin/voucher/0").then((res) => {
            console.log("Fetch voucher list.")
            this.setState({
                vouchers: res.data.data.content,
                pages: res.data.data.totalPages,
                current: res.data.data.number,
                total: res.data.data.totalElements
            });
        })
    }

    handleSwitch = (i) => {
        req.get(`${be_url}admin/voucher/${i}`).then((res) => {
            console.log("[Normal] Switch to page " + i)
            this.setState({
                vouchers: res.data.data.content,
                current: i
            });
        })
    }

    deleteRow = (id) => {
        let choice = window.confirm("Delete this voucher?")
        if (choice) {
            req.delete(`${be_url}voucher/${id}`)
                .then(res => {
                    const vouchers = this.state.vouchers.filter(item => item.id !== id);
                    console.log("Voucher deleted.")
                    this.setState({vouchers})
                })
        }
    }

    render() {
        if (role() === "ROLE_ADMIN") {
            const arr = [];
            let max = 5;
            arr.push(<button disabled={this.state.current === 0} className="page page-click p-2"
                             key={"ad_pre_page_" + 0}
                             onClick={() => {
                                 this.handleSwitch(0)
                             }}>◄</button>)
            for (let i = 0; i < this.state.pages; i++) {
                max--;
                if (this.state.current === i) {
                    arr.push(<button className="page page-clicked" key={"ad_page_" + i}>{i + 1}</button>)
                } else {
                    arr.push(<button className="page page-click" key={"ad_page_" + i} onClick={() => {
                        this.handleSwitch(i)
                    }}>{i + 1}</button>)
                }
                if (max === 0) break
            }
            arr.push(<button disabled={this.state.current === this.state.pages - 1} className="page page-click p-2"
                             key={"search_pos_page_" + 0} onClick={() => {
                this.handleSwitch(this.state.pages - 1)
            }}>►</button>)
            return (
                <div className="container">
                    {/*aside*/}
                    <div className="row admin-layout-row">
                        <div className="col-3">
                            <aside className="admin-aside">
                                <div className="web-name">
                                    <a href={fe_url + "home"}><img className="admin-logo" src="/images/account.jpg"
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
                                <div className="header">
                                    <h1 className="manager">Vouchers</h1>
                                    <a className="btn btn-success btn-add" href={fe_url + "admin/voucher"}>Add
                                        new</a></div>
                                <div className="admin-table-wrap">
                                <table className="table-list">
                                    <thead className="product-detail">
                                    <tr>
                                        <th className="table_header">User</th>
                                        <th className="table_header">Title</th>
                                        <th className="table_header">Rate</th>
                                        <th className="table_header">Due date</th>
                                        <th className="table_header">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.vouchers.map(voucher => {
                                            return (
                                                <tr key={voucher.id}>
                                                    <td>{voucher.userEmail}</td>
                                                    <td>{voucher.title}</td>
                                                    <td>{voucher.rate}%</td>
                                                    <td>{voucher.dueDate}</td>
                                                    <td>
                                                        <i className="bi bi-trash" onClick={() => {
                                                            this.deleteRow(voucher.id)
                                                        }}></i>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                    </tbody>
                                </table>
                                </div>
                                <div className="footer">
                                    <div className="pagination right">
                                        <p className="book-available">{this.state.total} vouchers
                                            available</p>
                                        {arr.map((item, index) => (<span key={"p" + index}>
                                                    {item}</span>
                                        ))}
                                    </div>
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
                </>)
        }
    }
}