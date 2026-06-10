package co.edu.udea.embeddedpayments.runners;

import io.cucumber.junit.platform.engine.Constants;
import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features/ledger")
@ConfigurationParameter(key = Constants.GLUE_PROPERTY_NAME, value = "co.edu.udea.embeddedpayments.stepdefinitions,co.edu.udea.embeddedpayments.hooks")
@ConfigurationParameter(key = Constants.PLUGIN_PROPERTY_NAME, value = "io.cucumber.core.plugin.SerenityReporterParallel")
@ConfigurationParameter(key = Constants.FILTER_TAGS_PROPERTY_NAME, value = "not @gap")
public class LedgerRunner {
}
