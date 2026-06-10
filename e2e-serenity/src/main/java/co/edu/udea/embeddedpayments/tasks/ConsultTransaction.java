package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Get;

public class ConsultTransaction implements Performable {

    private final String transactionId;

    public ConsultTransaction(String transactionId) {
        this.transactionId = transactionId;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        actor.attemptsTo(
                Get.resource("/api/v1/transactions/" + transactionId).with(request -> request
                        .header("Authorization", "Bearer " + token))
        );
    }

    public static Performable withId(String transactionId) {
        return Tasks.instrumented(ConsultTransaction.class, transactionId);
    }
}
