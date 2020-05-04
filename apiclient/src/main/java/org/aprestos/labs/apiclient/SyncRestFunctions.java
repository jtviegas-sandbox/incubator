package org.aprestos.labs.apiclient;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;

interface SyncRestFunctions {

  <T> ResponseEntity<T> getResponse(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header,
      String uri, MultiValueMap<String, String> queryParams, Object... uriParams);

  <T extends Collection<E>, E> Optional<E> getFromCollection(ParameterizedTypeReference<T> collectionType,
      MultiValueMap<String, String> header, String uri, Predicate<E> filter, Object... uriParams);

  <T> Optional<T> get(ParameterizedTypeReference<T> type, MultiValueMap<String, String> header, String uri,
      MultiValueMap<String, String> queryParams, Object... uriParams);

  int getXTotalCount(MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams,
      Object... uriParams);

  int getCount(MultiValueMap<String, String> header, String uri, MultiValueMap<String, String> queryParams,
      Object... uriParams);

  ResponseEntity<Void> patch(Map<String, Object> changes, MultiValueMap<String, String> header, String uri,
      Object... uriParams);

  <I> ResponseEntity<Void> put(I body, MultiValueMap<String, String> header, String uri, Object... uriParams);

  <I> ResponseEntity<Void> post(I body, MultiValueMap<String, String> header, String uri, Object... uriParams);

  <I> ResponseEntity<Void> post(I body, MultiValueMap<String, String> header, String uri);

  <I> Ident postAndGetId(I body, MultiValueMap<String, String> header, String uri, Object... uriParams);

  <I> Ident postAndGetId(I body, MultiValueMap<String, String> header, String uri);

  ResponseEntity<Void> delete(MultiValueMap<String, String> header, String uri, Object... uriParams);

}