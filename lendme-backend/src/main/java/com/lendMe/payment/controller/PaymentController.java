package com.lendMe.payment.controller;

import com.lendMe.payment.dto.PaymentRequest;
import com.lendMe.payment.dto.PaymentResponse;
import com.lendMe.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/simulate")
    public ResponseEntity<PaymentResponse> simulatePayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                paymentService.simulatePayment(request, userDetails.getUsername()));
    }
}