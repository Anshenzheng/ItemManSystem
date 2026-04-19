package com.itemman.controller;

import com.itemman.service.InventoryService;
import com.itemman.service.OrderService;
import com.itemman.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalProducts", productService.count());
        data.put("todayOrders", orderService.countTodayOrders());
        data.put("todaySales", orderService.getTodaySales());
        data.put("lowStockCount", inventoryService.getLowStockCount());

        InventoryService.InventorySummary inventorySummary = inventoryService.getInventorySummary();
        data.put("inventorySummary", inventorySummary);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications() {
        Map<String, Object> notifications = new HashMap<>();

        boolean hasLowStock = inventoryService.hasLowStockProducts();
        long lowStockCount = inventoryService.getLowStockCount();

        notifications.put("hasLowStock", hasLowStock);
        notifications.put("lowStockCount", lowStockCount);

        return ResponseEntity.ok(notifications);
    }
}
