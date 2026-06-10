package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.config.Environment;
import co.edu.udea.embeddedpayments.ui.CheckoutPage;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Open;

public class PayTheCheckout {

    public static Performable forIntent(String intentId) {
        return Task.where("{0} pays the checkout for intent " + intentId,
                Open.url(Environment.frontend() + "/pay/" + intentId),
                Enter.theValue("Alex Johnson").into(CheckoutPage.CARDHOLDER_FIELD),
                Enter.theValue("4242424242424242").into(CheckoutPage.CARD_NUMBER_FIELD),
                Enter.theValue("1230").into(CheckoutPage.EXPIRY_FIELD),
                Enter.theValue("123").into(CheckoutPage.CVC_FIELD),
                Enter.theValue("customer@example.com").into(CheckoutPage.EMAIL_FIELD),
                Click.on(CheckoutPage.PAY_BUTTON));
    }
}
