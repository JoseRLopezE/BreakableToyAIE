package com.breakabletoy.service;

import com.breakabletoy.dto.MetricsResponse;
import com.breakabletoy.model.Product;
import com.breakabletoy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        product.setId(UUID.randomUUID().toString());
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(String id, Product product) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setName(product.getName());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setStock(product.getStock());
            existingProduct.setExpirationDate(product.getExpirationDate());
            return productRepository.save(existingProduct);
        });
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public MetricsResponse calculateMetrics() {
        List<Product> products = getAllProducts();
        Map<String, MetricsResponse.MetricsByCategory> categoryMetrics = new HashMap<>();
        MetricsResponse.MetricsByCategory overall = new MetricsResponse.MetricsByCategory();
        overall.setTotalProducts(0);
        overall.setTotalValue(0);
        overall.setAveragePrice(0);

        for (Product product : products) {
            String category = product.getCategory();
            MetricsResponse.MetricsByCategory metrics = categoryMetrics.getOrDefault(category, new MetricsResponse.MetricsByCategory());
            metrics.setTotalProducts(metrics.getTotalProducts() + product.getStock());
            metrics.setTotalValue(metrics.getTotalValue() + (product.getPrice() * product.getStock()));
            categoryMetrics.put(category, metrics);
            overall.setTotalProducts(overall.getTotalProducts() + product.getStock());
            overall.setTotalValue(overall.getTotalValue() + (product.getPrice() * product.getStock()));
        }
        for (Map.Entry<String, MetricsResponse.MetricsByCategory> entry : categoryMetrics.entrySet()) {
            MetricsResponse.MetricsByCategory metrics = entry.getValue();
            if (metrics.getTotalProducts() > 0) {
                metrics.setAveragePrice(metrics.getTotalValue() / metrics.getTotalProducts());
            } else {
                metrics.setAveragePrice(0);
            }
        }
        if (overall.getTotalProducts() > 0) {
            overall.setAveragePrice(overall.getTotalValue() / overall.getTotalProducts());
        } else {
            overall.setAveragePrice(0);
        }
        MetricsResponse response = new MetricsResponse();
        response.setCategoryMetrics(categoryMetrics);
        response.setOverall(overall);
        return response;
    }

    public List<Product> getFilteredProducts(String name, String category, String availability, String sortKey, String sortDir, int page, int size) {
        List<Product> products = getAllProducts();
        // Filtering
        if (name != null && !name.isEmpty()) {
            products = products.stream().filter(p -> p.getName().toLowerCase().contains(name.toLowerCase())).toList();
        }
        if (category != null && !category.isEmpty()) {
            products = products.stream().filter(p -> p.getCategory().equalsIgnoreCase(category)).toList();
        }
        if (availability != null) {
            if (availability.equals("in_stock")) {
                products = products.stream().filter(p -> p.getStock() > 0).toList();
            } else if (availability.equals("out_of_stock")) {
                products = products.stream().filter(p -> p.getStock() == 0).toList();
            }
        }
        // Sorting
        if (sortKey != null && !sortKey.isEmpty()) {
            products = products.stream().sorted((a, b) -> {
                int dir = (sortDir != null && sortDir.equals("desc")) ? -1 : 1;
                switch (sortKey) {
                    case "name": return a.getName().compareToIgnoreCase(b.getName()) * dir;
                    case "category": return a.getCategory().compareToIgnoreCase(b.getCategory()) * dir;
                    case "price": return Double.compare(a.getPrice(), b.getPrice()) * dir;
                    case "stock": return Integer.compare(a.getStock(), b.getStock()) * dir;
                    case "expirationDate": return (a.getExpirationDate() != null && b.getExpirationDate() != null) ? a.getExpirationDate().compareTo(b.getExpirationDate()) * dir : 0;
                    default: return 0;
                }
            }).toList();
        }
        // Pagination
        int from = Math.max(0, (page - 1) * size);
        int to = Math.min(products.size(), from + size);
        if (from > to) return List.of();
        return products.subList(from, to);
    }
}