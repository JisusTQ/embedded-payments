package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Post;

import java.util.Locale;

public class RequestRefund implements Performable {

    private final String transactionIdNote;
    private final Double amount;

    public RequestRefund(String transactionIdNote, Double amount) {
        this.transactionIdNote = transactionIdNote;
        this.amount = amount;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        String transactionId = actor.recall(transactionIdNote);
        String body = String.format(Locale.US,
                "{\"transactionId\":\"%s\",\"amount\":%s,\"reason\":\"Customer request\"}", transactionId, amount);
        actor.attemptsTo(
                Post.to("/api/v1/refunds").with(request -> request
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + token)
                        .body(body))
        );
    }

    public static Performable ofStoredTransaction(double amount) {
        return Tasks.instrumented(RequestRefund.class, "transactionId", amount);
    }

    public static Performable ofCancelledPayment(double amount) {
        return Tasks.instrumented(RequestRefund.class, "intentId", amount);
    }
}
