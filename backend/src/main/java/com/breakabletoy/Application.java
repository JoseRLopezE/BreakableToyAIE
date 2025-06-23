package com.breakabletoy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.breakabletoy.model.Product;
import com.breakabletoy.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.util.Arrays;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner loadInitialData(ProductRepository productRepository) {
        return args -> {
            // Only load if empty
            if (productRepository.findAll().isEmpty()) {
                productRepository.save(new Product("1", "Laptop", "Electronics", 999.99, 15, "2025-12-31"));
                productRepository.save(new Product("2", "LG 3", "Electronics", 200.99, 15, ""));
                productRepository.save(new Product("3", "Watermelon", "Food", 1.2, 50, "2025-3-20"));
                productRepository.save(new Product("4", "Milk", "Food", 1.5, 15, "2025-12-31"));
                productRepository.save(new Product("5", "T-shirt", "Clothing", 9.99, 20, ""));
                productRepository.save(new Product("6", "React Book", "Books", 19.99, 10, ""));
                productRepository.save(new Product("7", "Hammer", "Tools", 12.99, 5, ""));
                productRepository.save(new Product("8", "Smartphone", "Electronics", 699.99, 25, "2026-06-30"));
                productRepository.save(new Product("9", "Table Lamp", "Furniture", 49.99, 30, ""));
                productRepository.save(new Product("10", "Jeans", "Clothing", 39.99, 10, ""));
                productRepository.save(new Product("11", "Coffee Maker", "Appliances", 79.99, 8, ""));
                productRepository.save(new Product("12", "Microwave Oven", "Appliances", 129.99, 12, ""));
                productRepository.save(new Product("13", "Gaming Mouse", "Electronics", 49.99, 20, ""));
                productRepository.save(new Product("14", "Electric Kettle", "Appliances", 29.99, 15, ""));
                productRepository.save(new Product("15", "Headphones", "Electronics", 79.99, 18, ""));
                productRepository.save(new Product("16", "Running Shoes", "Footwear", 59.99, 10, ""));
                productRepository.save(new Product("17", "Blender", "Appliances", 39.99, 7, ""));
                productRepository.save(new Product("18", "Frying Pan", "Kitchenware", 15.99, 20, ""));
                productRepository.save(new Product("19", "Backpack", "Accessories", 29.99, 15, ""));
                productRepository.save(new Product("20", "Wrench Set", "Tools", 25.99, 5, ""));
                productRepository.save(new Product("21", "Sunglasses", "Accessories", 19.99, 30, ""));
            }
        };
    }
}
