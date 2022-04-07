import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartItems();
  }

  listCartItems() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // this.cartService.computeCartTotals();
  }

  incrementCartItem(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementCartItem(theCartItem: CartItem) {
    this.cartService.deductFromCart(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.removeCartItem(theCartItem);
  }
}
