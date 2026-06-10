package co.edu.udea.embeddedpayments.hooks;

import co.edu.udea.embeddedpayments.config.Environment;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.github.bonigarcia.wdm.WebDriverManager;
import net.serenitybdd.screenplay.Ability;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;
import net.serenitybdd.screenplay.rest.abilities.CallAnApi;

public class StageSetup {

    @Before
    public void setTheStage() {
        WebDriverManager.chromedriver().avoidResolutionCache().clearResolutionCache().setup();
        OnStage.setTheStage(new OnlineCast() {
            @Override
            public Actor actorNamed(String actorName, Ability... abilities) {
                return super.actorNamed(actorName, abilities)
                        .whoCan(CallAnApi.at(Environment.api()));
            }
        });
    }

    @After
    public void drawTheCurtain() {
        OnStage.drawTheCurtain();
    }
}
