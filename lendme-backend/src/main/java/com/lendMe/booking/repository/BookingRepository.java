package com.lendMe.booking.repository;

import com.lendMe.booking.entity.Booking;
import com.lendMe.booking.entity.BookingStatus;
import com.lendMe.user.entity.User;
import com.lendMe.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByBorrower(User borrower);

    List<Booking> findByItemOwner(User owner);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.item = :item " +
           "AND b.status IN ('APPROVED', 'ACTIVE', 'PAID') " +
           "AND b.startDate <= :endDate AND b.endDate >= :startDate")
    boolean existsOverlappingBooking(@Param("item") Item item,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);
}