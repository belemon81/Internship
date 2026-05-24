import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import req, {be_url, fe_url, role} from "../share/Share";
import NotFound from "../share/notfound/NotFound";
import Header from "../share/header/Header";
import Footer from "../share/footer/Footer";
import axios from 'axios';
import ImageUploading from "react-images-uploading";

export default function ProductUpdate() {


    const {id} = useParams();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        inStock: 0,
        images: [],
        category: "",
        discount: 0,
    });
    const [uploadImages, setUploadImages] = useState([])

    const logout = async () => {
        await axios.post(`${be_url}logout`).then((res) => {
            if (res.status === 200) {
                localStorage.clear()
                alert("Logout successfully!")
                window.location = "/home"
            }
        })
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchProductList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {name, description, price, inStock, images, category, discount} =
        product;

    const handleChange = (event) => {
        setProduct({...product, [event.target.id]: event.target.value});
    };

    const handleImageUpload = (imageList) => {
        setUploadImages(imageList)
        console.log("Product images uploaded!");
    };

    const submitForm = (e) => {
        e.preventDefault();
        req.put(`${be_url}admin/product/${id}`, product).then((res) => {
            submitProductImages();
        });
    };

    const submitProductImages = () => {
        const formData = new FormData();
        if (uploadImages && uploadImages.length !== 0) {
            for (let i = 0; i < uploadImages.length; i++) {
                if (uploadImages[i].file) {
                    formData.append("images", uploadImages[i].file);
                }
            }
            req.put(`${be_url}admin/product/image-upload/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then(
                (res) => {
                    alert("Images updated!")
                    window.location = "/admin/products";
                },
                (error) => {
                    console.log(error);
                }
            );

        } else {
            alert("Products updated!")
            window.location = "/admin/products";
        }
    };

    let fetchProductList = async () => {
        await req.get(be_url + "product/" + id).then((res) => {
            console.log("Fetch product list.")
            setProduct({products: res.data.data});
        });
    };

    const onUrlRemove = (index) => {
        let imagesList = product.images;
        imagesList.splice(index, 1)
        setProduct({...product, images: imagesList})
    }

    if (role() === "ROLE_ADMIN") {
        return (
            <div className="container">
                {/*aside*/}
                <div className="row admin-layout-row">
                    <div className="col-3">
                        <aside className="admin-aside">
                            <div className="web-name">
                                <a href={fe_url + 'home'}><img className="admin-logo" src="/images/account.jpg"
                                                               alt="logo"/>&nbsp;
                                    <span>PRO BOOKSTORE</span></a>

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
                            <span onClick={logout} className="bi bi-box-arrow-right"/>&nbsp;
                        </article>
                        {/*admin*/}
                        <article className="admin-body">
                            <div className="container text-center mt-3 mb-5">
                                <h2 className="p-2">
                                    UPDATE BOOK
                                </h2>
                                <form className="form add card text-left p-4" onSubmit={(e) => {
                                    submitForm(e);
                                }}>
                                    <label className="h6 guide">Name</label>
                                    <input type="text" className="form-control enter" id="name" value={name}
                                           required
                                           onChange={(e) => handleChange(e)}/>

                                    <label className="h6 guide">Description</label>
                                    <textarea className="form-control enter" id="description"
                                              value={description} required rows="5"
                                              onChange={(e) => handleChange(e)}/>

                                    <label className="h6 guide">Price</label>
                                    <input type="number" min="0" className="form-control enter" id="price" step="0.1"
                                           value={price}
                                           required
                                           onChange={(e) => handleChange(e)}/>


                                    <label className="h6 guide">Quantity</label>
                                    <input type="number" min="0" className="form-control enter" id="inStock"
                                           value={inStock} required
                                           onChange={(e) => handleChange(e)}/>


                                    <label className="h6 guide">Images</label>
                                    <div>
                                        <ImageUploading
                                            multiple
                                            value={uploadImages}
                                            onChange={handleImageUpload}
                                            maxNumber={18}
                                        >
                                            {({onImageUpload, onImageRemove}) => (
                                                <div className="upload__image-wrapper">
                                                    {images && images.map((image, index) => (
                                                        <span className="image-item" key={index}>
                                                            <img
                                                                src={image}
                                                                alt=""
                                                                width="100"
                                                                height="100"
                                                            />
                                                            <i className="bi bi-trash3 top-right"
                                                               onClick={() => onUrlRemove(index)}
                                                            ></i>
                                                        </span>
                                                    ))}
                                                    {uploadImages && uploadImages.map((image, index) => (
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


                                    <label className="h6 guide ">Category</label>
                                    <select className="form-control enter" id="category" value={category}
                                            required
                                            onChange={(e) => handleChange(e)}>
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
                                           value={discount} required
                                           onChange={(e) => handleChange(e)}/>

                                    <div className="btnSubmit mt-3">
                                        <button type="submit" className="btn checkoutBtn mx-0">Update book
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