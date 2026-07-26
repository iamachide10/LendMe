package com.lendMe.payout.controller;

import com.lendMe.payout.dto.PayoutResponseDto;
import com.lendMe.payout.service.PayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payouts")
@RequiredArgsConstructor
public class PayoutController {

    private final PayoutService payoutService;

    @GetMapping("/me")
    public ResponseEntity<List<PayoutResponseDto>> getMyPayouts(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(payoutService.getMyPayouts(userDetails.getUsername()));
    }

    @PostMapping("/{payoutId}/retry")
    public ResponseEntity<PayoutResponseDto> retryPayout(
            @PathVariable UUID payoutId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                payoutService.retryPayout(payoutId, userDetails.getUsername()));
    }
}
