package com.breakabletoy.controller;

import com.breakabletoy.model.Product;
import com.breakabletoy.repository.ProductRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductCrudControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        productRepository.clear();
    }

    @Test
    public void testCreateProduct_Valid() throws Exception {
        Product p = new Product();
        p.setName("Test");
        p.setCategory("Cat");
        p.setPrice(10.0);
        p.setStock(5);
        p.setExpirationDate("");
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Test"));
    }

    @Test
    public void testCreateProduct_Invalid() throws Exception {
        Product p = new Product();
        p.setName(""); // Invalid: blank name
        p.setCategory(""); // Invalid: blank category
        p.setPrice(-1.0); // Invalid: negative price
        p.setStock(-1); // Invalid: negative stock
        p.setExpirationDate("");
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").exists())
                .andExpect(jsonPath("$.category").exists())
                .andExpect(jsonPath("$.price").exists())
                .andExpect(jsonPath("$.stock").exists());
    }

    @Test
    public void testUpdateProduct_NotFound() throws Exception {
        Product p = new Product();
        p.setName("Test");
        p.setCategory("Cat");
        p.setPrice(10.0);
        p.setStock(5);
        p.setExpirationDate("");
        mockMvc.perform(put("/api/products/doesnotexist")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteProduct() throws Exception {
        Product p = new Product();
        p.setName("Test");
        p.setCategory("Cat");
        p.setPrice(10.0);
        p.setStock(5);
        p.setExpirationDate("");
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andReturn().getResponse().getContentAsString();
        Product created = objectMapper.readValue(response, Product.class);
        mockMvc.perform(delete("/api/products/" + created.getId()))
                .andExpect(status().isNoContent()); // Expect 204
    }

    @Test
    public void testGetAllProducts() throws Exception {
        Product p = new Product();
        p.setName("Test");
        p.setCategory("Cat");
        p.setPrice(10.0);
        p.setStock(5);
        p.setExpirationDate("");
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test"));
    }
}
