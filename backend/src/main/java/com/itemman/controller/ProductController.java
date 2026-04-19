package com.itemman.controller;

import com.itemman.entity.Product;
import com.itemman.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{productCode}")
    public ResponseEntity<Product> getProductByCode(@PathVariable String productCode) {
        return productService.findByProductCode(productCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(productService.findLowStockProducts());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.findAllCategories());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product updatedProduct = productService.update(id, productDetails);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> stockUpdate) {
        Integer quantity = stockUpdate.get("quantity");
        productService.updateStock(id, quantity);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "库存更新成功");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "商品删除成功");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countProducts() {
        Map<String, Long> result = new HashMap<>();
        result.put("count", productService.count());
        return ResponseEntity.ok(result);
    }
}
