package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Get;

public class ConsultPaymentStatus implements Performable {

    @Override
    public <T extends Actor> void performAs(T actor) {
        String intentId = actor.recall("intentId");
        actor.attemptsTo(Get.resource("/checkout/intents/" + intentId));
    }

    public static Performable now() {
        return Tasks.instrumented(ConsultPaymentStatus.class);
    }
}
