package org.aprestos.labs.ee.ws.restlayer.auth;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.aprestos.labs.ee.domainmodel.auth.Authinfo;
import org.bson.types.ObjectId;

/**
 * Root resource (exposed at "myresource" path)
 */

@Path("/auth")
public class Auth {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/twitter/test")
    public Authinfo test(){
    	
    	Authinfo o = new Authinfo("reqtoken","accountid","sessionId");
    	o.setId(new ObjectId().toString());
    	
    	return o;
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/twitter/get/reqtoken")
    public Authinfo getRequestToken() throws AuthException{
    	
    	Authinfo result = null;
    	
    	Twitter o = new Twitter();
    	result = o.connect();
    	
    	return result;
    	
    }

    
}
