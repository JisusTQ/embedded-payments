package co.edu.udea.embeddedpayments.questions;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

public class PaymentStatus implements Question<String> {

    @Override
    public String answeredBy(Actor actor) {
        return SerenityRest.lastResponse().jsonPath().getString("status");
    }

    public static Question<String> reported() {
        return new PaymentStatus();
    }
}
