import axios from 'axios';

const req = axios.create({
    baseURL: 'https://internship-p5ci.onrender.com/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken()
    }
});

export default req;
export const fe_url = "/"
export const be_url = "https://internship-p5ci.onrender.com/"

export function accessToken() {
    return localStorage.getItem("access_token")
}

export function role() {
    return localStorage.getItem("role")
}

export function userId() {
    return localStorage.getItem("userId")
}

export const checkout_url = be_url + "order/paypal/transfer/"
