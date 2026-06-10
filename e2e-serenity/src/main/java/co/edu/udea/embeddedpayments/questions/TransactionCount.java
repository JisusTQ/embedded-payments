package co.edu.udea.embeddedpayments.questions;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

public class TransactionCount implements Question<Integer> {

    @Override
    public Integer answeredBy(Actor actor) {
        return SerenityRest.lastResponse().jsonPath().getInt("total");
    }

    public static Question<Integer> recorded() {
        return new TransactionCount();
    }
}
