package com.paymentplatform.embeddedpayments.infrastructure.config;

import com.paymentplatform.embeddedpayments.auth.domain.entity.AuthRole;
import com.paymentplatform.embeddedpayments.auth.domain.entity.UserAccount;
import com.paymentplatform.embeddedpayments.auth.infrastructure.repository.AuthRoleJpaRepository;
import com.paymentplatform.embeddedpayments.auth.infrastructure.repository.UserAccountJpaRepository;
import com.paymentplatform.embeddedpayments.merchant.domain.entity.Merchant;
import com.paymentplatform.embeddedpayments.merchant.infrastructure.persistence.MerchantJpaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Component
public class DemoDataInitializer implements CommandLineRunner {

    private final UserAccountJpaRepository userAccountRepository;
    private final AuthRoleJpaRepository authRoleRepository;
    private final MerchantJpaRepository merchantRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataInitializer(UserAccountJpaRepository userAccountRepository,
                               AuthRoleJpaRepository authRoleRepository,
                               MerchantJpaRepository merchantRepository,
                               PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.authRoleRepository = authRoleRepository;
        this.merchantRepository = merchantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String email = "test@example.com";
        UUID demoId = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

        // 1. Ensure the Merchant exists
        if (!merchantRepository.existsById(demoId)) {
            Merchant merchant = new Merchant(
                    demoId,
                    "Test Merchant",
                    email,
                    "ACTIVE"
            );
            merchantRepository.save(merchant);
            System.out.println("Demo merchant created successfully with ID: " + demoId);
        }

        // 2. Ensure the ROLE_MERCHANT role exists
        AuthRole merchantRole = authRoleRepository.findByName("ROLE_MERCHANT")
                .orElseGet(() -> authRoleRepository.save(new AuthRole("ROLE_MERCHANT", "Merchant user role")));

        // 3. Ensure the UserAccount exists
        if (userAccountRepository.findByEmail(email).isEmpty()) {
            UserAccount userAccount = new UserAccount(
                    demoId,
                    email,
                    passwordEncoder.encode("password"),
                    "ACTIVE",
                    Instant.now(),
                    Set.of(merchantRole)
            );
            userAccountRepository.save(userAccount);
            System.out.println("Demo user account created successfully with email: " + email);
        }

        // 4. Ensure a demo ADMIN account exists (needed for admin-only flows:
        //    activate/deactivate merchant - HU 1.4 / HU 1.5). Test enablement only.
        String adminEmail = "admin@example.com";
        AuthRole adminRole = authRoleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> authRoleRepository.save(new AuthRole("ROLE_ADMIN", "Administrator role")));
        if (userAccountRepository.findByEmail(adminEmail).isEmpty()) {
            UserAccount adminAccount = new UserAccount(
                    UUID.randomUUID(),
                    adminEmail,
                    passwordEncoder.encode("password"),
                    "ACTIVE",
                    Instant.now(),
                    Set.of(adminRole)
            );
            userAccountRepository.save(adminAccount);
            System.out.println("Demo admin account created successfully with email: " + adminEmail);
        }
    }
}
