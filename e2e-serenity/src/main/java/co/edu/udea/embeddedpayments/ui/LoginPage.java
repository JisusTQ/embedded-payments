package co.edu.udea.embeddedpayments.ui;

import net.serenitybdd.screenplay.targets.Target;

public class LoginPage {

    public static final Target EMAIL_FIELD = Target.the("email field").locatedBy("#email");
    public static final Target PASSWORD_FIELD = Target.the("password field").locatedBy("#password");
    public static final Target SIGN_IN_BUTTON = Target.the("sign in button").locatedBy("button[type='submit']");
    public static final Target ERROR_MESSAGE = Target.the("login error message").locatedBy("span.text-red-800");
}
