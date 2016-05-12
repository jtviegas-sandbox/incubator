package org.aprestos.labs.ee.ws.restlayer.auth;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

import org.apache.http.HttpException;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.ParseException;
import org.apache.http.impl.DefaultBHttpClientConnection;
import org.apache.http.message.BasicHttpEntityEnclosingRequest;
import org.apache.http.protocol.HttpCoreContext;
import org.apache.http.protocol.HttpProcessor;
import org.apache.http.protocol.HttpProcessorBuilder;
import org.apache.http.protocol.HttpRequestExecutor;
import org.apache.http.protocol.RequestConnControl;
import org.apache.http.protocol.RequestContent;
import org.apache.http.protocol.RequestExpectContinue;
import org.apache.http.protocol.RequestTargetHost;
import org.apache.http.protocol.RequestUserAgent;
import org.apache.http.util.EntityUtils;
import org.aprestos.labs.ee.domainmodel.auth.Authinfo;

public class Twitter {

	private String twitter_consumer_key = "0hH6ntFnAjA7nhpHBhIRA";
	private String twitter_consumer_secret = "K56dcSIOFoWrKEx14CvoCFrcXzzDHo4raA9BcOeVg";

	private static final String[] DEFAULT_PARAMETERS = { "oauth_consumer_key",
			"oauth_nonce", "oauth_signature_method", "oauth_timestamp",
			"oauth_token", "oauth_version" };
	private static final String[] HEADER_PARAMETERS = { "oauth_consumer_key",
			"oauth_nonce", "oauth_signature", "oauth_signature_method",
			"oauth_timestamp", "oauth_token", "oauth_version" };

	private String getSignatureString(Map<String, String> context) {
		StringBuffer result = new StringBuffer();

		result.append(context.get("http_method").toUpperCase());
		result.append("&");
		result.append(AuthUtils.encode(context.get("base_url")));
		result.append("&");
		result.append(AuthUtils.encode(context.get("parameter_string")));

		return result.toString();
	}

	private String getSigningKey(Map<String, String> context) {
		StringBuffer result = new StringBuffer();
		String token = null;

		result.append(context.get("oauth_consumer_secret"));
		result.append("&");

		token = context.get("oauth_token_secret");
		if (null != token)
			result.append(token);

		return result.toString();
	}

	public Map<String, String> loadContext(Map<String, String> context)
			throws UnsupportedEncodingException, GeneralSecurityException {

		context.put("oauth_consumer_key", twitter_consumer_key);
		context.put("oauth_consumer_secret", twitter_consumer_secret);
		context.put("oauth_nonce",
				UUID.randomUUID().toString().replaceAll("-", ""));
		context.put("oauth_signature_method", "HMAC-SHA1");
		context.put("oauth_timestamp", (new Long(Calendar.getInstance()
				.getTimeInMillis() / 1000)).toString());
		context.put("oauth_version", "1.0");
		context.put("http_method", "POST");
		context.put("base_url", "https://api.twitter.com/oauth/request_token");
		context.put("base_url_host", "api.twitter.com");
		context.put("base_url_path", "/oauth/request_token");

		context.put(
				"parameter_string",
				AuthUtils.getParameterString(context,
						Arrays.asList(DEFAULT_PARAMETERS)));
		context.put("signature_string", getSignatureString(context));
		context.put("signing_key", getSigningKey(context));

		context.put("oauth_signature", AuthUtils.computeSignature(
				context.get("signature_string"), context.get("signing_key")));

		return context;
	}

	private String getHeaderString(Map<String, String> _context) {
		StringBuffer result = new StringBuffer();

		result.append("OAuth");
		result.append(" ");
		result.append(AuthUtils.getHeaderString(_context,
				Arrays.asList(HEADER_PARAMETERS)));

		return result.toString();
	}

	public Authinfo connect() throws AuthException {

		Authinfo result = null;
		DefaultBHttpClientConnection conn = null;
		Map<String, String> twitterContext = null;
		String headerString = null;

		try {

			twitterContext = loadContext(new HashMap<String, String>());
			headerString = getHeaderString(twitterContext);

			SSLContext sslcontext = SSLContext.getInstance("TLS");
			sslcontext.init(null, null, null);
			SSLSocketFactory sf = sslcontext.getSocketFactory();
			SSLSocket socket = (SSLSocket) sf.createSocket();
			HttpHost host = new HttpHost(twitterContext.get("base_url_host"),
					443);
			socket.connect(
					new InetSocketAddress(host.getHostName(), host.getPort()),
					0);

			conn = new DefaultBHttpClientConnection(8 * 1204);
			conn.bind(socket);

			BasicHttpEntityEnclosingRequest request = new BasicHttpEntityEnclosingRequest(
					twitterContext.get("http_method"),
					twitterContext.get("base_url_path"), HttpVersion.HTTP_1_1);
			request.addHeader("Authorization", headerString);

			/*
			 * request2.setEntity(new StringEntity("",
			 * "application/x-www-form-urlencoded", "UTF-8"));
			 */

			HttpProcessor httpproc = HttpProcessorBuilder.create()
					// Required protocol interceptors
					.add(new RequestContent()).add(new RequestTargetHost())
					// Recommended protocol interceptors
					.add(new RequestConnControl())
					.add(new RequestUserAgent("Client-HTTP/1.1"))
					// Optional protocol interceptors
					.add(new RequestExpectContinue(true)).build();

			HttpRequestExecutor httpexecutor = new HttpRequestExecutor();

			HttpCoreContext context = HttpCoreContext.create();

			context.setAttribute(HttpCoreContext.HTTP_CONNECTION, conn);
			context.setAttribute(HttpCoreContext.HTTP_TARGET_HOST, host);
			// request for the token
			httpexecutor.preProcess(request, httpproc, context);
			HttpResponse response = httpexecutor
					.execute(request, conn, context);
			httpexecutor.postProcess(response, httpproc, context);
			
			if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
				result = new Authinfo();
				/* oauth_token=v8sAjjZUnVNZoV1DSdC6thZgfEhABa0S
				&oauth_token_secret=zUT3q3Pqn7d7mTwv0KQsNtQfUwXHZ2EN
				&oauth_callback_confirmed=true */
				result.setRequestToken(AuthUtils.getHttpBodyValue(response.getEntity(), DEFAULT_PARAMETERS[4]));
			}
			else {
				throw new AuthException(response.getStatusLine().getStatusCode());
			}

			
			return result;

		} catch (Exception e) {
			throw new AuthException(e);
		} finally {
			if (null != conn)
				try {
					conn.close();
				} catch (IOException e) {e.printStackTrace();}
		}
	}

}
