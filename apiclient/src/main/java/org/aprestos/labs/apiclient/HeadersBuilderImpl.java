package org.aprestos.labs.apiclient;

import static java.lang.String.format;

import java.nio.charset.Charset;

import org.apache.commons.codec.binary.Base64;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

class HeadersBuilderImpl implements HeadersBuilder {

	private static final String CHARSET = "US-ASCII";
	private static final String BASIC_AUTH_FORMAT = "Basic %s";
	private static final String AUTH_HEADER = "Authorization";
	private static final String AUTH_FORMAT = "%s:%s";
	private static final String PATCH_METHOD = "patch";
	private static final String TENANT_HEADER = "tenant";

	private final MultiValueMap<String, String> header;

	public HeadersBuilderImpl() {
		header = new LinkedMultiValueMap<String, String>();
		header.add("Content-Type", "application/json");
		header.add("Accept", "application/json");
	}

	@Override
	public HeadersBuilder withAuthentication(String user, String pswd) {
		String auth = format(AUTH_FORMAT, user, pswd);
		String encodedAuth = new String(Base64.encodeBase64(auth.getBytes(Charset.forName(CHARSET))));
		String authHeader = format(BASIC_AUTH_FORMAT, encodedAuth);
		header.add(AUTH_HEADER, authHeader);
		return this;
	}

	@Override
	public HeadersBuilder withPatchOverride() {
		header.add(X_METHOD_OVERRIDE, PATCH_METHOD);
		return this;
	}

	@Override
	public HeadersBuilder withTenant(String tenant) {
		if (null != tenant)
			header.add(TENANT_HEADER, tenant);
		return this;
	}

	@Override
	public MultiValueMap<String, String> build() {
		return header;
	}

}
