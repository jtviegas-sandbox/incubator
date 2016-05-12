package org.aprestos.labs.ee.ws.restlayer.auth;

public class AuthException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private int statusCode;

	public AuthException() {
	}

	public AuthException(String message) {
		super(message);
	}

	public AuthException(Throwable cause) {
		super(cause);
	}

	public AuthException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public AuthException(int _statusCode) {
		super();
		this.statusCode = _statusCode;
	}

	public AuthException(String message, int _statusCode) {
		super(message);
		this.statusCode = _statusCode;
	}

	public AuthException(Throwable cause, int _statusCode) {
		super(cause);
		this.statusCode = _statusCode;
	}

	public AuthException(String message, Throwable cause, int _statusCode) {
		super(message, cause);
		this.statusCode = _statusCode;
	}

	public int getStatusCode() {
		return statusCode;
	}
	
	

}
