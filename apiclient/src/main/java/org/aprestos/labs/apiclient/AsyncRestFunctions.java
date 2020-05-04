package org.aprestos.labs.apiclient;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Future;
import java.util.function.Predicate;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.MultiValueMap;

interface AsyncRestFunctions extends BaseRestFunctions {

  @Async
  <T> Future<ResponseEntity<T>> getAsyncResponse(ParameterizedTypeReference<T> type,
      MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams, Object... uriParams);

  @Async
  <T extends Collection<E>, E> Future<Optional<E>> getAsyncFromCollection(ParameterizedTypeReference<T> collectionType,
      MultiValueMap<String, String> header, String uri, Predicate<E> filter, Object... uriParams);

  @Async
  <T> Future<Optional<T>> getAsync(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams);

  @Async
  Future<Integer> getAsyncXTotalCount(MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams);

  @Async
  Future<Integer> getAsyncCount(MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams);

  @Async
  Future<ResponseEntity<Void>> asyncPatch(Map<String, Object> changes, MultiValueMap<String, String> header, String uri,
      Object... uriParams);

  @Async
  <I> Future<ResponseEntity<Void>> asyncPut(I body, MultiValueMap<String, String> header, String uri,
      Object... uriParams);

  @Async
  <I> Future<ResponseEntity<Void>> asyncPost(I body, MultiValueMap<String, String> header, String uri,
      Object... uriParams);

  @Async
  <I> Future<ResponseEntity<Void>> asyncPost(I body, MultiValueMap<String, String> header, String uri);

  @Async
  <I> Future<Ident> asyncPostAndGetId(I body, MultiValueMap<String, String> header, String uri, Object... uriParams);

  @Async
  <I> Future<Ident> asyncPostAndGetId(I body, MultiValueMap<String, String> header, String uri);

  @Async
  Future<ResponseEntity<Void>> asyncDelete(MultiValueMap<String, String> header, String uri, Object... uriParams);

}