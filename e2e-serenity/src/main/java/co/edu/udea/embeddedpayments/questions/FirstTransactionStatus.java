package co.edu.udea.embeddedpayments.questions;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

public class FirstTransactionStatus implements Question<String> {

    @Override
    public String answeredBy(Actor actor) {
        return SerenityRest.lastResponse().jsonPath().getString("items[0].status");
    }

    public static Question<String> recorded() {
        return new FirstTransactionStatus();
    }
}
