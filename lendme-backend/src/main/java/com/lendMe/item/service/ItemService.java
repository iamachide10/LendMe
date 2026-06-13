package com.lendMe.item.service;
import com.lendMe.item.dto.ItemImageDto;
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
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.List;
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

        itemImageRepository.deleteByItemId(id);
        itemRepository.delete(item);
    }

    public List<ItemResponseDto> getMyItems(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return itemRepository.findByOwner(owner).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


        private ItemImageDto toImageDto(ItemImage img) {
        ItemImageDto dto = new ItemImageDto();
        dto.setId(img.getId());
        dto.setImageUrl(img.getImageUrl());
        dto.setIsPrimary(img.getIsPrimary());
        dto.setSortOrder(img.getSortOrder());
        return dto;
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

      List<ItemImageDto> images = itemImageRepository.findByItemId(item.getId())
        .stream().map(this::toImageDto).collect(Collectors.toList());
        dto.setImages(images);

        return dto;
    }


    @Transactional
    public ItemResponseDto uploadImage(UUID itemId, MultipartFile file, String email) throws IOException {
    Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

    if (!item.getOwner().getEmail().equals(email)) {
        throw new RuntimeException("You are not the owner of this item");
    }

    // Create uploads directory if it doesn't exist
    String uploadDir = "uploads/items/" + itemId;
    Path uploadPath = Paths.get(uploadDir);
    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    // Generate unique filename
    String originalFilename = file.getOriginalFilename();
    String extension = originalFilename != null && originalFilename.contains(".")
            ? originalFilename.substring(originalFilename.lastIndexOf("."))
            : ".jpg";
    String filename = UUID.randomUUID() + extension;

    // Save file to disk
    Path filePath = uploadPath.resolve(filename);
    Files.write(filePath, file.getBytes());

    // Save metadata to DB
    String imageUrl = "/uploads/items/" + itemId + "/" + filename;
    int sortOrder = itemImageRepository.findByItemId(itemId).size();

    ItemImage itemImage = ItemImage.builder()
            .item(item)
            .imageUrl(imageUrl)
            .isPrimary(sortOrder == 0)
            .sortOrder(sortOrder)
            .build();

    itemImageRepository.save(itemImage);



    return toDto(item);
}
}