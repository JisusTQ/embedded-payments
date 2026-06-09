package com.paymentplatform.embeddedpayments.payment.infrastructure.processor;

import com.paymentplatform.embeddedpayments.payment.domain.services.PaymentProcessor;
import com.paymentplatform.embeddedpayments.payment.domain.services.ProcessorResult;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "payment.processor", havingValue = "mock", matchIfMissing = true)
public class MockPaymentProcessor implements PaymentProcessor {

    @Override
    public ProcessorResult process(UUID paymentIntentId, UUID customerId, BigDecimal amount, String currency) {
        // Comportamiento DETERMINISTA para pruebas automatizadas (antes dependia de
        // System.nanoTime(), lo que hacia el resultado aleatorio e intesteable):
        //   - Montos cuyos centavos son exactamente .01 simulan un pago RECHAZADO.
        //   - Cualquier otro monto es APROBADO.
        boolean isSuccessful = amount == null
                || amount.remainder(BigDecimal.ONE).compareTo(new BigDecimal("0.01")) != 0;

        if (isSuccessful) {
            String processorRef = "mock_" + UUID.randomUUID().toString().substring(0, 8);
            return new ProcessorResult(
                "SUCCEEDED",
                processorRef,
                "Payment processed successfully (mock)"
            );
        } else {
            return new ProcessorResult(
                "FAILED",
                null,
                "Payment failed in mock processor (simulated failure)"
            );
        }
    }
}

