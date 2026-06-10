package co.edu.udea.embeddedpayments.ui;

import net.serenitybdd.screenplay.targets.Target;

public class TransactionsPage {

    public static final Target TABLE = Target.the("transactions table").locatedBy("table");
    public static final Target STATUS_FILTER = Target.the("status filter").locatedBy("select");
}
