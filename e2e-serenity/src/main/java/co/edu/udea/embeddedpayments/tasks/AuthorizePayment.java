package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Patch;

public class AuthorizePayment implements Performable {

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        String intentId = actor.recall("intentId");
        actor.attemptsTo(
                Patch.to("/api/v1/admin/payments/intents/" + intentId + "/authorize").with(request -> request
                        .header("Authorization", "Bearer " + token))
        );
        actor.remember("transactionId", SerenityRest.lastResponse().jsonPath().getString("id"));
    }

    public static Performable now() {
        return Tasks.instrumented(AuthorizePayment.class);
    }
}
