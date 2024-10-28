package com.ecommerce.spring_boot_ecommerce.service;

import com.ecommerce.spring_boot_ecommerce.dao.CustomerRepository;
import com.ecommerce.spring_boot_ecommerce.entity.Customer;
import com.ecommerce.spring_boot_ecommerce.entity.Order;
import com.ecommerce.spring_boot_ecommerce.entity.OrderItem;
import com.ecommerce.spring_boot_ecommerce.models.Purchase;
import com.ecommerce.spring_boot_ecommerce.models.PurchaseResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository=customerRepository;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the Order info from dto
        Order order= purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber=generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        //populate order with orderitems
        Set<OrderItem> orderItems=purchase.getOrderItems();
        orderItems.forEach(item->order.add(item));
        //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        //populate customer with order
        Customer customer=purchase.getCustomer();
        customer.add(order);
        //save to the database
        customerRepository.save(customer);
        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        //generate a random UUID number
        return UUID.randomUUID().toString();
    }
}
