import React from "react";
import req, {be_url, fe_url, role, userId} from "../share/Share";
import withRouter from '../product/WithRouter';
import Header from "../share/header/Header";
import NotFound from "../share/notfound/NotFound";
import Footer from "../share/footer/Footer";
import axios from "axios";

class OrderByStatus extends React.Component {
    state = {
        status: new URLSearchParams(this.props.location.search).get("status"),
        orders: [],
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
        this.fetchOrderByStatus();
    }

    fetchOrderByStatus = () => {
        req.get(`${be_url}admin/order/0?status=${this.state.status.toUpperCase()}`)
            .then((res) => {
                console.log("Get orders by status " + this.state.status.toUpperCase())
                this.setState({
                    orders: res.data.data.content,
                    pages: res.data.data.totalPages,
                    current: res.data.data.number,
                    total: res.data.data.totalElements
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadList !== prevProps.reloadList) {
            this.fetchOrderByStatus();
        }
    }


    handleUpdateStatus = async (id, fromStatus, toStatus) => {
        const body = {
            fromStatus: fromStatus,
            toStatus: toStatus,
        };
        if (toStatus === "cancel") {
            let choice = window.confirm("Cancel this order?")
            if (choice) {
                try {
                    if (id) {
                        await req.put(be_url + "order/" + id, body).then(() => {
                            console.log("Update status " + fromStatus + " -> " + toStatus)
                        });
                        const updatedOrders = [...this.state.orders];
                        const updatedOrderIndex = updatedOrders.findIndex(order => order.id === id);
                        updatedOrders[updatedOrderIndex].orderStatus = toStatus;
                        this.setState({orders: updatedOrders});
                        this.fetchOrderByStatus();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            try {
                if (id) {
                    await req.put(be_url + "order/" + id, body).then(() => {
                        console.log("Update status " + fromStatus + " -> " + toStatus)
                    });
                    const updatedOrders = [...this.state.orders];
                    const updatedOrderIndex = updatedOrders.findIndex(order => order.id === id);
                    updatedOrders[updatedOrderIndex].orderStatus = toStatus;
                    this.setState({orders: updatedOrders});
                    this.fetchOrderByStatus();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    handleSwitch = (i) => {
        req.get(`${be_url}admin/order/${i}?status=${this.state.status.toUpperCase()}`).then((res) => {
            console.log("[Normal] Switch to page " + i)
            this.setState({
                orders: res.data.data.content,
                current: i
            });
        })
    }

    render() {
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
        if (role() === "ROLE_ADMIN" && userId()) {
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
                                    <a className="admin-navigation current-pos"
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
                                <a className="admin-navigation" href={fe_url + "admin/vouchers"}>Manage vouchers</a>
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
                                <h1 className="header">
                                    {this.state.status === "customer_confirmed" && <>Checked Out </>}
                                    {this.state.status === "admin_preparing" && <>Preparing </>}
                                    {this.state.status === "shipping" && <>Shipping </>}
                                    {this.state.status === "customer_request_cancel" && <>Cancel Request </>}
                                    {this.state.status === "canceled" && <>Canceled </>}
                                    {this.state.status === "success" && <>Successful </>}
                                    Orders</h1>
                                <div className="admin-table-wrap">
                                <table className="table-list">
                                    <thead>
                                    <tr className="row m-0">
                                        <th className="col-2">User contact</th>
                                        <th className="col-5">Books information</th>
                                        <th className="col-1">Total</th>
                                        <th className="col-1">Method</th>
                                        <th className="col-3 pt-2 px-5 mt-1 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.orders.map(order =>
                                        (<tr className="row m-0" key={order.id}>
                                                <td className="col-2">{order.userInfo} |
                                                    Addr: {order.addressToReceive}.
                                                </td>
                                                <td className="col-5 p-0">
                                                    <table className="p-0">
                                                        <tbody>
                                                        {order.items.map(item => (
                                                            <tr className="no_bot" key={item.productId}>
                                                                <td className="col-2"><img src={item.images[0]}
                                                                                           alt="product"></img></td>
                                                                <td className="col-7">{item.name}</td>
                                                                <td className="col-3 pt-0 px-1">{item.quantity} items</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td className="col-1 pt-3 mt-2">{order.total.toFixed(2)}$</td>
                                                <td className="col-1 pt-3 mt-2">{order.paymentMethod}</td>
                                                <td className="col-3 pt-3 px-2 text-center">
                                                    {order.orderStatus === "customer_confirmed".toUpperCase() &&
                                                        <button className="btn btn-primary mx-1"
                                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "admin_preparing")}>Prepare</button>}
                                                    {order.orderStatus === "admin_preparing".toUpperCase() &&
                                                        <button className="btn btn-info mx-1"
                                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "shipping")}>Ship
                                                        </button>}
                                                    {order.orderStatus === "shipping".toUpperCase() &&
                                                        <button className="btn checkoutBtn my-0 mx-1"
                                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "success")}>Done
                                                        </button>}
                                                    {order.orderStatus === "customer_request_cancel".toUpperCase() &&
                                                        <button className="btn btn-danger mx-1"
                                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "canceled")}>Accept
                                                        </button>}
                                                    {order.orderStatus !== "success".toUpperCase() && order.orderStatus !== "canceled".toUpperCase() &&
                                                        <button className="btn btn-warning mx-1"
                                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "shipping")}>Cancel
                                                        </button>}
                                                    {order.orderStatus === "success".toUpperCase() &&
                                                        <button className="btn btn-success mx-1" disabled>Succeeded
                                                        </button>}
                                                    {order.orderStatus === "canceled".toUpperCase() &&
                                                        <button className="btn btn-secondary mx-1" disabled>Canceled
                                                        </button>}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                                </div>
                                <div className="footer">
                                    <div className="pagination right">
                                        <p className="book-available">{this.state.total} orders
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
                </>
            )
        }
    }
}

export default withRouter(OrderByStatus)