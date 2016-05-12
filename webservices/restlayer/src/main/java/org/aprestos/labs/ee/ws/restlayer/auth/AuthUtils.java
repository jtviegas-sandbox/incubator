package org.aprestos.labs.ee.ws.restlayer.auth;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedSet;
import java.util.StringTokenizer;
import java.util.TreeSet;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.ParseException;
import org.apache.http.entity.ContentType;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.Args;
import org.apache.http.util.CharArrayBuffer;

public class AuthUtils {

	public static String encode(String value) {
		String encoded = null;
		try {
			encoded = URLEncoder.encode(value, "UTF-8");
		} catch (UnsupportedEncodingException ignore) {
		}
		StringBuilder buf = new StringBuilder(encoded.length());
		char focus;
		for (int i = 0; i < encoded.length(); i++) {
			focus = encoded.charAt(i);
			if (focus == '*') {
				buf.append("%2A");
			} else if (focus == '+') {
				buf.append("%20");
			} else if (focus == '%' && (i + 1) < encoded.length()
					&& encoded.charAt(i + 1) == '7'
					&& encoded.charAt(i + 2) == 'E') {
				buf.append('~');
				i += 2;
			} else {
				buf.append(focus);
			}
		}
		return buf.toString();
	}

	public static String computeSignature(String baseString, String keyString)
			throws GeneralSecurityException, UnsupportedEncodingException {
		SecretKey secretKey = null;

		byte[] keyBytes = keyString.getBytes();
		secretKey = new SecretKeySpec(keyBytes, "HmacSHA1");

		Mac mac = Mac.getInstance("HmacSHA1");
		mac.init(secretKey);

		byte[] text = baseString.getBytes();

		return new String(Base64.encodeBase64(mac.doFinal(text))).trim();
	}

	public static SortedSet<String> sortAlphabetically(Set<String> set) {
		TreeSet<String> sorted = new TreeSet<String>(
				String.CASE_INSENSITIVE_ORDER);
		sorted.addAll(set);
		return sorted;
	}
	
	public static String getParameterString(Map<String, String> context,
			List<String> params) {
		StringBuffer result = new StringBuffer();

		Set<String> sortedKeys = AuthUtils.sortAlphabetically(context.keySet());
		for (String key : sortedKeys) {

			if (params.contains(key))
				result.append((0 == result.length() ? "" : "&")
						+ AuthUtils.encode(key) + "="
						+ AuthUtils.encode(context.get(key)));

		}

		return result.toString();
	}

	public static String getHeaderString(Map<String, String> context,
			List<String> params) {
		StringBuffer result = new StringBuffer();

		Set<String> sortedKeys = AuthUtils.sortAlphabetically(context.keySet());
		for (String key : sortedKeys) {

			if (params.contains(key))
				result.append((0 == result.length() ? "" : ", ")
						+ AuthUtils.encode(key) + "=\""
						+ AuthUtils.encode(context.get(key)) + "\"");

		}

		return result.toString();
	}
	
	public static String getHttpBodyValue(final HttpEntity entity, final String _key) throws ParseException, IOException{
		
		String result = null, body = null, key = null;
		StringTokenizer tokenizer = null;
		//oauth_token=v8sAjjZUnVNZoV1DSdC6thZgfEhABa0S&oauth_token_secret=zUT3q3Pqn7d7mTwv0KQsNtQfUwXHZ2EN&oauth_callback_confirmed=true
		
		body = getHttpBody(entity);
		tokenizer = new StringTokenizer(body, "=&");
		
		while(tokenizer.hasMoreTokens()) {
			key = tokenizer.nextToken(); 
			if(_key.equals(key)){
				result = tokenizer.nextToken();
				break;
			}
		} 
		
		return result;
	}
	
	
	
	public static String getHttpBody(final HttpEntity entity) throws IOException, ParseException {
		
        Args.notNull(entity, "Entity");
        final InputStream instream = entity.getContent();
        if (instream == null) {
            return null;
        }
        try {
            Args.check(entity.getContentLength() <= Integer.MAX_VALUE,
                    "HTTP entity too large to be buffered in memory");
            int i = (int)entity.getContentLength();
            if (i < 0) {
                i = 4096;
            }
            Charset charset = null;
            try {
                final ContentType contentType = ContentType.get(entity);
                if (contentType != null) {
                    charset = contentType.getCharset();
                }
            } catch (final UnsupportedCharsetException ex) {
                throw new UnsupportedEncodingException(ex.getMessage());
            }
            if (charset == null) {
                charset = HTTP.DEF_CONTENT_CHARSET;
            }
            final Reader reader = new InputStreamReader(instream, charset);
            final CharArrayBuffer buffer = new CharArrayBuffer(i);
            final char[] tmp = new char[1024];
            int l;
            while((l = reader.read(tmp)) != -1) {
                buffer.append(tmp, 0, l);
            }
            return buffer.toString();
        } finally {
            instream.close();
        }
    }

}
