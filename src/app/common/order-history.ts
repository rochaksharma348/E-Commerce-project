import { Address } from "./address";
import { OrderItem } from "./order-item";

export class OrderHistory {
    id: number;
    orderTrackingNumber: string;
    totalPrice: number;
    totalQuantity: number;
    dateCreated: Date;
    orderItems: OrderItem[];
    shippingAddress: Address;
    status: string;
}
