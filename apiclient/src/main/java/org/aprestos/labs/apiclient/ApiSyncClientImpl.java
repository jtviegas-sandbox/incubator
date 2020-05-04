package org.aprestos.labs.apiclient;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;
import java.util.function.Predicate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

@Service
class ApiSyncClientImpl implements AsyncRestClient {

  private static final Logger LOGGER = LoggerFactory.getLogger(ApiSyncClientImpl.class);

  @Autowired
  private RestClient client;

  @Override
  public HeadersBuilder getHeadersBuilder() {
    return new HeadersBuilderImpl();
  }

  @Async
  @Override
  public <T> Future<ResponseEntity<T>> getAsyncResponse(ParameterizedTypeReference<T> type,
      MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams,
      Object... uriParams) {
    LOGGER.info("here");
    return new AsyncResult<ResponseEntity<T>>(client.getResponse(type, header, uri, null, (Object) null));
  }


  @Async
  @Override
  public <T extends Collection<E>, E> Future<Optional<E>> getAsyncFromCollection(
      ParameterizedTypeReference<T> collectionType, MultiValueMap<String, String> header, String uri,
      Predicate<E> filter, Object... uriParams) {
    return new AsyncResult<Optional<E>>(client.getFromCollection(collectionType, header, uri, filter, uriParams));
  }


  @Async
  @Override
  public <T> Future<Optional<T>> getAsync(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header,
      String uri, MultiValueMap<String, String> queryParams, Object... uriParams) {
    return new AsyncResult<Optional<T>>(client.get(type, header, uri, queryParams, uriParams));
  }



  @Async
  @Override
  public Future<Integer> getAsyncXTotalCount(MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams) {
    return new AsyncResult<Integer>(client.getXTotalCount(header, uri, queryParams, uriParams));
  }



  @Async
  @Override
  public Future<Integer> getAsyncCount(MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams) {
    return new AsyncResult<Integer>(client.getCount(header, uri, queryParams, uriParams));
  }



  @Async
  @Override
  public Future<ResponseEntity<Void>> asyncPatch(Map<String, Object> changes, MultiValueMap<String, String> header,
      String uri, Object... uriParams) {
    return new AsyncResult<ResponseEntity<Void>>(client.patch(changes, header, uri, uriParams));
  }



  @Async
  @Override
  public <I> Future<ResponseEntity<Void>> asyncPut(I body, MultiValueMap<String, String> header, String uri,
      Object... uriParams) {
    return new AsyncResult<ResponseEntity<Void>>(client.put(body, header, uri, uriParams));
  }


  @Async
  @Override
  public <I> Future<ResponseEntity<Void>> asyncPost(I body, MultiValueMap<String, String> header, String uri,
      Object... uriParams) {
    return new AsyncResult<ResponseEntity<Void>>(client.post(body, header, uri, uriParams));
  }


  @Async
  @Override
  public <I> Future<ResponseEntity<Void>> asyncPost(I body, MultiValueMap<String, String> header, String uri) {
    return new AsyncResult<ResponseEntity<Void>>(client.post(body, header, uri));
  }



  @Async
  @Override
  public <I> Future<Ident> asyncPostAndGetId(I body, MultiValueMap<String, String> header, String uri,
      Object... uriParams) {
    return new AsyncResult<Ident>(client.postAndGetId(body, header, uri, uriParams));
  }



  @Async
  @Override
  public <I> Future<Ident> asyncPostAndGetId(I body, MultiValueMap<String, String> header, String uri) {
    return new AsyncResult<Ident>(client.postAndGetId(body, header, uri, (Object[]) null));
  }


  @Async
  @Override
  public Future<ResponseEntity<Void>> asyncDelete(MultiValueMap<String, String> header, String uri,
      Object... uriParams) {
    return new AsyncResult<ResponseEntity<Void>>(client.delete(header, uri, uriParams));
  }

}
