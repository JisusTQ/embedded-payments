package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Post;

import java.util.Locale;

public class CreatePaymentIntent implements Performable {

    private final Double amount;
    private final String currency;

    public CreatePaymentIntent(Double amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        String body = String.format(Locale.US,
                "{\"amount\":%s,\"currency\":\"%s\",\"description\":\"E2E charge\"}", amount, currency);
        actor.attemptsTo(
                Post.to("/api/v1/admin/payments/intents").with(request -> request
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + token)
                        .body(body))
        );
        actor.remember("intentId", SerenityRest.lastResponse().jsonPath().getString("id"));
    }

    public static Performable of(double amount) {
        return Tasks.instrumented(CreatePaymentIntent.class, amount, "USD");
    }

    public static Performable of(double amount, String currency) {
        return Tasks.instrumented(CreatePaymentIntent.class, amount, currency);
    }
}
