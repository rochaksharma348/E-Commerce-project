import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { OrderHistory } from 'src/app/common/order-history';
import { Product } from 'src/app/common/product';
import { OrderHistoryService } from 'src/app/services/order-history.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderHistoryItem: OrderHistory;

  constructor(private orderHistoryService: OrderHistoryService, 
              private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getOrderDetail();
    });
  }

  getOrderDetail() {
    const theId : number = +this.route.snapshot.paramMap.get('id');
    this.orderHistoryService.getOrderHistoryItem(theId).subscribe(
      data => {
        this.orderHistoryItem = data;
      }
    );
  }

}
