package com.lendMe.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InitializePaymentResponse {

    private String authorizationUrl;
    private String accessCode;
    private String reference;
    private String callbackUrl;
}
