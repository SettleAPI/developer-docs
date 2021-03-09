---
title: Callbacks
description: Callbacks
---
# Callbacks

API clients can associate some resources with a `callback_uri` in order to enable asynchronous communication between the client and server. At certain events Settle can trigger a callback to specified `callback_uri`. E.g. if the callback URI is an HTTP URI, an HTTP POST request will be made to the URI. The data sent with the callback is referred to as a "callback message" (or just "message"). The message consists of a `meta` part and an `object` part, the latter containing the actual message data, while the former is meta information about the callback. Note that you do not have to know everything about callbacks in order to implement an API client. However, *all developers should read the* *[Security considerations](https://developer.settle.eu/callbacks.html#callbacks-security)* *section*.

Callbacks support several protocols (see *[Supported protocols](https://developer.settle.eu/callbacks.html#callbacks-protocols)*) For protocols that are considered secure the callback will contain the entire message. Let us first consider an example where the callback is made using a secure protocol. The example `callback_uri` of the resource is `https://callbackserver.test/notification/qWeR/`, which is an HTTPS URI.

```
POST /notification/qWeR/ HTTP/1.1
HOST: callbackserver.test
Content-Type: application/vnd.mcash.api.merchant.v1+json
Authorization: RSA-SHA256 <rsa_signature>
X-Auka-Content-Digest: SHA256=<content_sha256>

{
    "meta": {
        "id": "RzeUPFP1T5WkWd46tX8Hxg",
         "event": "test_event",
         "uri": "https://server.test/my_resource/1/"
    },
    "object": {"text": "Hello World"},
}
```

Notice the headers `Authorization` and `X-Auka-Content-Digest`. The values of these headers contain the information necessary for the client to authenticate the callback from Settle. See *[Verifying signatures from Settle](https://developer.settle.eu/authentication.html#authentication-settle-signatures)* for a description of the signature method used in requests from Settle.

For insecure protocols, Settle will only send non-sensitive meta-information. In this example the `callback_uri` is `http://callbackserver.test/notification/qWeR/` (HTTP):

```
POST /notification/qWeR HTTP/1.1
HOST: callbackserver.test
Content-Type: application/vnd.mcash.api.merchant.v1+json

{
    "meta": {
        "id": "RzeUPFP1T5WkWd46tX8Hxg",
        "event": "test_event",
        "uri": "https://server.test/my_resource/1/"
    }
}
```

Here the `uri` field contains a URI that points to an endpoint on an Settle server where the `object` part can be retrieved using an HTTPS GET.

```
GET /my_resource/1/ HTTP/1.1
HOST: server.test
```

```
HTTP/1.1 200 OK
Content-Type: application/vnd.mcash.api.merchant.v1+json

{"text": "Hello World"}
```

## Events

The value in the `event` field in the `meta` part of the message is called the message event or just event. The event says something about why the callback was made and how to interpret the `object` part (a data schema is defined for each event).

### Payment request

Several events are associated with the different transitions in payment request state:

* payment_authorized *(User has accepted a payment request. Used for both AUTH and SALE requests)*
* payment_captured
* payment_auth_released
* payment_aborted_by_customer
* payment_aborted_by_merchant
* payment_authorization_renewed
* payment_authorization_expired
* payment_request_expired

As these events reflect the state of the payment request at the time the callback was made, the `object` part will contain the same data as what can be retrieved from the payment request [`outcome`](https://developer.settle.eu/handlers.html#get--payment_request--tid--outcome- "GET /payment_request/\<tid>/outcome/") endpoint. The data schema is:

#### currency

* Type: [`Currency`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-0)
* Required: `true`
* Default: `null`

ISO 4217 currency code. See [Currency](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-0).

#### amount

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### additional_amount

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

Additional amount might have been changed by user if `additional_edit` was true. See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### auth_amount

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

The authorized amount. If doing partial captures, this will show the amount still available in the authorization for subsequent captures; auth_amount = amount - sum (captured amounts). See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### auth_additional_amount

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

The authorized additional amount. If doing partial captures, this will show the part of additional amount still available in the authorization for subsequent captures; auth_additional_amount = additional_amount - sum(captured additional amounts). See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### captures

* Type: [`Capture`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-2)
* Required: `false`
* Default: `null`

List of captures. See [Capture](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-2).

#### refunds

* Type: [`Refund`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-3)
* Required: `false`
* Default: `null`

List of refunds. See [Refund](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-3).

#### status

* Type: `string`
* Required: `false`
* Default: `null`
* Values: `ok` | `fail` | `auth` | `pending`

Payment request status (see above).

#### status_code

* Type: `integer`
* Required: `false`
* Default: `null`
* Values: `ok` | `fail` | `auth` | `pending`

Payment request status code (see above).

#### customer

* Type: [`PersonIdentifier`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-6)
* Required: `false`
* Default: `null`

Customer identifier as originally registered by POS. See [PersonIdentifier](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-6).

#### date_modified

* Type: [`DateTime`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-7)
* Required: `false`
* Default: `null`

Last modified date. See [DateTime](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-7)

#### date_expires

* Type: [`DateTime`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-7)
* Required: `false`
* Default: `null`

Expiration date for current status. After a payment authorization is given this may extend beyond the original expiry date given in the payment request. An authorization expires after 3 days. When the payment request expires it is marked as failed (whether in pending or authorized state). See [DateTime](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-7).

#### credit

* Type: `boolean`
* Required: `true`
* Default: `null`

Whether the received payment was a credit payment.

#### interchange_fee

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

Interchange fee to be deducted if credit payment. See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### transaction_fee

* Type: [`MoneyInteger`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1)
* Required: `false`
* Default: `null`

Transaction fee to be deducted. See [MoneyInteger](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-1).

#### attachment_uri

* Type: `string`
* Required: `false`
* Default: `null`

Endpoint for Attachment uploads, such as electronic receipts. This URI has a limited time to live, and a new URI is generated each time outcome is retrieved.

#### pos_id

* Type: `string`
* Required: `true`

Data required (new or existing on update). The POS this request originates from, used for informing user about origin.

#### pos_tid

* Type: `string`
* Required: `required`
* Length: <= 64
* Regexp: `^[a-zA-Z0-9_.-]+$`

Local transaction id for POS. This must be unique for the POS.

#### tid

* Type: `string`
* Required: `required`
* Length: <= 64
* Regexp: `^[a-zA-Z0-9_.-]+$`

Settle transaction id.

#### permissions

* Type: [`AccessTokenResponse`](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-10)
* Required: `false`
* Default: `null`

If payment request was combined with a permission request, this field will contain the permission request outcome. Same as returned by a GET the permission request outcome endpoint. See [AccessTokenResponse](https://developer.settle.eu/types.html#wtforms-fielddoc-callbacks-10).

### Permission request

There are two events associated with permission requests:

* permission_request_answered (User has processed the request and accepted or declined access to one or more resources)
* permission_request_expired

The same data is available at the [`outcome`](https://developer.settle.eu/handlers.html#get--permission_request--rid--outcome- "GET /permission_request/\<rid>/outcome/") endpoint, with response schema:

fgdsfgsdfgsdf

### Shortlink scan

Whenever a shortlink is scanned a callback will be made by Settle to the URI that was given in the `callback_uri` field of the shortlink resource. The event for this callback is *shortlink_scanned* and the data schema for the `object` part is:

dfasdfdasf

Note that this event is exempt from the "secure callback rule". I.e. the `object` part is always included, no matter what protocol is being used for the callback. Hence the `uri` field in the `meta` part is `null`.

If that callback is made using HTTP or HTTPS, the recipient of the callback may return the following data, which will be transported back to the user agent that scanned the shortlink, in the HTTP(S) response body:

sadfasdfsdaf

## Supported protocols

The part before the first colon in the callback URI determines the protocol that will be used for the callback. The meaning of the part after the colon depends on the actual protocol. The supported protocols with descriptions are given here.

### HTTP

Example URI: `http://acme.com/payment_request/Qd3/callback/`

Settle will make an HTTP POST request to the specified URI. The content-type of the request will be the *[API media type](https://developer.settle.eu/introduction.html#introduction-media-type)*, unless a different media type is documented for the particular callback. The request is signed by Settle according to *[Authentication using RSA signature](https://developer.settle.eu/authentication.html#authentication-rsa-signing)*.

### HTTPS (secure)

Example URI: `https://acme.com/payment_request/Qd3/callback/`

Same as HTTP, except that HTTPS is considered secure which means that the `object` part is included in the callback message. Settle verifies SSL certificates, so the recipient of the callback must use a CA signed certificate. If the client is going to use the data in the `object` part it SHOULD verify that the callback has been correctly signed by Settle.

## Security considerations

One important criterion for the Settle APIs is that the responsibility for security should mostly fall on the server (Settle) not the client. However, regarding callbacks one responsibility that falls on the client is to verify the origin of the data sent with the callback before putting it to use. There are two ways to do this.

### Validation of message URI

If the client does not implement signature verification or is using a protocol for callbacks that does not support signatures, the callback can be verified using the following procedure:

1. Verify that the hostname in the message URI in the `uri` field in the `meta` part is an settle.eu sub-domain and that the URI is HTTPS. I.e. check that the URI starts with "https:" and that the hostname ends with ".settle.eu". Example of a valid URI: `https://api.settle.eu/merchant/v1/`.
2. Retrieve the message by making an HTTPS GET request to the message URI. Make sure that your HTTPS client library is configured to verify SSL certificates. The retrieved message can safely be used as it's origin has been verified through HTTPS.

Note that some of our test environments have hostnames that are not a sub-domain of ".settle.eu", in which case this method will not work.

### Verify the callback signature

For some protocols, like HTTP and HTTPS, it is specified that Settle signs the callback. If the client verifies the signature according to the specified signature method, any data sent with the callback can be used safely.