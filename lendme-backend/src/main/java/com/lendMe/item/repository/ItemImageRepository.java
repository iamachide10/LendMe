package com.lendMe.item.repository;

import com.lendMe.item.entity.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, UUID> {
    List<ItemImage> findByItemId(UUID itemId);
    @Modifying
    @Query("DELETE FROM ItemImage i WHERE i.item.id = :itemId")
    void deleteByItemId(@Param("itemId") UUID itemId);
}