package co.edu.udea.embeddedpayments.stepdefinitions;

import co.edu.udea.embeddedpayments.model.TestData;
import co.edu.udea.embeddedpayments.questions.PaymentStatus;
import co.edu.udea.embeddedpayments.tasks.Authenticate;
import co.edu.udea.embeddedpayments.tasks.AuthorizePayment;
import co.edu.udea.embeddedpayments.tasks.CancelPayment;
import co.edu.udea.embeddedpayments.tasks.ConsultPaymentStatus;
import co.edu.udea.embeddedpayments.tasks.ConsultTransaction;
import co.edu.udea.embeddedpayments.tasks.CreatePaymentIntent;
import co.edu.udea.embeddedpayments.tasks.CreatePaymentOrder;
import co.edu.udea.embeddedpayments.tasks.DeactivateMerchant;
import co.edu.udea.embeddedpayments.tasks.Login;
import co.edu.udea.embeddedpayments.tasks.PayTheCheckout;
import co.edu.udea.embeddedpayments.tasks.RegisterMerchant;
import co.edu.udea.embeddedpayments.tasks.RequestRefund;
import co.edu.udea.embeddedpayments.tasks.SubmitCheckout;
import co.edu.udea.embeddedpayments.ui.CheckoutPage;
import co.edu.udea.embeddedpayments.ui.CreateOrderPage;
import co.edu.udea.embeddedpayments.ui.DashboardPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.ensure.Ensure;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;
import static net.serenitybdd.screenplay.rest.questions.ResponseConsequence.seeThatResponse;
import static org.hamcrest.Matchers.equalTo;

public class PaymentStepDefinitions {

    @Given("an active and authenticated merchant")
    public void anActiveAndAuthenticatedMerchant() {
        theActorCalled("Merchant").attemptsTo(
                Login.withCredentials(TestData.MERCHANT_EMAIL, TestData.MERCHANT_PASSWORD),
                Ensure.that(DashboardPage.HEADING).text().contains("Dashboard"));
    }

    @When("the merchant creates a charge with a valid amount and currency")
    public void theMerchantCreatesAValidCharge() {
        theActorCalled("Merchant").attemptsTo(CreatePaymentOrder.forAmount(149.9, "USD"));
    }

