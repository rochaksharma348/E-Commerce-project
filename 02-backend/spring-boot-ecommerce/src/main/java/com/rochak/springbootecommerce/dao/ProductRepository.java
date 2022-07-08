package com.rochak.springbootecommerce.dao;

import com.rochak.springbootecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    public Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    public Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
}
