package com.rochak.springbootecommerce.dto;

import com.rochak.springbootecommerce.entity.Address;
import com.rochak.springbootecommerce.entity.Customer;
import com.rochak.springbootecommerce.entity.Order;
import com.rochak.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
