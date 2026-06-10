package co.edu.udea.embeddedpayments.stepdefinitions;

import co.edu.udea.embeddedpayments.tasks.NavigateTo;
import co.edu.udea.embeddedpayments.tasks.SignIn;
import co.edu.udea.embeddedpayments.ui.DashboardPage;
import co.edu.udea.embeddedpayments.ui.LoginPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import net.serenitybdd.screenplay.ensure.Ensure;

import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;

public class AuthenticationStepDefinitions {

    @Given("the merchant is on the login page")
    public void theMerchantIsOnTheLoginPage() {
        theActorCalled("Merchant").attemptsTo(NavigateTo.theLoginPage());
    }

    @Given("the merchant has no active session")
    public void theMerchantHasNoActiveSession() {
        theActorCalled("Merchant");
    }

    @When("the merchant signs in with email {string} and password {string}")
    public void theMerchantSignsIn(String email, String password) {
        theActorCalled("Merchant").attemptsTo(SignIn.withCredentials(email, password));
    }

    @When("the merchant opens a protected route")
    public void theMerchantOpensAProtectedRoute() {
        theActorCalled("Merchant").attemptsTo(NavigateTo.aProtectedRoute());
    }

    @Then("the merchant reaches the dashboard")
    public void theMerchantReachesTheDashboard() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(DashboardPage.HEADING).text().contains("Dashboard"));
    }

    @Then("an authentication error is shown and the merchant stays on the login page")
    public void anAuthenticationErrorIsShown() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(LoginPage.ERROR_MESSAGE).text().contains("Invalid email or password"));
    }

    @Then("the platform redirects to the login page")
    public void thePlatformRedirectsToTheLoginPage() {
        theActorCalled("Merchant").attemptsTo(Ensure.that(LoginPage.SIGN_IN_BUTTON).isDisplayed());
    }
}
