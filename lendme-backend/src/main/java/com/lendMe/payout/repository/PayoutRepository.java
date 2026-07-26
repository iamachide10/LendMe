package com.lendMe.payout.repository;

import com.lendMe.payout.entity.Payout;
import com.lendMe.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PayoutRepository extends JpaRepository<Payout, UUID> {
    Optional<Payout> findByBookingId(UUID bookingId);
    Optional<Payout> findByTransferReference(String transferReference);
    List<Payout> findByLenderOrderByCreatedAtDesc(User lender);
}
