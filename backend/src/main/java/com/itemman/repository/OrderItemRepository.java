package com.itemman.repository;

import com.itemman.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.id = :productId ORDER BY oi.createdAt DESC")
    List<OrderItem> findByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.orderDate >= :startDate")
    Integer sumQuantityByProductIdAndOrderDateAfter(@Param("productId") Long productId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.order WHERE oi.order.id = :orderId")
    List<OrderItem> findByOrderIdWithOrder(@Param("orderId") Long orderId);
}
