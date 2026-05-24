import {Injectable, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

export const SERVER_URL = "https://internship-p5ci.onrender.com"

export const PASSWORD_PATTERN = /^[A-Z][a-zA-Z0-9]$/;

export const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]$/

export const PHONE_PATTERN = /^[0-9]{10}$/;

export function headers() {
  return {'Authorization': 'Bearer ' + localStorage.getItem('token')}
}

export function getUserId(): string {
  return <string>localStorage.getItem('userId')
}

export function getRole(): string {
  return <string>localStorage.getItem('role')
}

export function multipartHeaders() {
  return {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}

export type ErrorMessage = {
  message?: string;
}

export type Product = {
  id?: number,
  name: string,
  price: number,
  description: string,
  inStock: number,
  images: Array<string>,
  category: string,
  discount: number
}

export type OutputCartItem = {
  quantity: number,
  productId: number,
  name: string;
  price: number;
  description: string;
  inStock: number
  images: Array<string>
  category: string,
  discount: number
}

export type OutputOrder = {
  id: number;
  items: Array<OutputItem>;
  userId: number;
  voucherId: number;
  checkoutDate: Date;
  orderStatus: OrderStatus;
  paymentMethod: string;
  message: string;
  addressToReceive: string;
  userInfo: string
  total: number;
}

export type OrderDTO = {
  userPhone: string;
  voucherId: number;
  paymentMethod: "Cash" | "Paypal";
  message: string;
  items: Array<Item>;
  addressToReceive: string;
  userName: string
}

export type OutputItem = {
  productId: number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
  category: string;
  discount: number
}

export type Item = {
  productId: number,
  quantity: number
}

export type User = {
  id: number,
  username: string,
  password: string,
  email: string,
  name: string,
  avatar: string,
  age: number,
  address: string,
  phone: string,
  role: 'ROLE_ADMIN' | 'ROLE_CUSTOMER'
}

export type CustomerDTO = {
  id: number,
  username: string,
  password: string,
  email: string,
  name: string,
  avatar: string,
  age: number,
  address: string,
  phone: string
}

export type UserDTO = {
  id: number,
  username: string,
  password: string,
  email: string,
  name: string,
  age: number,
  address: string,
  phone: string,
  role: 'ROLE_ADMIN' | 'ROLE_CUSTOMER'
}

export type NewUserDTO = {
  username: string,
  password: string,
  email: string,
}

export type Voucher = {
  id: number,
  userEmail: string,
  title: string,
  rate: number,
  dueDate: Date,
}

export type VoucherDTO = {
  userEmail: string,
  title: string,
  rate: number,
  dueDate: Date,
}

export type Response = {
  message: string,
  status: number,
  data?: any
}

export type ResponseObject = {
  data: {
    content?: Array<Product> | Product | Array<User> | User | Array<OutputOrder> | Voucher | Array<Voucher>,
    totalElements?: number,
    totalPages?: number,
  }
}

export enum OrderStatus {
  SUCCESS = "SUCCESS",
  SHIPPING = "SHIPPING",
  ADMIN_PREPARING = "ADMIN_PREPARING",
  CUSTOMER_CONFIRMED = "CUSTOMER_CONFIRMED",
  CANCELED = "CANCELED",
  CUSTOMER_REQUEST_CANCEL = "CUSTOMER_REQUEST_CANCEL",
}

@Injectable()
export abstract class TakeUntilDestroy implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



