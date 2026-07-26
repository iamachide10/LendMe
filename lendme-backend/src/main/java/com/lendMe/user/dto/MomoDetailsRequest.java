package com.lendMe.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MomoDetailsRequest {

    @NotBlank
    @Pattern(regexp = "^0\\d{9}$", message = "MoMo number must be 10 digits starting with 0")
    private String momoNumber;

    @NotBlank
    @Pattern(regexp = "^(MTN|VOD|ATL)$", message = "Provider must be MTN, VOD or ATL")
    private String momoProvider;
}
