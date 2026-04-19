package com.itemman.service;

import com.itemman.entity.Product;
import com.itemman.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllInventory() {
        return productRepository.findAll();
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public long getLowStockCount() {
        return productRepository.findLowStockProducts().size();
    }

    public boolean hasLowStockProducts() {
        return !productRepository.findLowStockProducts().isEmpty();
    }

    public List<Product> searchInventory(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllInventory();
        }
        return productRepository.searchByKeyword(keyword.trim());
    }

    public InventorySummary getInventorySummary() {
        List<Product> products = productRepository.findAll();
        List<Product> lowStock = productRepository.findLowStockProducts();

        int totalProducts = products.size();
        int totalStock = products.stream()
                .mapToInt(Product::getStock)
                .sum();
        int lowStockCount = lowStock.size();

        double totalInventoryValue = products.stream()
                .filter(p -> p.getPurchasePrice() != null)
                .mapToDouble(p -> p.getPurchasePrice().doubleValue() * p.getStock())
                .sum();

        return new InventorySummary(totalProducts, totalStock, lowStockCount, totalInventoryValue);
    }

    public static class InventorySummary {
        private int totalProducts;
        private int totalStock;
        private int lowStockCount;
        private double totalInventoryValue;

        public InventorySummary(int totalProducts, int totalStock, int lowStockCount, double totalInventoryValue) {
            this.totalProducts = totalProducts;
            this.totalStock = totalStock;
            this.lowStockCount = lowStockCount;
            this.totalInventoryValue = totalInventoryValue;
        }

        public int getTotalProducts() {
            return totalProducts;
        }

        public int getTotalStock() {
            return totalStock;
        }

        public int getLowStockCount() {
            return lowStockCount;
        }

        public double getTotalInventoryValue() {
            return totalInventoryValue;
        }
    }
}
