package co.edu.udea.embeddedpayments.stepdefinitions;

import co.edu.udea.embeddedpayments.model.TestData;
import co.edu.udea.embeddedpayments.questions.DistinctMerchantCount;
import co.edu.udea.embeddedpayments.questions.FirstTransactionStatus;
import co.edu.udea.embeddedpayments.questions.RefundCount;
import co.edu.udea.embeddedpayments.questions.TransactionCount;
import co.edu.udea.embeddedpayments.tasks.AuthorizePayment;
import co.edu.udea.embeddedpayments.tasks.ConsultRefunds;
import co.edu.udea.embeddedpayments.tasks.ConsultTransactions;
import co.edu.udea.embeddedpayments.tasks.CreatePaymentIntent;
import co.edu.udea.embeddedpayments.tasks.FilterHistory;
import co.edu.udea.embeddedpayments.tasks.Login;
import co.edu.udea.embeddedpayments.tasks.NavigateTo;
import co.edu.udea.embeddedpayments.tasks.RegisterMerchant;
import co.edu.udea.embeddedpayments.tasks.RequestRefund;
import co.edu.udea.embeddedpayments.tasks.SubmitCheckout;
import co.edu.udea.embeddedpayments.ui.BalancesPage;
import co.edu.udea.embeddedpayments.ui.DashboardPage;
import co.edu.udea.embeddedpayments.ui.TransactionsPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.ensure.Ensure;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;

public class TransactionStepDefinitions {

    @Given("a payment was processed correctly")
    public void aPaymentWasProcessedCorrectly() {
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(TestData.uniqueEmail("merchant"), TestData.DEFAULT_PASSWORD),
                CreatePaymentIntent.of(200),
                SubmitCheckout.asCustomer());
    }

    @When("the platform confirms the charge")
    public void thePlatformConfirmsTheCharge() {
        theActorCalled("Merchant").attemptsTo(ConsultTransactions.ofTheMerchant());
    }

    @Then("the movement is recorded with its amount and status")
    public void theMovementIsRecorded() {
        theActorCalled("Merchant").should(
                seeThat(TransactionCount.recorded(), greaterThan(0)),
                seeThat(FirstTransactionStatus.recorded(), equalTo("COMPLETED")));
    }

    @Given("a refund was processed")
    public void aRefundWasProcessed() {
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(TestData.uniqueEmail("merchant"), TestData.DEFAULT_PASSWORD),
                CreatePaymentIntent.of(120),
                AuthorizePayment.now(),
                RequestRefund.ofStoredTransaction(30));
    }

    @When("the platform confirms the refund")
    public void thePlatformConfirmsTheRefund() {
        theActorCalled("Merchant").attemptsTo(ConsultRefunds.ofTheMerchant());
    }

    @Then("the corresponding outgoing movement is recorded")
    public void theOutgoingMovementIsRecorded() {
        theActorCalled("Merchant").should(seeThat(RefundCount.recorded(), greaterThan(0)));
    }

    @Given("a merchant with recorded movements")
    public void aMerchantWithRecordedMovements() {
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(TestData.uniqueEmail("merchant"), TestData.DEFAULT_PASSWORD),
                CreatePaymentIntent.of(75),
                SubmitCheckout.asCustomer());
    }

    @When("its movements are requested")
    public void itsMovementsAreRequested() {
        theActorCalled("Merchant").attemptsTo(ConsultTransactions.ofTheMerchant());
    }

    @Then("the platform shows the list of transactions for that merchant")
    public void thePlatformShowsTheList() {
        theActorCalled("Merchant").should(
                seeThat(TransactionCount.recorded(), greaterThan(0)),
                seeThat(DistinctMerchantCount.inTheHistory(), equalTo(1)));
    }

    @Given("an authenticated merchant with operations")
    public void anAuthenticatedMerchantWithOperations() {
        String email = TestData.uniqueEmail("merchant");
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(email, TestData.DEFAULT_PASSWORD),
                CreatePaymentIntent.of(210),
                SubmitCheckout.asCustomer(),
                Login.withCredentials(email, TestData.DEFAULT_PASSWORD),
                Ensure.that(DashboardPage.HEADING).text().contains("Dashboard"));
    }

    @When("the merchant opens the operations history")
    public void theMerchantOpensTheHistory() {
        theActorCalled("Merchant").attemptsTo(NavigateTo.theOperationsHistory());
    }

    @Then("the platform shows the merchant movements")
    public void thePlatformShowsTheMovements() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(TransactionsPage.TABLE).text().contains("210.00"));
    }

    @When("the merchant filters the history by a status with no matches")
    public void theMerchantFiltersWithNoMatches() {
        theActorCalled("Merchant").attemptsTo(FilterHistory.byStatus("FAILED"));
    }

    @Then("the platform shows that there are no operations for that filter")
    public void thePlatformShowsNoOperationsForFilter() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(TransactionsPage.TABLE).text().contains("No transactions found"));
    }

    @When("the merchant filters the history by the completed status")
    public void theMerchantFiltersByCompleted() {
        theActorCalled("Merchant").attemptsTo(FilterHistory.byStatus("COMPLETED"));
    }

    @Then("the completed operations are shown again")
    public void theCompletedOperationsAreShownAgain() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(TransactionsPage.TABLE).text().contains("210.00"));
    }

    @Given("an authenticated merchant without operations")
    public void anAuthenticatedMerchantWithoutOperations() {
        String email = TestData.uniqueEmail("merchant");
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(email, TestData.DEFAULT_PASSWORD),
                Login.withCredentials(email, TestData.DEFAULT_PASSWORD),
                Ensure.that(DashboardPage.HEADING).text().contains("Dashboard"));
    }

    @Then("the platform reports that there are no operations")
    public void thePlatformReportsNoOperations() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(TransactionsPage.TABLE).text().contains("No transactions found"));
    }

    @Given("a merchant with recorded operations")
    public void aMerchantWithRecordedOperations() {
        String email = TestData.uniqueEmail("merchant");
        theActorCalled("Merchant").attemptsTo(
                RegisterMerchant.named(email, TestData.DEFAULT_PASSWORD),
                CreatePaymentIntent.of(250),
                SubmitCheckout.asCustomer(),
                Login.withCredentials(email, TestData.DEFAULT_PASSWORD),
                Ensure.that(DashboardPage.HEADING).text().contains("Dashboard"));
    }

    @When("the merchant checks the balance")
    public void theMerchantChecksTheBalance() {
        theActorCalled("Merchant").attemptsTo(NavigateTo.theBalancesView());
    }

    @Then("the system shows the income associated with that merchant")
    public void theSystemShowsTheIncome() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(BalancesPage.CONTENT).text().containsIgnoringCase("total recaudado"));
    }
}
