package com.lendMe.item.service;

import com.lendMe.item.dto.CreateItemRequest;
import com.lendMe.item.dto.ItemResponseDto;
import com.lendMe.item.entity.Item;
import com.lendMe.item.entity.ItemCategory;
import com.lendMe.item.entity.ItemImage;
import com.lendMe.item.repository.ItemImageRepository;
import com.lendMe.item.repository.ItemRepository;
import com.lendMe.user.entity.User;
import com.lendMe.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemImageRepository itemImageRepository;
    private final UserRepository userRepository;

    public Page<ItemResponseDto> getAllItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.findByIsAvailableTrue(pageable).map(this::toDto);
    }

    public ItemResponseDto getItemById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return toDto(item);
    }

    public Page<ItemResponseDto> searchItems(String keyword, String category,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              int page, int size) {
        ItemCategory cat = category != null ? ItemCategory.valueOf(category.toUpperCase()) : null;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return itemRepository.searchItems(keyword, cat, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    @Transactional
    public ItemResponseDto createItem(CreateItemRequest request, String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Item item = Item.builder()
                .owner(owner)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .dailyPrice(request.getDailyPrice())
                .isAvailable(true)
                .build();

        return toDto(itemRepository.save(item));
    }

    @Transactional
    public ItemResponseDto updateItem(UUID id, CreateItemRequest request, String email) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("You are not the owner of this item");
        }

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setDailyPrice(request.getDailyPrice());

        return toDto(itemRepository.save(item));
    }

    @Transactional
    public void deleteItem(UUID id, String email) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getEmail().equals(email)) {
            throw new RuntimeException("You are not the owner of this item");
        }

        itemRepository.delete(item);
    }

    public List<ItemResponseDto> getMyItems(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return itemRepository.findByOwner(owner).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ItemResponseDto toDto(Item item) {
        ItemResponseDto dto = new ItemResponseDto();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setDailyPrice(item.getDailyPrice());
        dto.setIsAvailable(item.getIsAvailable());
        dto.setOwnerName(item.getOwner().getName());
        dto.setOwnerId(item.getOwner().getId());
        dto.setCreatedAt(item.getCreatedAt());

        List<String> images = itemImageRepository.findByItemId(item.getId())
                .stream().map(ItemImage::getImageUrl).collect(Collectors.toList());
        dto.setImageUrls(images);

        return dto;
    }
}