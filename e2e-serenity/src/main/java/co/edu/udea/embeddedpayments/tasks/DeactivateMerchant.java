package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Patch;

public class DeactivateMerchant implements Performable {

    private final String merchantId;

    public DeactivateMerchant(String merchantId) {
        this.merchantId = merchantId;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        actor.attemptsTo(
                Patch.to("/api/v1/merchants/" + merchantId + "/deactivate").with(request -> request
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + token)
                        .body("{\"reason\":\"QA suspension\"}"))
        );
    }

    public static Performable withId(String merchantId) {
        return Tasks.instrumented(DeactivateMerchant.class, merchantId);
    }
}
