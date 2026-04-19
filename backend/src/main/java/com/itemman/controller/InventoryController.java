package com.itemman.controller;

import com.itemman.entity.Product;
import com.itemman.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(inventoryService.getLowStockProducts());
    }

    @GetMapping("/low-stock/count")
    public ResponseEntity<Long> getLowStockCount() {
        return ResponseEntity.ok(inventoryService.getLowStockCount());
    }

    @GetMapping("/low-stock/check")
    public ResponseEntity<Boolean> hasLowStockProducts() {
        return ResponseEntity.ok(inventoryService.hasLowStockProducts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchInventory(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(inventoryService.searchInventory(keyword));
    }

    @GetMapping("/summary")
    public ResponseEntity<InventoryService.InventorySummary> getInventorySummary() {
        return ResponseEntity.ok(inventoryService.getInventorySummary());
    }
}
