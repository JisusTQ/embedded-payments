package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.model.TestData;
import net.serenitybdd.rest.SerenityRest;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.rest.interactions.Post;

public class Authenticate implements Performable {

    private final String email;
    private final String password;

    public Authenticate(String email, String password) {
        this.email = email;
        this.password = password;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Post.to("/api/v1/auth/login").with(request -> request
                        .header("Content-Type", "application/json")
                        .body(String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password)))
        );
        actor.remember("authToken", SerenityRest.lastResponse().jsonPath().getString("token"));
    }

    public static Performable asMerchant() {
        return Tasks.instrumented(Authenticate.class, TestData.MERCHANT_EMAIL, TestData.MERCHANT_PASSWORD);
    }

    public static Performable asAdministrator() {
        return Tasks.instrumented(Authenticate.class, TestData.ADMIN_EMAIL, TestData.ADMIN_PASSWORD);
    }

    public static Performable as(String email, String password) {
        return Tasks.instrumented(Authenticate.class, email, password);
    }
}
