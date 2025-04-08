package com.prat.websgrpc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebsgrpcApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebsgrpcApplication.class, args);
	}

}
