package com.breakabletoy.controller;

import com.breakabletoy.model.Product;
import com.breakabletoy.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductSearchControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ProductService productService;

    @BeforeEach
    public void setup() {
        productService.getAllProducts().clear();
        Product p1 = new Product();
        p1.setName("Apple");
        p1.setCategory("Fruit");
        p1.setPrice(1.0);
        p1.setStock(10);
        productService.createProduct(p1);
        Product p2 = new Product();
        p2.setName("Banana");
        p2.setCategory("Fruit");
        p2.setPrice(2.0);
        p2.setStock(0);
        productService.createProduct(p2);
    }

    @Test
    public void testSearchProductsByName() throws Exception {
        mockMvc.perform(get("/api/products/search?name=Apple").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));
    }

    @Test
    public void testSearchProductsByAvailability() throws Exception {
        mockMvc.perform(get("/api/products/search?availability=in_stock").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Apple"));
        mockMvc.perform(get("/api/products/search?availability=out_of_stock").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Banana"));
    }

    @Test
    public void testSearchProductsPagination() throws Exception {
        mockMvc.perform(get("/api/products/search?page=1&size=1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").exists());
    }
}
