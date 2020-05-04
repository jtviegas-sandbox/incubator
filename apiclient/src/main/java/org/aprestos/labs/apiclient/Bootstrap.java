package org.aprestos.labs.apiclient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;

@Configuration
@EnableAsync
@ComponentScan(basePackageClasses = { Bootstrap.class })
public class Bootstrap {
	@Bean
	public ObjectMapper jsonMapper() {
		return new ObjectMapper().registerModule(new ParameterNamesModule()).registerModule(new Jdk8Module())
				.registerModule(new JavaTimeModule());
	}
}
