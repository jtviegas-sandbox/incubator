package org.aprestos.labs.ee.ws.restlayer;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.aprestos.labs.ee.ws.restlayer.auth.Auth;

@ApplicationPath("/")
public class App extends Application {
	
	 @Override
     public Set<Class<?>> getClasses()
     {
        HashSet<Class<?>> classes = new HashSet<Class<?>>();
        classes.add(Quotes.class);
        classes.add(Notes.class);
        classes.add(Auth.class);
        return classes;
     }
	 
	
}
