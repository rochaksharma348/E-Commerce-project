package com.rochak.springbootecommerce.service;

import com.rochak.springbootecommerce.dao.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public void deleteOrder(long id) {
        orderRepository.deleteById(id);
    }
}
