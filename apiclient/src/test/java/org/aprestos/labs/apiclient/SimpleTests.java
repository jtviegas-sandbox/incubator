package org.aprestos.labs.apiclient;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.aprestos.labs.apiclient.AsyncRestClient;
import org.aprestos.labs.apiclient.RestClient;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.MultiValueMap;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SimpleTests {

  @Autowired
  private RestClient client;
  
  @Autowired
  private AsyncRestClient asyncClient;

  @Test
  public void test() throws InterruptedException, ExecutionException {

    MultiValueMap<String, String> headers = client.getHeadersBuilder().build();

    Future<ResponseEntity<String>> asyncRespFuture = asyncClient.getAsyncResponse(new ParameterizedTypeReference<String>() {
    }, headers, "http://www.google.com:80/", null, (Object) null);
    System.out.println("doing");

    
    ResponseEntity<String> syncResponse = client.getResponse(new ParameterizedTypeReference<String>() {
    }, headers, "http://www.google.com:80/", null, (Object) null);
    
    ResponseEntity<String> asyncResponse = asyncRespFuture.get();
    
    Assert.assertNotEquals(asyncResponse.getBody(), syncResponse.getBody());
    Assert.assertEquals(HttpStatus.OK, asyncResponse.getStatusCode());
    Assert.assertEquals(HttpStatus.OK, syncResponse.getStatusCode());

    System.out.println("done");
  }

}
