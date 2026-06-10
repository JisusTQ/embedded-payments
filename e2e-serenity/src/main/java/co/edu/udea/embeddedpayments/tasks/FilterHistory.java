package co.edu.udea.embeddedpayments.tasks;

import co.edu.udea.embeddedpayments.ui.TransactionsPage;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.SelectFromOptions;

public class FilterHistory {

    public static Performable byStatus(String status) {
        return Task.where("{0} filters the history by " + status,
                SelectFromOptions.byValue(status).from(TransactionsPage.STATUS_FILTER));
    }
}
