package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.config.Environment;
import co.edu.udea.embeddedpayments.ui.CreateOrderPage;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.actions.SelectFromOptions;

public class CreatePaymentOrder {

    public static Performable forAmount(double amount, String currency) {
        return Task.where("{0} creates a payment order for " + amount + " " + currency,
                Open.url(Environment.frontend() + "/create-order"),
                Enter.theValue(String.valueOf(amount)).into(CreateOrderPage.AMOUNT_FIELD),
                SelectFromOptions.byValue(currency).from(CreateOrderPage.CURRENCY_SELECT),
                Enter.theValue("E2E order").into(CreateOrderPage.DESCRIPTION_FIELD),
                Click.on(CreateOrderPage.CREATE_BUTTON));
    }
}
