package com.rochak.springbootecommerce.controller;

import com.rochak.springbootecommerce.dto.DeleteInfo;
import com.rochak.springbootecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/delete-order")
    public void deleteOrder(@RequestBody DeleteInfo deleteInfo) {
        orderService.deleteOrder(deleteInfo.getId());
    }
}
