package co.edu.udea.embeddedpayments.ui;

import net.serenitybdd.screenplay.targets.Target;

public class CreateOrderPage {

    public static final Target AMOUNT_FIELD = Target.the("amount field").locatedBy("#amount");
    public static final Target CURRENCY_SELECT = Target.the("currency select").locatedBy("#currency");
    public static final Target DESCRIPTION_FIELD = Target.the("description field").locatedBy("#description");
    public static final Target CREATE_BUTTON = Target.the("create order button").locatedBy("button[type='submit']");
    public static final Target CHECKOUT_LINK = Target.the("generated checkout link").locatedBy("input[readonly]");
}
