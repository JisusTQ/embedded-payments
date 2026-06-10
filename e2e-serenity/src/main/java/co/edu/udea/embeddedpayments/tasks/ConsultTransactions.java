package co.edu.udea.embeddedpayments.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Get;

public class ConsultTransactions implements Performable {

    @Override
    public <T extends Actor> void performAs(T actor) {
        String token = actor.recall("authToken");
        actor.attemptsTo(
                Get.resource("/api/v1/transactions").with(request -> request
                        .header("Authorization", "Bearer " + token))
        );
    }

    public static Performable ofTheMerchant() {
        return Tasks.instrumented(ConsultTransactions.class);
    }
}
