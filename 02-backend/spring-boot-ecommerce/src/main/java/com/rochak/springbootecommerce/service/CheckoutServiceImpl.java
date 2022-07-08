package com.rochak.springbootecommerce.service;

import com.rochak.springbootecommerce.dao.CustomerRepository;
import com.rochak.springbootecommerce.dto.PaymentInfo;
import com.rochak.springbootecommerce.dto.Purchase;
import com.rochak.springbootecommerce.dto.PurchaseResponse;
import com.rochak.springbootecommerce.entity.Customer;
import com.rochak.springbootecommerce.entity.Order;
import com.rochak.springbootecommerce.entity.OrderItem;
import com.rochak.springbootecommerce.helper.Mail;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;
import java.util.logging.Logger;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private Logger logger = Logger.getLogger(getClass().getName());

    private CustomerRepository customerRepository;

    private JavaMailSender mailSender;

    @Autowired
    private SpringTemplateEngine thymeleafTemplateEngine;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository, JavaMailSender mailSender,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.mailSender = mailSender;
        this.customerRepository = customerRepository;
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        order.setStatus("Order Placed");

        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with shipping and billing addresses
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order
        Customer customer = purchase.getCustomer();

        String theEmail = customer.getEmail();
        Customer customerFromDb = customerRepository.findByEmail(theEmail);

        if (customerFromDb != null) {
            customer = customerFromDb;
        }

        customer.add(order);

        // save to the data base
        customerRepository.save(customer);

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("customer", customer);
        templateModel.put("totalPrice", String.format("%.2f", order.getTotalPrice()));
        logger.info("totalPrice: " + String.format("%.2f", order.getTotalPrice()));

        templateModel.put("order", order);

        Mail mail = new Mail();
        mail.setMailSubject("Your Luv2Shop.com order " + orderTrackingNumber);
        mail.setMailFrom("jupiterhero9@gmail.com");
        mail.setMailTo(customer.getEmail());

        sendMail(mail, templateModel);

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        logger.info("paymentInfo.amount: " + paymentInfo.getAmount());

        List<String> paymentMethods = new ArrayList<>();
        paymentMethods.add("card");

        Map<String, Object> params = new HashMap<>();

        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethods);
        params.put("description", "Luv2Shop payment");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        // using UUID to generate random unique number
        // probability of getting the same number is very very low
        return UUID.randomUUID().toString();
    }

    private void sendMail(Mail mail, Map<String, Object> templateModel) {

        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(templateModel);
        String htmlBody = thymeleafTemplateEngine.process("template-thymeleaf.html", thymeleafContext);

        MimeMailMessage mimeMessage = new MimeMailMessage(mailSender.createMimeMessage());

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage.getMimeMessage(), true, "UTF-8");

            mimeMessageHelper.setFrom(new InternetAddress(mail.getMailFrom(), "Luv2Shop.com"));
            mimeMessageHelper.setTo(mail.getMailTo());
            mimeMessageHelper.setSubject(mail.getMailSubject());
            mimeMessageHelper.setText(htmlBody, true);
            mimeMessageHelper.addInline("attachment.png", new ClassPathResource("logo.png"));

            mailSender.send(mimeMessageHelper.getMimeMessage());

            logger.info("Mail Sent Successfully");

        } catch (IOException | MessagingException e) {
            e.printStackTrace();
        }
    }

}










