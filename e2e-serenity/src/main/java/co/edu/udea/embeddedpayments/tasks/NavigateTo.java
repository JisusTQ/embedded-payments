package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.config.Environment;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;

public class NavigateTo {

    public static Performable theLoginPage() {
        return Task.where("{0} opens the login page",
                Open.url(Environment.frontend() + "/login"));
    }

    public static Performable aProtectedRoute() {
        return Task.where("{0} opens a protected route",
                Open.url(Environment.frontend() + "/dashboard"));
    }

    public static Performable theOperationsHistory() {
        return Task.where("{0} opens the operations history",
                Open.url(Environment.frontend() + "/transactions"));
    }

    public static Performable theBalancesView() {
        return Task.where("{0} opens the balances view",
                Open.url(Environment.frontend() + "/settings/balances"));
    }
}
