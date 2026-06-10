package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.model.TestData;
import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Post;

public class RegisterMerchant implements Performable {

    private final String email;
    private final String password;
    private final String prefix;

    public RegisterMerchant(String email, String password, String prefix) {
        this.email = email;
        this.password = password;
        this.prefix = prefix;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String contactEmail = TestData.uniqueEmail("contact-" + prefix);
        String body = String.format(
                "{\"email\":\"%s\",\"password\":\"%s\",\"role\":\"MERCHANT\",\"merchantName\":\"QA %s\",\"contactName\":\"QA Contact\",\"contactEmail\":\"%s\"}",
                email, password, prefix, contactEmail);
        actor.attemptsTo(
                Post.to("/api/v1/auth/register").with(request -> request
                        .header("Content-Type", "application/json")
                        .body(body))
        );
        actor.remember("merchantId", SerenityRest.lastResponse().jsonPath().getString("merchantId"));
        actor.attemptsTo(Authenticate.as(email, password));
    }

    public static Performable named(String email, String password) {
        return Tasks.instrumented(RegisterMerchant.class, email, password, "merchant");
    }

    public static Performable named(String email, String password, String prefix) {
        return Tasks.instrumented(RegisterMerchant.class, email, password, prefix);
    }
}
