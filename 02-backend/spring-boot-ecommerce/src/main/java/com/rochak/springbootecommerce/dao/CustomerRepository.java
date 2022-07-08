package com.rochak.springbootecommerce.dao;

import com.rochak.springbootecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    public Customer findByEmail(String email);
}
