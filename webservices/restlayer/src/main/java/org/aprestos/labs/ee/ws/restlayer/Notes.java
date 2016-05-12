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

import org.aprestos.labs.ee.dataservices.services.NoteService;
import org.aprestos.labs.ee.domainmodel.notes.Note;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.ContextLoader;

/**
 * Root resource (exposed at "myresource" path)
 */

@Path("/notes")
public class Notes {

	@Autowired
	private NoteService noteService;
	
	
	protected NoteService getService()
    {
    	if(null == this.noteService)
    	{
    		this.noteService = (NoteService) 
        			ContextLoader.getCurrentWebApplicationContext().getBean("noteService");
    	}
    
    	return this.noteService;
    }
    
	
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/test")
    public Note getTest(){
    	Note o = new Note("myaccount","my quote is your quote",1,1,0);
    	o.setId(new ObjectId().toString());
    	
    	return o;
    }
    
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/add")
    public Note postNote(Note note){
    	return getService().save(note);
    }
    
    @GET
    @Produces("application/json")
    @Path("/{id}")
    public Note getNote(@PathParam("id") String id){
    	Note o = getService().findOne(id);
    	return o;
    }
    
    @DELETE
    @Path("/delete/{id}")
    public void deleteNote(@PathParam("id") String id){
    	getService().delete(id);
    }
    
    @DELETE
    @Path("/delete/all")
    public void deleteAllNotes(){
    	getService().deleteAll();;
    }
    
    @GET
    @Produces("application/json")
    @Path("/all")
    public List<Note> getAllNotes(){
    	List<Note> result = new LinkedList<Note>();
    	Iterator<Note> iterator = getService().findAll().iterator();
    	while(iterator.hasNext())
    		result.add(iterator.next());
    	
    	return result;
    }
    
    
}
