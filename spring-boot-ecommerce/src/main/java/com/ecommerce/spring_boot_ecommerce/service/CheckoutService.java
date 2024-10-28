package com.ecommerce.spring_boot_ecommerce.service;

import com.ecommerce.spring_boot_ecommerce.models.Purchase;
import com.ecommerce.spring_boot_ecommerce.models.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
