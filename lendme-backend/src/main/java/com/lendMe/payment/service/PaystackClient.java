package com.lendMe.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Map;

@Component
public class PaystackClient {

    private static final String BASE_URL = "https://api.paystack.co";

    private final String secretKey;
    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PaystackClient(@Value("${paystack.secret-key}") String secretKey) {
        this.secretKey = secretKey;
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + secretKey)
                .build();
    }

    /**
     * Calls Paystack's transaction/initialize. Amount is converted to pesewas.
     * Returns the "data" node containing authorization_url, access_code, reference.
     */
    public JsonNode initializeTransaction(String email, BigDecimal amount,
                                          String reference, String callbackUrl) {
        Map<String, Object> body = Map.of(
                "email", email,
                "amount", amount.multiply(BigDecimal.valueOf(100)).toBigInteger().toString(),
                "currency", "GHS",
                "reference", reference,
                "callback_url", callbackUrl
        );

        JsonNode response = restClient.post()
                .uri("/transaction/initialize")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || !response.path("status").asBoolean(false)) {
            throw new IllegalStateException("Paystack initialization failed: "
                    + (response == null ? "empty response" : response.path("message").asText()));
        }
        return response.get("data");
    }

    /**
     * Calls Paystack's transaction/verify. Returns the "data" node
     * (data.status is "success" when the payment went through).
     */
    public JsonNode verifyTransaction(String reference) {
        JsonNode response = restClient.get()
                .uri("/transaction/verify/{reference}", reference)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || !response.path("status").asBoolean(false)) {
            throw new IllegalStateException("Paystack verification failed: "
                    + (response == null ? "empty response" : response.path("message").asText()));
        }
        return response.get("data");
    }

    /**
     * Creates a mobile-money transfer recipient (MTN = "MTN", Vodafone = "VOD",
     * AirtelTigo = "ATL"). Returns the recipient_code to store on the user.
     */
    public String createTransferRecipient(String name, String momoNumber, String provider) {
        Map<String, Object> body = Map.of(
                "type", "mobile_money",
                "name", name,
                "account_number", momoNumber,
                "bank_code", provider,
                "currency", "GHS"
        );

        JsonNode response = restClient.post()
                .uri("/transferrecipient")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || !response.path("status").asBoolean(false)) {
            throw new IllegalStateException("Paystack recipient creation failed: "
                    + (response == null ? "empty response" : response.path("message").asText()));
        }
        return response.path("data").path("recipient_code").asText();
    }

    /**
     * Initiates a transfer from the platform balance to a recipient.
     * Amount is converted to pesewas. Returns the "data" node
     * (contains transfer_code and status: pending/success/otp).
     */
    public JsonNode initiateTransfer(BigDecimal amount, String recipientCode,
                                     String reference, String reason) {
        Map<String, Object> body = Map.of(
                "source", "balance",
                "amount", amount.multiply(BigDecimal.valueOf(100)).toBigInteger().toString(),
                "recipient", recipientCode,
                "reference", reference,
                "currency", "GHS",
                "reason", reason
        );

        JsonNode response = restClient.post()
                .uri("/transfer")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        if (response == null || !response.path("status").asBoolean(false)) {
            throw new IllegalStateException("Paystack transfer failed: "
                    + (response == null ? "empty response" : response.path("message").asText()));
        }
        return response.get("data");
    }

    /**
     * Validates the x-paystack-signature header on webhook calls
     * (HMAC-SHA512 of the raw body using the secret key).
     */
    public boolean isValidWebhookSignature(String rawBody, String signature) {
        if (signature == null || rawBody == null) return false;
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            String computed = HexFormat.of().formatHex(
                    mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8)));
            return computed.equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }

    public JsonNode parseWebhookPayload(String rawBody) {
        try {
            return objectMapper.readTree(rawBody);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid webhook payload");
        }
    }
}
