package com.ecommerce.spring_boot_ecommerce.controller;

import com.ecommerce.spring_boot_ecommerce.models.Purchase;
import com.ecommerce.spring_boot_ecommerce.models.PurchaseResponse;
import com.ecommerce.spring_boot_ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
    private CheckoutService checkoutService;
    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService=checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){
        return checkoutService.placeOrder(purchase);
    }
}
