---
title: Authentication
description: Authentication
---
# Authentication

In the Settle API different authentication levels ***(Auth Levels)*** can be achieved depending on the authentication method being used. In the [API Reference](/api/merchant/) the required level for each endpoint in the API is given. A list is given here of the **Auth Levels** in the Settle API, ordered from lowest to highest level:

1. OPEN *(no authentication required)*
2. [**JWT** *(Shared Secret)*](#authentication-using-secret)
3. [**RSA** *(Private/Public Keypair)*](#authentication-using-rsa-signature)

When authenticated with a particular **Auth Level**, the client is also authorized for endpoints requiring a lower authentication level. E.g. if authenticated with **Auth Level** [](/guides/authentication/#authentication-using-rsa-signature)RSA, endpoints requiring [JWT](/guides/authentication/#authentication-using-secret) or OPEN are also accessible.

## Required Request Headers

Any request to the Settle API requires the following request headers:

#### X-Settle-Merchant

This header should contain the Settle ID of the merchant as returned in the `id` field of the [ `merchant.profile.get` ](/api/reference/rest/v1/merchant.profile/get/) endpoint.

#### X-Settle-User

The ID of the user/client doing the request on behalf of the Merchant. Users are created by the Merchant through the Self Service Portal or by the Integrator using the [`merchant.apiKeys.create`](/api/reference/rest/v1/merchant.apiKeys/create/) endpoint. Each **X-Settle-User** has an ID locally unique for the Merchant and is assigned a **JWT** *(Shared Secret)* and/or an **RSA** Public Key that is used for authentication.

#### Authorization

The value of this field depends on what kind of authentication scheme is being used. Currently the supported schemes are **JWT** *(Shared Secret)* and **RSA-SHA256**.

The general form of this header is:

`Authorization: <auth_scheme> <auth_data>`

#### X-Settle-Integrator

Only to be used by integrators acting as a proxy on behalf of a Merchant client, in which case it replaces the **X-Settle-User** header. The value of this field is the ID issued to the integrator by Settle. When this header is used only authentication using **RSA** signatures is allowed *(not secret)* and Settle will check the signature against the public key of the integrator.

::: tip NOTE
When using the Settle testbed environment, an **X-Testbed-Token** header is also required. The value of this header is the testbed token you received via email when activating your testbed account. It looks like:

`s_Qu1gkYsZUvK-RvO43Ij02CYV-3wyMp5uUn1AodymQ`
:::

::: tip NOTE
The **X-Auka-Integrator** header MUST NOT be used unless the merchant clients are communicating *through* a server, controlled by the integrator, acting as a proxy. If a client is using a direct connection to Settle, even though the integrator owns the client and may control it through some other channel, it MUST use merchant user credentials and the **X-Auka-User** header.
:::

## Authentication using JWT

* **Auth Level:** JWT

Authentication using a shared secret (JSON Web Token) is the simplest authentication method supported by Settle. This method requires an authorization header on the following form:

`Authorization: SECRET <secret>`

Below is an example of a request where user **POS1** is doing an **HTTP POST** to **https://sever.test/some/resource/** on behalf of a merchant whose ID is **T9oWAQ3FSl6oeITuR2ZGWA**. The secret is **MySecretPassword** and the request body is `{"text": "Hello world"}`.

```http
POST /some/resource/ HTTP/1.1
HOST: server.test
Accept: application/vnd.mcash.api.merchant.v1+json
Content-Type: application/json
X-Auka-Merchant: T9oWAQ3FSl6oeITuR2ZGWA
X-Auka-User: POS1
Authorization: SECRET MySecretPassword

{"text": "Hello world"}
```

## Authentication using RSA signature

* **Auth Level:** RSA

Settle generates and validates according to the *PKCS#1 v1.5* (RSASSA-PKCS1-v1_5) standard described in **[RFC 3447](http://tools.ietf.org/html/rfc3447.html)**. The hash function used in the signing procedure is [SHA256](https://en.wikipedia.org/wiki/SHA-2).

### Headers

The RSA authentication method requires two extra headers:

#### X-Auka-Timestamp

> The current UTC time. The time format is `YYYY-MM-DD hh:mm:ss`.

#### X-Auka-Content-Digest

> The *base64* encoded hash digest of the request body. If the body is empty, the hash should be computed on an empty string. The value of the header should be on the form `<algorithm (uppercase)>=<digest value>`. So, if the SHA256 hashing algorithm is used on a request with empty body, the header will be: `X-Auka-Content-Digest: SHA256=47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=` Currently only the SHA256 hashing algorithm is supported.

For RSA authentication the authorization header looks like this:

```http
Authorization: RSA-SHA256 <rsa_signature>
```

The string that is to be signed (the signature message) is constructed from the request in the following manner:

```
<method>|<url>|<headers>
```

Here, `method` is the HTTP method used in the request, `url` is the full url including protocol and query component (the part after `?`) but without fragment component (The part after `#`). The `scheme name` (typically https) and `hostname` components are always lowercase, while the rest of the `url` is case sensitive. The `headers` part is a querystring using header names and values as key-value pairs. So, the constructed string will be of the form:

```
name1=value1&name2=value2...
```

::: tip In addition the following requirements apply:

1. Headers are sorted alphabetically.
2. All header names must be made uppercase before constructing the string.
3. Headers whose names don't start with **X-Auka-** are excluded.
   :::

Reusing the example in the previous section, a typical HTTP request will look like this:

```http
POST /some/resource/ HTTP/1.1
HOST: server.test
Accept: application/vnd.mcash.api.merchant.v1+json
Content-Type: application/json
X-Auka-Merchant: T9oWAQ3FSl6oeITuR2ZGWA
X-Auka-User: POS1
X-Auka-Timestamp: 2013-10-05 21:33:46
X-Auka-Content-Digest: SHA256=oWVxV3hhr8+LfVEYkv57XxW2R1wdhLsrfu3REAzmS7k=
Authorization: RSA-SHA256 p8+PdS5dDa6Ig46jNQhE8qQR+J8rRgX77cyXN3EIvUqpQ2lB8Cz1bcUF6lwvdVbz4NSUIQD/OCT8X2WtqRNbPW+5DDzGC1TytiV6p0EXiMOAl7s6kioHnVGaiCSHyfO6ZYB7ubtcMtUE0+7OEUcPeaqSHeL4wwUkO8W0+euwGsfwl9gOoQHBFIOh0bh8z3JNGhUeIZM8fvrk+8kj/s2A70IBvUOLwcFeP8uf6gTi1fz7BtgJ5rHmfvn9HvrsyO53/nx2mXZdAap4MfOZa6dp0ievZ5kU1vEfB2R6f4uPHzKLnaePlDOQMTk+uHlxU0ChkSqenbgJvpGuaOGiQekwsA==

{"text": "Hello world"}
```

In this case the header part of the signature message is:

```http
X-AUKA-CONTENT-DIGEST=SHA256=oWVxV3hhr8+LfVEYkv57XxW2R1wdhLsrfu3REAzmS7k=&X-AUKA-MERCHANT=T9oWAQ3FSl6oeITuR2ZGWA&X-AUKA-TIMESTAMP=2013-10-05 21:33:46&X-AUKA-USER=POS1
```

and complete signature message is:

```http
POST|http://server.test/some/resource/|X-AUKA-CONTENT-DIGEST=SHA256=oWVxV3hhr8+LfVEYkv57XxW2R1wdhLsrfu3REAzmS7k=&X-AUKA-MERCHANT=T9oWAQ3FSl6oeITuR2ZGWA&X-AUKA-TIMESTAMP=2013-10-05 21:33:46&X-AUKA-USER=POS1
```

The key-pair that was used for generating the signature in this example can be downloaded here: [`public`](https://developer.settle.eu/_downloads/sample-pubkey.pem), [`private`](https://developer.settle.eu/_downloads/sample-privkey.pem)

The Python script that was used for generating the signature and `X-Auka-Content-Digest` header can be downloaded [`here`](https://developer.settle.eu/_downloads/rsa_example.py)

## Verifying signatures from Settle

Whenever Settle is sending callbacks to the client over HTTPS the request from Settle is signed using the same RSA method as described in the above *[section](/guides/authentication/#authentication-using-rsa-signature)*. The client should authenticate callbacks from Settle by verifying the signature given by Settle in the Authorization header of the request. The public key used by Settle in test environments can be downloaded [`here`](https://developer.settle.eu/_downloads/testserver-pub.pem). The public key for the production environment can be obtained by contacting Settle.