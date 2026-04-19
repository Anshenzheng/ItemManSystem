package com.itemman.repository;

import com.itemman.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNo(String orderNo);

    List<Order> findByOrderDateBetweenOrderByOrderDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    List<Order> findByCustomerNameContainingIgnoreCase(String customerName);

    List<Order> findByStatusOrderByOrderDateDesc(String status);

    List<Order> findAllByOrderByOrderDateDesc();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate")
    long countByOrderDateAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderDate >= :startDate")
    Double sumTotalAmountByOrderDateAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.orderNo = :orderNo")
    Optional<Order> findByOrderNoWithItems(@Param("orderNo") String orderNo);
}
