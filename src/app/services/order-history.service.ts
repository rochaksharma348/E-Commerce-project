import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteResponse } from '../common/delete-response';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  orderUrl: string = environment.luv2shopApiUrl + '/orders';
  deleteUrl: string = environment.luv2shopApiUrl + '/delete-order';

  constructor(private httpClient: HttpClient) { }

  getOrderHistoryItem(id: number): Observable<OrderHistory> {
    const url = `${this.orderUrl}/${id}`;

    return this.httpClient.get<OrderHistory>(url);
  }

  deleteOrder(deleteResponse: DeleteResponse): Observable<any> {
    return this.httpClient.post<DeleteResponse>(this.deleteUrl, deleteResponse);
  }

  getOrderHistoryList(theEmail: string) : Observable<GetResponseOrderHistory> {

    const theSearchUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(theSearchUrl);

  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
