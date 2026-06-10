package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.config.Environment;
import co.edu.udea.embeddedpayments.ui.LoginPage;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Open;

public class Login {

    public static Performable withCredentials(String email, String password) {
        return Task.where("{0} logs in with " + email,
                Open.url(Environment.frontend() + "/login"),
                Enter.theValue(email).into(LoginPage.EMAIL_FIELD),
                Enter.theValue(password).into(LoginPage.PASSWORD_FIELD),
                Click.on(LoginPage.SIGN_IN_BUTTON));
    }
}
