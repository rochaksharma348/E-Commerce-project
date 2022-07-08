package com.rochak.springbootecommerce.service;

import com.rochak.springbootecommerce.dto.PaymentInfo;
import com.rochak.springbootecommerce.dto.Purchase;
import com.rochak.springbootecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    public PurchaseResponse placeOrder(Purchase purchase);

    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
