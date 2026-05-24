import React from "react";
import "./ShoppingCart.css"
import req, {be_url, role, userId} from "../share/Share";
import NotFound from "../share/notfound/NotFound";

export default class ShoppingCart extends React.Component {

    state = {
        outputCarts: [],
        total: 0
    }

    url = be_url + "cart/"

    componentDidMount() {
        this.fetchProducts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadList !== prevProps.reloadList) {
            // window.location.reload();
            this.fetchProducts();
        }
    }

    fetchProducts = () => {
        req.get(this.url + userId()).then((res) => {
            const outputCarts = res.data.data;
            let totalPrice = 0;
            outputCarts.forEach(product => {
                totalPrice += (product.price - product.price * product.discount / 100) * product.quantity;
            });
            console.log("Fetch shopping cart.")
            this.setState({
                outputCarts: outputCarts,
                total: totalPrice
            });
        }).catch((error) => {
            if (error.response.data.errors) {
                console.log(error.response.data.errors[0].defaultMessage)
            } else {
                console.log(error.response.data.message)
            }
        })
    };

    handleDelete = (id) => {
        req.delete(this.url + userId() + `/${id}`).then(res => {
            console.log("Delete product.")
            this.fetchProducts();
        });
    };

    handleIncrement = (outputCart) => {
        const productId = outputCart.productId;
        const quantity = outputCart.quantity + 1;
        this.updateState(quantity, productId)
    };

    handleDecrement = (outputCart) => {
        const productId = outputCart.productId;
        const quantity = outputCart.quantity - 1;
        if (quantity > 0) {
            this.updateState(quantity, productId)
        } else if (quantity === 0) {
            this.handleDelete(productId)
        }
    };

    updateState = (quantity, productId) => {
        let totalPrice = 0;
        let outputCarts = this.state.outputCarts
        outputCarts.map((item) => {
            if (item.productId === productId) {
                item.quantity = quantity;
            }
            totalPrice += (item.price - item.price * item.discount / 100) * item.quantity;
            return quantity;
        })
        this.setState({
            outputCarts: outputCarts,
            total: totalPrice
        })
    }

    handleCheckout = () => {
        let itemList = [];
        let total = 0;
        for (let i = 0; i < this.state.outputCarts.length; i++) {
            const outputCart = this.state.outputCarts[i]
            const data = {}
            data.productId = outputCart.productId
            data.images = outputCart.images
            data.price = outputCart.price - outputCart.price * outputCart.discount / 100
            data.name = outputCart.name
            data.quantity = outputCart.quantity
            itemList[i] = data
            total = total + (outputCart.price - outputCart.price * outputCart.discount / 100) * outputCart.quantity
            // total = total + (outputCart.price) * outputCart.quantity

        }
        localStorage.setItem("total", total)
        localStorage.setItem("items", JSON.stringify(itemList));
        localStorage.setItem("isFromCart", "true")
        window.location = "/order";
    }


    render() {
        if (role() === "ROLE_CUSTOMER" || role() === "ROLE_ADMIN") {
            return (
                <>
                    <div className="container text-center mt-3 cart-page">
                        <div className="cart-table-wrap">
                        <table className="table">
                            <thead>
                            <tr>
                                <th colSpan="5" className="h3 m-0 cart-head-title">My shopping cart</th>
                            </tr>
                            <tr className="h5 cart-head-labels">
                                <th></th>
                                <th>Book name</th>
                                <th>Book price</th>
                                <th>Number</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.outputCarts
                                    .map(outputCart =>
                                        <tr key={outputCart.productId} className="cart-item-row">
                                            <td data-label=""><img src={outputCart.images[0]} alt="img"></img></td>
                                            <td data-label="Book"><a href={"/product/" + outputCart.productId}>{outputCart.name}</a></td>
                                            <td data-label="Price">{(outputCart.price - outputCart.price * outputCart.discount / 100).toFixed(2)} $</td>
                                            <td data-label="Qty">
                                                <div className='bar'>
                                                    <button type="button" className='nBtn'
                                                            onClick={() => this.handleDecrement(outputCart)}>-
                                                    </button>
                                                    <span className='number'>{outputCart.quantity}</span>
                                                    <button type="button" className='nBtn'
                                                            onClick={() => this.handleIncrement(outputCart)}>+
                                                    </button>
                                                </div>
                                            </td>
                                            <td data-label="">
                                                <button type="button" className="btn green-btn" onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this book?")) {
                                                        this.handleDelete(outputCart.productId);
                                                    }
                                                }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                        </div>
                        <div className="cart-summary">
                        <p>Total price: <strong>{this.state.total.toFixed(2)} $</strong></p>
                        <button className='buyNow' onClick={this.handleCheckout}>
                            Buy now
                        </button>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
            )
        }

    }
}