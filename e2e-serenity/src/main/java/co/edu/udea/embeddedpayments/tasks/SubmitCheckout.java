package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Post;

public class SubmitCheckout implements Performable {

    private final Boolean fromNote;
    private final String value;

    public SubmitCheckout(Boolean fromNote, String value) {
        this.fromNote = fromNote;
        this.value = value;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String checkoutId = fromNote ? actor.recall(value) : value;
        String body = String.format(
                "{\"checkoutId\":\"%s\",\"customerEmail\":\"customer@example.com\",\"customerName\":\"QA Customer\"}",
                checkoutId);
        actor.attemptsTo(
                Post.to("/checkout/submit").with(request -> request
                        .header("Content-Type", "application/json")
                        .body(body))
        );
    }

    public static Performable asCustomer() {
        return Tasks.instrumented(SubmitCheckout.class, Boolean.TRUE, "intentId");
    }

    public static Performable forMissingIntent() {
        return Tasks.instrumented(SubmitCheckout.class, Boolean.FALSE, "11111111-1111-1111-1111-111111111111");
    }
}