    @Then("the platform generates a pending payment intent")
    public void thePlatformGeneratesAPendingPaymentIntent() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(CreateOrderPage.CHECKOUT_LINK).value().contains("/pay/"));
    }

    @Then("the merchant receives the checkout reference")
    public void theMerchantReceivesTheCheckoutReference() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(CreateOrderPage.CHECKOUT_LINK).value().matches(".*/pay/[0-9a-f-]{36}.*"));
    }

    @Given("an inactive merchant")
    public void anInactiveMerchant() {
        theActorCalled("Merchant").attemptsTo(RegisterMerchant.named(TestData.uniqueEmail("merchant"), TestData.DEFAULT_PASSWORD));
        String merchantId = theActorCalled("Merchant").recall("merchantId");
        theActorCalled("Administrator").attemptsTo(Authenticate.asAdministrator(), DeactivateMerchant.withId(merchantId));
    }

    @When("the merchant tries to create a charge")
    public void theMerchantTriesToCreateACharge() {
        theActorCalled("Merchant").attemptsTo(CreatePaymentIntent.of(50));
    }

    @Then("the platform rejects the operation")
    public void thePlatformRejectsTheOperation() {
        theActorCalled("Merchant").should(seeThatResponse(response -> response.statusCode(403)));
    }

    @Given("an active merchant")
    public void anActiveMerchant() {
        theActorCalled("Merchant").attemptsTo(RegisterMerchant.named(TestData.uniqueEmail("merchant"), TestData.DEFAULT_PASSWORD));
    }

    @When("the merchant creates a charge for an amount of {int}")
    public void theMerchantCreatesAChargeForAmount(int amount) {
        theActorCalled("Merchant").attemptsTo(CreatePaymentIntent.of(amount));
    }

    @Then("the platform reports that the value is not acceptable")
    public void thePlatformReportsValueNotAcceptable() {
        theActorCalled("Merchant").should(seeThatResponse(response -> response.statusCode(400)));
    }

    @Given("a pending payment intent")
    public void aPendingPaymentIntent() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(120));
    }

    @Given("a pending payment intent that will be declined")
    public void aPendingPaymentIntentThatWillBeDeclined() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(TestData.DECLINE_AMOUNT));
    }

    @When("the customer pays the checkout with valid card details")
    public void theCustomerPaysTheCheckout() {
        String intentId = theActorCalled("Merchant").recall("intentId");
        theActorCalled("Customer").attemptsTo(PayTheCheckout.forIntent(intentId));
    }

    @Then("the platform approves the payment and marks it as successful")
    public void thePlatformApprovesThePayment() {
        theActorCalled("Customer").attemptsTo(Ensure.that(CheckoutPage.SUCCESS_MESSAGE).text().containsIgnoringCase("payment successful"));
    }

    @Then("the platform declines the payment and reports the reason")
    public void thePlatformDeclinesThePayment() {
        theActorCalled("Customer").attemptsTo(Ensure.that(CheckoutPage.ERROR_MESSAGE).text().contains("Payment processing failed"));
    }

    @Given("a checkout reference that does not exist")
    public void aCheckoutReferenceThatDoesNotExist() {
        theActorCalled("Customer");
    }

    @When("the platform tries to authorize it")
    public void thePlatformTriesToAuthorizeIt() {
        theActorCalled("Customer").attemptsTo(SubmitCheckout.forMissingIntent());
    }

    @Then("the platform rejects the operation and reports the problem")
    public void thePlatformRejectsAndReportsTheProblem() {
        theActorCalled("Customer").should(seeThatResponse(response -> response.statusCode(404)));
    }

    @Given("the merchant has a registered charge")
    public void theMerchantHasARegisteredCharge() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(90));
    }

    @When("the merchant queries the status of that charge")
    public void theMerchantQueriesTheStatus() {
        theActorCalled("Merchant").attemptsTo(ConsultPaymentStatus.now());
    }

    @When("the platform processes the charge")
    public void thePlatformProcessesTheCharge() {
        theActorCalled("Merchant").attemptsTo(AuthorizePayment.now());
    }

    @Then("the platform shows the current payment status as {string}")
    public void thePlatformShowsTheStatusAs(String status) {
        theActorCalled("Merchant").should(seeThat(PaymentStatus.reported(), equalTo(status)));
    }

    @Given("a charge that belongs to another merchant")
    public void aChargeThatBelongsToAnotherMerchant() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(60), AuthorizePayment.now());
    }

    @When("a different merchant queries it")
    public void aDifferentMerchantQueriesIt() {
        String transactionId = theActorCalled("Merchant").recall("transactionId");
        theActorCalled("Intruder").attemptsTo(
                RegisterMerchant.named(TestData.uniqueEmail("intruder"), TestData.DEFAULT_PASSWORD, "intruder"),
                ConsultTransaction.withId(transactionId));
    }

    @Then("the platform denies access to that information")
    public void thePlatformDeniesAccess() {
        theActorCalled("Intruder").should(seeThatResponse(response -> response.statusCode(403)));
    }

    @Given("a charge that has not been processed yet")
    public void aChargeNotProcessedYet() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(30));
    }

    @When("the merchant cancels it")
    public void theMerchantCancelsIt() {
        theActorCalled("Merchant").attemptsTo(CancelPayment.now());
    }

    @Then("the platform cancels it and no charge is made")
    public void thePlatformCancelsIt() {
        theActorCalled("Merchant").should(
                seeThatResponse(response -> response.statusCode(200)),
                seeThat(PaymentStatus.reported(), equalTo("CANCELED")));
    }

    @Given("a charge that was processed successfully")
    public void aChargeProcessedSuccessfully() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(80), AuthorizePayment.now());
    }

    @When("the merchant requests a refund to the customer")
    public void theMerchantRequestsARefund() {
        theActorCalled("Merchant").attemptsTo(RequestRefund.ofStoredTransaction(20));
    }

    @Then("the platform starts the refund and confirms the operation")
    public void thePlatformStartsTheRefund() {
        theActorCalled("Merchant").should(seeThatResponse(response -> response.statusCode(201)));
    }

    @Given("a cancelled charge")
    public void aCancelledCharge() {
        theActorCalled("Merchant").attemptsTo(Authenticate.asMerchant(), CreatePaymentIntent.of(40), CancelPayment.now());
    }

    @When("the merchant tries to refund it")
    public void theMerchantTriesToRefundIt() {
        theActorCalled("Merchant").attemptsTo(RequestRefund.ofCancelledPayment(5));
    }

    @Then("the platform reports that the charge cannot be refunded")
    public void thePlatformReportsCannotRefund() {
        theActorCalled("Merchant").should(seeThatResponse(response -> response.statusCode(404)));
    }
}
