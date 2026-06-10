package co.edu.udea.embeddedpayments.ui;

import net.serenitybdd.screenplay.targets.Target;

public class CheckoutPage {

    public static final Target CARDHOLDER_FIELD = Target.the("cardholder name field").locatedBy("#cardholderName");
    public static final Target CARD_NUMBER_FIELD = Target.the("card number field").locatedBy("#cardNumber");
    public static final Target EXPIRY_FIELD = Target.the("expiry field").locatedBy("#expiry");
    public static final Target CVC_FIELD = Target.the("cvc field").locatedBy("#cvc");
    public static final Target EMAIL_FIELD = Target.the("receipt email field").locatedBy("#email");
    public static final Target PAY_BUTTON = Target.the("pay button").locatedBy("button[type='submit']");
    public static final Target SUCCESS_MESSAGE = Target.the("payment success message").locatedBy("p.text-emerald-700");
    public static final Target ERROR_MESSAGE = Target.the("payment error message").locatedBy("p.text-rose-800");
}
