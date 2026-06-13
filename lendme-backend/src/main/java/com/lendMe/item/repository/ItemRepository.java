package com.lendMe.item.repository;

import com.lendMe.item.entity.Item;
import com.lendMe.item.entity.ItemCategory;
import com.lendMe.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {

    Page<Item> findByIsAvailableTrue(Pageable pageable);

    List<Item> findByOwner(User owner);

     @Query("SELECT i FROM Item i WHERE i.isAvailable = true " +
       "AND (:category IS NULL OR i.category = :category) " +
       "AND (:minPrice IS NULL OR i.dailyPrice >= :minPrice) " +
       "AND (:maxPrice IS NULL OR i.dailyPrice <= :maxPrice) " +
       "AND (:search IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))")
Page<Item> searchItems(@Param("search") String search,
                       @Param("category") ItemCategory category,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice,
                       Pageable pageable);

}