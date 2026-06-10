package co.edu.udea.embeddedpayments.questions;

import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;

import java.util.List;

public class DistinctMerchantCount implements Question<Integer> {

    @Override
    public Integer answeredBy(Actor actor) {
        List<String> merchantIds = SerenityRest.lastResponse().jsonPath().getList("items.merchantId");
        return (int) merchantIds.stream().distinct().count();
    }

    public static Question<Integer> inTheHistory() {
        return new DistinctMerchantCount();
    }
}
