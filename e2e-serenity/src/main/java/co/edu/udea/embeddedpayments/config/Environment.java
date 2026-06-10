package co.edu.udea.embeddedpayments.config;

public final class Environment {

    private Environment() {
    }

    public static String frontend() {
        return System.getProperty("frontend.url", "http://localhost:5173");
    }

    public static String api() {
        return System.getProperty("api.url", "http://localhost:8085");
    }
}
