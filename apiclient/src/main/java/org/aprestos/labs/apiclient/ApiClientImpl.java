package org.aprestos.labs.apiclient;

import java.security.KeyStore;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

import org.apache.http.client.HttpClient;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Service
class ApiClientImpl implements RestClient {

  private static final Logger LOGGER = LoggerFactory.getLogger(ApiClientImpl.class);

  private RestTemplate restTemplate;

  @Autowired
  public ApiClientImpl(@Value("${apiclient.ssl:#{null}}") final String ssl,
/*      @Value("${apiclient.auth.password:#{null}}") final String password,
      @Value("${apiclient.auth.user:#{null}}") final String authUser,*/
      @Value("${apiclient.keystorepassword:#{null}}") final String keystorePassword,
      @Value("${apiclient.keystorefile:#{null}}") final String keystoreFile) {

    boolean sslOn = false;
    if (null != ssl && Boolean.parseBoolean(ssl))
      sslOn = true;

    boolean keystoreOn = false;
    if (null != keystorePassword && null != keystoreFile && sslOn) {
      LOGGER.info("going to setup keystore");
      keystoreOn = true;
    } else
      LOGGER.info("not enough info to setup keystore");

    try {

      if (keystoreOn) {
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(keystoreFile),
            keystorePassword.toCharArray());
        SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(
            new SSLContextBuilder().loadTrustMaterial(null, new TrustSelfSignedStrategy())
                .loadKeyMaterial(keyStore, keystorePassword.toCharArray()).build(),
            NoopHostnameVerifier.INSTANCE);
        HttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory).build();

        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        restTemplate = new RestTemplate(requestFactory);
      } else {
        HttpClient httpClient = null;
        if (sslOn)
          httpClient = HttpClients.custom().setSSLHostnameVerifier(new NoopHostnameVerifier()).build();
        else
          httpClient = HttpClients.custom().build();

        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        restTemplate = new RestTemplate(requestFactory);
      }

    } catch (Exception e) {
      throw new IllegalStateException("could not load client", e);
    }
  }


  @Override
  public HeadersBuilder getHeadersBuilder() {
    return new HeadersBuilderImpl();
  }


  @Override
  public <T> ResponseEntity<T> getResponse(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header,
      String uri, MultiValueMap<String, String> queryParams, Object... uriParams) {

    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(uri);
    if (null != queryParams && !queryParams.isEmpty())
      uriBuilder.queryParams(queryParams);

    UriComponents uriComps = null != uriParams ? uriBuilder.buildAndExpand(uriParams) : uriBuilder.build();
    return restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.GET, new HttpEntity<Object>(header), type);
  }

  @Override
  public <T extends Collection<E>, E> Optional<E> getFromCollection(ParameterizedTypeReference<T> collectionType,
      MultiValueMap<String, String> header, String uri, Predicate<E> filter, Object... uriParams) {
    Optional<E> optResponse = null;

    ResponseEntity<T> response = getResponse(collectionType, header, uri, null, uriParams);
    if (null != response.getBody() && !response.getBody().isEmpty()) {
      if (null != filter)
        optResponse = response.getBody().stream().filter(filter).findFirst();
      else
        optResponse = response.getBody().stream().findFirst();
    } else
      optResponse = Optional.empty();

    return optResponse;
  }


  @Override
  public <T> Optional<T> get(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams) {
    Optional<T> optResponse = null;

    ResponseEntity<T> response = getResponse(type, header, uri, queryParams, uriParams);
    optResponse = null != response.getBody() ? Optional.of((T) response.getBody()) : Optional.empty();

    return optResponse;
  }


  @Override
  public int getXTotalCount(MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams,
      Object... uriParams) {

    ResponseEntity<Object> response = getResponse(new ParameterizedTypeReference<Object>() {
    }, header, uri, queryParams, uriParams);
    return Integer.parseInt(response.getHeaders().get("X-Total-Count").get(0));

  }


  @Override
  public int getCount(MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams,
      Object... uriParams) {

    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(uri);
    if (null != queryParams && !queryParams.isEmpty())
      uriBuilder.queryParams(queryParams);

    UriComponents uriComps = null != uriParams ? uriBuilder.buildAndExpand(uriParams) : uriBuilder.build();

    ResponseEntity<List<Object>> response = restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.GET,
        new HttpEntity<Object>(header), new ParameterizedTypeReference<List<Object>>() {
        });

    return response.getBody().size();
  }

  @Override
  public ResponseEntity<Void> patch(Map<String, Object> changes, MultiValueMap<String, String> header, String uri,
      Object... uriParams) {
    ResponseEntity<Void> response = null;
    UriComponents uriComps = UriComponentsBuilder.fromHttpUrl(uri).buildAndExpand(uriParams);
    response = restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.PATCH,
        new HttpEntity<Map<String, Object>>(changes, header), Void.class);
    return response;
  }


  @Override
  public <I> ResponseEntity<Void> put(I body, MultiValueMap<String, String> header, String uri, Object... uriParams) {
    ResponseEntity<Void> response = null;

    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(uri);
    UriComponents uriComps = null != uriParams ? uriBuilder.buildAndExpand(uriParams) : uriBuilder.build();

    response = restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.PUT, new HttpEntity<I>(body, header),
        new ParameterizedTypeReference<Void>() {
        });
    return response;
  }


  @Override
  public <I> ResponseEntity<Void> post(I body, MultiValueMap<String, String> header, String uri, Object... uriParams) {
    ResponseEntity<Void> response = null;

    UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(uri);
    UriComponents uriComps = null != uriParams ? uriBuilder.buildAndExpand(uriParams) : uriBuilder.build();

    response = restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.POST, new HttpEntity<I>(body, header),
        new ParameterizedTypeReference<Void>() {
        });
    return response;
  }


  @Override
  public <I> ResponseEntity<Void> post(I body, MultiValueMap<String, String> header, String uri) {
    return post(body, header, uri, (Object[]) null);
  }


  @Override
  public <I> Ident postAndGetId(I body, MultiValueMap<String, String> header, String uri, Object... uriParams) {
    ResponseEntity<Void> response = post(body, header, uri, uriParams);
    String location = response.getHeaders().getFirst("Location");
    return Ident.create(location.substring(location.lastIndexOf('/') + 1));
  }


  @Override
  public <I> Ident postAndGetId(I body, MultiValueMap<String, String> header, String uri) {
    return postAndGetId(body, header, uri, (Object[]) null);
  }


  @Override
  public ResponseEntity<Void> delete(MultiValueMap<String, String> header, String uri, Object... uriParams) {
    UriComponents uriComps = UriComponentsBuilder.fromHttpUrl(uri).buildAndExpand(uriParams);
    return restTemplate.exchange(uriComps.encode().toUri(), HttpMethod.DELETE, new HttpEntity<Object>(header), void.class);
  }

}
