import React from "react";
import req, {be_url, fe_url, role} from "../share/Share";
import './Admin.css';
import NotFound from "../share/notfound/NotFound";
import Header from "../share/header/Header";
import Footer from "../share/footer/Footer";
import axios from "axios";
import ImageUploading from "react-images-uploading";

export default class ProductAdd extends React.Component {
    state = {
        name: '',
        description: '',
        price: 0,
        inStock: 0,
        images: [],
        category: '',
        discount: 0,
        uploadImages: []
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

    handleImageUpload = (imageList) => {
        this.setState({
            images: imageList
        })
    };

    handleAddImage = (e) => {
        if (e.target.id === "images") {
            const images = e.target.value.split(",");
            this.setState({[e.target.id]: images});
        } else {
            this.setState({[e.target.id]: e.target.value});
        }
    }

    handleCategoryChange = (e) => {
        this.setState({
            category: e.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.target.reset();

        const product = {
            name: this.state.name,
            description: this.state.description,
            price: Number(this.state.price),
            inStock: Number(this.state.inStock),
            images: [],
            category: this.state.category,
            discount: this.state.discount
        }

        req.post(be_url + 'admin/product', product)
            .then((res) => {
                if (res.status === 200) {
                    this.submitProductImages(res.data.data.id);
                }
            })
            .catch((error) => {
                if (error.response.data.errors) {
                    alert(error.response.data.errors[0].defaultMessage)
                } else {
                    alert(error.response.data.message)
                }
            })
    }

    submitProductImages = (id) => {
        const formData = new FormData();
        if (this.state.images && this.state.images.length !== 0) {
            for (let i = 0; i < this.state.images.length; i++) {
                if (this.state.images[i].file) {
                    formData.append("images", this.state.images[i].file);
                }
            }
            req.put(`${be_url}admin/product/image-upload/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(
                (res) => {
                    alert("Images saved!")
                    window.location = "/admin/products";
                    this.setState({
                        name: '',
                        description: '',
                        price: 0,
                        inStock: 0,
                        images: [],
                        category: '',
                        discount: 0,
                    })
                },
                (error) => {
                    console.log(error);
                }
            );

        } else {
            alert("Products created!")
            window.location = "/admin/products";
        }
    };

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
                                <a className="admin-navigation current-pos" href={fe_url + "admin/products"}>Manage
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
                                <div className="container text-center mt-3 mb-5">
                                    <h2 className="p-2">
                                        ADD NEW BOOK
                                    </h2>
                                    <form className="form add card text-left p-4" onSubmit={this.handleSubmit}>
                                        <label className="h6 guide">Name</label>
                                        <input type="text" className="form-control enter" id="name"
                                               value={this.state.name} required
                                               onChange={this.handleChange}/>

                                        <label className="h6 guide">Description</label>
                                        <textarea className="form-control enter" id="description"
                                                  value={this.state.description} rows="5"
                                                  required onChange={this.handleChange}/>

                                        <label className="h6 guide">Price</label>
                                        <input type="number" min="0" className="form-control enter" id="price"
                                               value={this.state.price} required step="0.1"
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Quantity</label>
                                        <input type="number" min="0" className="form-control enter" id="inStock"
                                               value={this.state.inStock}
                                               required
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Images</label>
                                        <div>
                                            <ImageUploading
                                                multiple
                                                value={this.state.images}
                                                onChange={this.handleImageUpload}
                                                maxNumber={18}
                                            >
                                                {({onImageUpload, onImageRemove}) => (
                                                    <div className="upload__image-wrapper">
                                                        {this.state.images && this.state.images.map((image, index) => (
                                                            <span className="image-item" key={index}>
                                                            <img
                                                                src={image.dataURL}
                                                                alt=""
                                                                width="100"
                                                                height="100"
                                                            />
                                                            <i className="bi bi-trash3 top-right"
                                                               onClick={() => onImageRemove(index)}
                                                            ></i>
                                                        </span>
                                                        ))}
                                                        <div className="mt-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-success"
                                                                onClick={onImageUpload}
                                                            >
                                                                Upload Images
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>

                                        <label className=" h6 guide ">Category</label>
                                        <select className="form-control enter" id="category"
                                                onChange={this.handleCategoryChange}>
                                            <option>Select Category</option>
                                            <option value="Comic">Comic</option>
                                            <option value="Detective">Detective</option>
                                            <option value="Literature">Literature</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="Classics">Classics</option>
                                            <option value="Fiction">Fiction</option>
                                            <option value="Horror">Horror</option>
                                        </select>

                                        <label className="h6 guide">Discount</label>
                                        <input type="text" min="0" className="form-control enter" id="discount"
                                               value={this.state.discount} required
                                               onChange={this.handleAddImage}/>

                                        <div className="btnSubmit mt-3">
                                            <button type="submit" className="btn checkoutBtn mx-0">Add book
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