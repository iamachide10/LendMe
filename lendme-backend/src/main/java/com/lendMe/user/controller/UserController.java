package com.lendMe.user.controller;

import com.lendMe.user.dto.UpdateProfileRequest;
import com.lendMe.user.dto.UserProfileDto;
import com.lendMe.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                userService.updateProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/me/momo")
    public ResponseEntity<UserProfileDto> updateMomoDetails(
            @Valid @RequestBody com.lendMe.user.dto.MomoDetailsRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                userService.updateMomoDetails(userDetails.getUsername(), request));
    }

    @PostMapping("/me/photo")
    public ResponseEntity<UserProfileDto> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws java.io.IOException {
        return ResponseEntity.ok(
                userService.uploadPhoto(userDetails.getUsername(), file));
    }
}