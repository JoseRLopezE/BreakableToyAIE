package com.breakabletoy.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class MetricsResponse {
    @JsonProperty("categoryMetrics")
    private Map<String, MetricsByCategory> categoryMetrics;
    @JsonProperty("overall")
    private MetricsByCategory overall;

    public MetricsResponse() {}

    public Map<String, MetricsByCategory> getCategoryMetrics() {
        return categoryMetrics;
    }
    public void setCategoryMetrics(Map<String, MetricsByCategory> categoryMetrics) {
        this.categoryMetrics = categoryMetrics;
    }
    public MetricsByCategory getOverall() {
        return overall;
    }
    public void setOverall(MetricsByCategory overall) {
        this.overall = overall;
    }

    public static class MetricsByCategory {
        @JsonProperty("totalProducts")
        private int totalProducts;
        @JsonProperty("totalValue")
        private double totalValue;
        @JsonProperty("averagePrice")
        private double averagePrice;

        public MetricsByCategory() {}

        public int getTotalProducts() {
            return totalProducts;
        }
        public void setTotalProducts(int totalProducts) {
            this.totalProducts = totalProducts;
        }
        public double getTotalValue() {
            return totalValue;
        }
        public void setTotalValue(double totalValue) {
            this.totalValue = totalValue;
        }
        public double getAveragePrice() {
            return averagePrice;
        }
        public void setAveragePrice(double averagePrice) {
            this.averagePrice = averagePrice;
        }
    }
}
