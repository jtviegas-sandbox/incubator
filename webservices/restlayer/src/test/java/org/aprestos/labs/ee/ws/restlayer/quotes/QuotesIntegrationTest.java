package org.aprestos.labs.ee.ws.restlayer.quotes;

import java.util.List;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;

import org.aprestos.labs.ee.domainmodel.quotes.Quote;
import org.bson.types.ObjectId;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.resteasy.client.jaxrs.internal.ClientResponse;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

public class QuotesIntegrationTest {

	//private static final String URL = "http://weblabs-aprestos.rhcloud.com/restlayer/quotes";
	private static final String URL = "http://localhost:9080/restlayer-1.0-SNAPSHOT/quotes";
	//private static final String URL = "http://localhost:9080/restlayer/quotes";
	
	@BeforeClass
	public static void init() throws Exception {
		
	}

	@AfterClass
	public static void stop() throws Exception {
		
	}

	/*
	@Test
	public void testQuote2Test() throws Exception {
		
		WebClient client = WebClient.create("http://localhost:9080/restlayer-1.0-SNAPSHOT");
		//Quote quote = client.path("/quotes/test").accept("application/json").get(Quote.class);
		client.path("/quotes/test").accept("application/json").
		Quote quote = client.path("/quotes/test").accept("application/json").get(new GenericType()());
		Assert.assertNotNull(quote);
		
		
		try {
			Client client = ClientBuilder.newBuilder().newClient();
			WebTarget target = client.target("http://localhost:9080/restlayer-1.0-SNAPSHOT/quotes/test");
			//target = target.path("/quotes/test");
			Invocation.Builder builder = target.request().accept(MediaType.APPLICATION_JSON);
			Response response = builder.get();
			Quote quote = builder.get(Quote.class);
			Assert.assertNotNull(quote);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	*/
	
	@Test
	public void testQuotesTest() throws Exception {

		try {
			ResteasyClient client = new ResteasyClientBuilder().build();
			ResteasyWebTarget target = client.target( URL + "/test");
			
			ClientResponse response = (ClientResponse) target.request().get();
			Quote quote = response.readEntity(Quote.class);
			Assert.assertNotNull(quote);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
	}
	
	
	
	@Test
	public void testQuotePost() throws Exception {

		Quote received = null;
		Quote quote = new Quote("jonas", "ola ri lo lela");
		quote.setId(new ObjectId().toString());
		
		ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target( URL + "/add");
        
       ClientResponse response = (ClientResponse) target.request().post(Entity.entity(quote, MediaType.APPLICATION_JSON));
      
       if (response.getStatus() != 200)
    	   throw new RuntimeException("Failed : HTTP error code : " + response.getStatus() + " | " + response.getStatusInfo());
    	       
        received = response.readEntity(Quote.class);
        
        Assert.assertEquals(" Author not equal", received.getAuthor(), quote.getAuthor() );
        Assert.assertEquals(" Text not equal", received.getText(), quote.getText() );
       
        response.close();
	}
	
	@Test
	public void testQuoteCount() throws Exception {

		
		ResteasyClient client = new ResteasyClientBuilder().build();
		
        ResteasyWebTarget target = client.target( URL + "/all");
        ClientResponse response = (ClientResponse) target.request().get();
        List<Quote> quotes = response.readEntity(new GenericType<List<Quote>>(){});
        
        int count1 = quotes.size();

        Quote received = null;
		Quote quote = new Quote("jonas", "ola ri lo lela");
		quote.setId(new ObjectId().toString());
        target = client.target( URL + "/add");
        response = (ClientResponse) target.request().post(Entity.entity(quote, MediaType.APPLICATION_JSON));
       
        if (response.getStatus() != 200)
     	   throw new RuntimeException("Failed : HTTP error code : " + response.getStatus() + " | " + response.getStatusInfo());
        
        received = response.readEntity(Quote.class);
        
        target = client.target( URL + "/all");
        response = (ClientResponse) target.request().get();
        quotes = response.readEntity(new GenericType<List<Quote>>(){});
        
        int count2 = quotes.size();
        
        Assert.assertEquals(count2, ++count1);
        response.close();
        
	}

	/*
	@Test
	public void testQuotesCount() throws Exception {

		Quote received = null;
		Quote quote = new Quote("jonas", "ola ri lo lela");
		
		ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target( URL + "/quotes");
        ClientResponse response = (ClientResponse) target.request().post(Entity.entity(quote, "application/json"));
        received = response.readEntity(Quote.class);
        
        ClientResponse response = (ClientResponse) target.request().post(Entity.entity(quote, "application/json"));
        received = response.readEntity(List<Quote.class>);
        
        Assert.assertEquals(" Author not equal", received.getAuthor(), quote.getAuthor() );
        Assert.assertEquals(" Text not equal", received.getText(), quote.getText() );
       
        //Read output in string format
        System.out.println(response.getStatus());
        response.close();
    
        
	}

	*/

}
