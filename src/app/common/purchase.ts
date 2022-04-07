import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {
    customer: Customer
    order: Order;
    shippingAddress: Address;
    billingAddress: Address;
    orderItems: OrderItem[];

}
