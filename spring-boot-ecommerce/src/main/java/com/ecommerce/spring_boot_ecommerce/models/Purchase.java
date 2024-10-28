package com.ecommerce.spring_boot_ecommerce.models;

import com.ecommerce.spring_boot_ecommerce.entity.Address;
import com.ecommerce.spring_boot_ecommerce.entity.Customer;
import com.ecommerce.spring_boot_ecommerce.entity.Order;
import com.ecommerce.spring_boot_ecommerce.entity.OrderItem;
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
