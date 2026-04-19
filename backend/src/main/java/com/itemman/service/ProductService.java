package com.itemman.service;

import com.itemman.entity.Product;
import com.itemman.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Product> findByProductCode(String productCode) {
        return productRepository.findByProductCode(productCode);
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return findAll();
        }
        return productRepository.searchByKeyword(keyword.trim());
    }

    public List<Product> findLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public List<String> findAllCategories() {
        return productRepository.findAllCategories();
    }

    public Product save(Product product) {
        if (product.getId() == null) {
            if (productRepository.existsByProductCode(product.getProductCode())) {
                throw new RuntimeException("商品编码已存在: " + product.getProductCode());
            }
        }
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setCategory(productDetails.getCategory());
                    product.setUnit(productDetails.getUnit());
                    product.setPurchasePrice(productDetails.getPurchasePrice());
                    product.setSellingPrice(productDetails.getSellingPrice());
                    product.setStock(productDetails.getStock());
                    product.setLowStockThreshold(productDetails.getLowStockThreshold());
                    product.setDescription(productDetails.getDescription());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("商品不存在，ID: " + id));
    }

    public void updateStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("商品不存在，ID: " + productId));
        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new RuntimeException("库存不足，商品: " + product.getName() + " 当前库存: " + product.getStock());
        }
        product.setStock(newStock);
        productRepository.save(product);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("商品不存在，ID: " + id);
        }
        productRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    public long count() {
        return productRepository.count();
    }
}
