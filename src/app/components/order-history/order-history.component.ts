import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    const theEmail = JSON.parse(sessionStorage.getItem('email'));

    this.orderHistoryService.getOrderHistoryList(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
    
    // this.orderHistoryList.sort().
  }

}