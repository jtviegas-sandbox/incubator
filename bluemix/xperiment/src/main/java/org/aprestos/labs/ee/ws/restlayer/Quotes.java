package org.aprestos.labs.ee.ws.restlayer;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.aprestos.labs.ee.dataservices.services.QuoteService;
import org.aprestos.labs.ee.domainmodel.quotes.Quote;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.ContextLoader;

/**
 * Root resource (exposed at "myresource" path)
 */

@Path("/quotes")
public class Quotes {

	@Autowired
	private QuoteService quoteService;
	
	
	protected QuoteService getService()
    {
    	if(null == this.quoteService)
    	{
    		this.quoteService = (QuoteService) 
        			ContextLoader.getCurrentWebApplicationContext().getBean("quoteService");
    	}
    
    	return this.quoteService;
    }
    
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/test")
    public Quote getTest(){
    	Quote o = new Quote("john","my quote is your quote");
    	o.setId(new ObjectId().toString());
    	
    	return o;
    }
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/add")
    public Quote postQuote(Quote quote){
    	return getService().save(quote);
    }
    
    @GET
    @Produces("application/json")
    @Path("/{id}")
    public Quote getQuote(@PathParam("id") String id){
    	Quote o = getService().findOne(id);
    	return o;
    }
    
    @DELETE
    @Path("/delete/{id}")
    public void deleteQuote(@PathParam("id") String id){
    	getService().delete(id);
    }
    
    @DELETE
    @Path("/delete/all")
    public void deleteAllQuotes(){
    	getService().deleteAll();;
    }
    
    @GET
    @Produces("application/json")
    @Path("/all")
    public List<Quote> getAllQuotes(){
    	List<Quote> result = new LinkedList<Quote>();
    	Iterator<Quote> iterator = getService().findAll().iterator();
    	while(iterator.hasNext())
    		result.add(iterator.next());
    	
    	return result;
    }
    
    
}
