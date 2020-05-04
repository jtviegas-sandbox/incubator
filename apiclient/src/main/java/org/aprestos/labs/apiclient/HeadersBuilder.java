package org.aprestos.labs.apiclient;

import org.springframework.util.MultiValueMap;

public interface HeadersBuilder {
  String X_METHOD_OVERRIDE = "X-HTTP-Method-Override";
  
  HeadersBuilder withAuthentication(String user, String pswd);

  HeadersBuilder withPatchOverride();

  HeadersBuilder withTenant(String tenant);

  MultiValueMap<String, String> build();

  static HeadersBuilder create(){
    return new HeadersBuilderImpl();
  }

}