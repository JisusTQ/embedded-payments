package co.edu.udea.embeddedpayments.model;

import java.util.UUID;

public final class TestData {

    private TestData() {
    }

    public static final String MERCHANT_EMAIL = "test@example.com";
    public static final String MERCHANT_PASSWORD = "password";
    public static final String ADMIN_EMAIL = "admin@example.com";
    public static final String ADMIN_PASSWORD = "password";
    public static final String DEFAULT_PASSWORD = "password123";
    public static final double DECLINE_AMOUNT = 50.01;

    public static String uniqueEmail(String prefix) {
        return prefix + "." + System.currentTimeMillis() + "." + UUID.randomUUID().toString().substring(0, 6) + "@example.com";
    }
}
