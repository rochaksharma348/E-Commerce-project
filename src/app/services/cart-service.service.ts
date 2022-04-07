import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() { 
    let data = JSON.parse(this.storage.getItem(`cartItems`));
    if(data != null) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    this.storage.setItem(`cartItems`, JSON.stringify(this.cartItems));
  }

  addToCart(theCartItem: CartItem) {

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);

    alreadyExistsInCart = (existingCartItem != undefined);

    if(alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }

  deductFromCart(theCartItem: CartItem) {
    const cartItemQuantity = theCartItem.quantity;
    
    if(cartItemQuantity === 1) {
      this.removeCartItem(theCartItem);
    } else {
      theCartItem.quantity--;
      this.computeCartTotals();
    }
  }

  removeCartItem(theCartItem: CartItem) {

    const index = this.cartItems.findIndex( tempCartItem => tempCartItem.id == theCartItem.id);
    this.cartItems.splice(index, 1);

    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for(let tempCartItem of this.cartItems) {
      totalPrice += tempCartItem.quantity * tempCartItem.unitPrice;
      totalQuantity += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    this.logCartData(totalPrice, totalQuantity);

    this.persistCartItems();
  }

  logCartData(totalPrice: number, totalQuantity: number) {
    console.log(`Contents of the cart`)

    for(let tempCartItem of this.cartItems) {
      const subtotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subtotalPrice: ${subtotalPrice} `);
    }

    console.log(`totalPrice: ${totalPrice.toFixed(2)}, totalQuantity: ${totalQuantity}`);
    console.log('---------')
  }
}
