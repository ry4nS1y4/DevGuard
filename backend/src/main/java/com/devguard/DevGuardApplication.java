package com.devguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DevGuardApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevGuardApplication.class, args);
    }
}
