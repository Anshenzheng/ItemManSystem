package com.itemman.service;

import com.itemman.entity.Order;
import com.itemman.entity.OrderItem;
import com.itemman.entity.Product;
import com.itemman.repository.OrderRepository;
import com.itemman.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
    private final Random random = new Random();

    public List<Order> findAll() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findByIdWithItems(id);
    }

    public Optional<Order> findByOrderNo(String orderNo) {
        return orderRepository.findByOrderNoWithItems(orderNo);
    }

    public List<Order> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByOrderDateBetweenOrderByOrderDateDesc(startDate, endDate);
    }

    @Transactional
    public Order createOrder(Order order) {
        String orderNo = generateOrderNo();
        order.setOrderNo(orderNo);

        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("商品不存在，ID: " + item.getProduct().getId()));

                item.setProductCode(product.getProductCode());
                item.setProductName(product.getName());
                item.setUnitPrice(product.getSellingPrice());
                item.calculateSubtotal();

                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("库存不足，商品: " + product.getName() + " 当前库存: " + product.getStock());
                }

                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);

                order.addOrderItem(item);
            }
        }

        order.calculateTotalAmount();
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order orderDetails) {
        throw new UnsupportedOperationException("订单创建后不允许修改");
    }

    @Transactional
    public void cancelOrder(Long id) {
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new RuntimeException("订单不存在，ID: " + id));

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("订单已取消");
        }

        for (OrderItem item : order.getOrderItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("商品不存在，ID: " + item.getProduct().getId()));

            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("订单不存在，ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    public long countTodayOrders() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return orderRepository.countByOrderDateAfter(startOfDay);
    }

    public Double getTodaySales() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Double sales = orderRepository.sumTotalAmountByOrderDateAfter(startOfDay);
        return sales != null ? sales : 0.0;
    }

    private String generateOrderNo() {
        String datePart = LocalDateTime.now().format(dateFormatter);
        int randomPart = 1000 + random.nextInt(9000);
        return "ORD" + datePart + randomPart;
    }
}
