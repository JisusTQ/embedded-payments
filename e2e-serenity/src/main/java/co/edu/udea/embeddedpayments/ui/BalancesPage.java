package co.edu.udea.embeddedpayments.ui;

import net.serenitybdd.screenplay.targets.Target;

public class BalancesPage {

    public static final Target CONTENT = Target.the("balances content").locatedBy("body");
    public static final Target TABLE = Target.the("balances transactions table").locatedBy("table");
}
