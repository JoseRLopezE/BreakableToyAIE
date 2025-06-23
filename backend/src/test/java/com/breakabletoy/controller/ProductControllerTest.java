package com.breakabletoy.controller;

import com.breakabletoy.dto.MetricsResponse;
import com.breakabletoy.model.Product;
import com.breakabletoy.repository.ProductRepository;
import com.breakabletoy.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;

    @BeforeEach
    public void setup() {
        // Clear all products for test isolation
        productRepository.clear();
        Product p = new Product();
        p.setName("Test");
        p.setCategory("TestCat");
        p.setPrice(10.0);
        p.setStock(5);
        productService.createProduct(p);
    }

    @Test
    public void testGetMetrics() throws Exception {
        mockMvc.perform(get("/api/products/metrics").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.overall.totalProducts").value(5))
                .andExpect(jsonPath("$.overall.totalValue").value(50.0))
                .andExpect(jsonPath("$.overall.averagePrice").value(10.0))
                .andExpect(jsonPath("$.categoryMetrics.TestCat.totalProducts").value(5));
    }
}
