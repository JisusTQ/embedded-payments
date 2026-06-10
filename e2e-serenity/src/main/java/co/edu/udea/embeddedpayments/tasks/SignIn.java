package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.ui.LoginPage;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;

public class SignIn {

    public static Performable withCredentials(String email, String password) {
        return Task.where("{0} signs in with " + email,
                Enter.theValue(email).into(LoginPage.EMAIL_FIELD),
                Enter.theValue(password).into(LoginPage.PASSWORD_FIELD),
                Click.on(LoginPage.SIGN_IN_BUTTON));
    }
}
