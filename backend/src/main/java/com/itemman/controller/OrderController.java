package com.itemman.controller;

import com.itemman.entity.Order;
import com.itemman.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orderNo/{orderNo}")
    public ResponseEntity<Order> getOrderByOrderNo(@PathVariable String orderNo) {
        return orderService.findByOrderNo(orderNo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return ResponseEntity.ok(orderService.findByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "订单已取消");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "订单删除成功");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/today/count")
    public ResponseEntity<Map<String, Long>> getTodayOrderCount() {
        Map<String, Long> result = new HashMap<>();
        result.put("count", orderService.countTodayOrders());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/today/sales")
    public ResponseEntity<Map<String, Double>> getTodaySales() {
        Map<String, Double> result = new HashMap<>();
        result.put("sales", orderService.getTodaySales());
        return ResponseEntity.ok(result);
    }
}
