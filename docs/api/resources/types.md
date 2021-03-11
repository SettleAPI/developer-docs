---
title: Complex Types
description: Complex Types
---
# Complex Types

Not all data can be easily described with simple data structures. This page lists all the complex data structures that our Settle API is using.

## Item :ticket:

Simple item description for Settle item lists.

<div class="md-api_reference_FiraCode">

### item_name

* Type: `string`
* Required: `false`
* Default: `null`

Item text, e.g. "Spaghetti code".

### quantity

* Type: `string`
* Required: `false`
* Default: `null`

Quantity of the item.

### measurement_unit

* Type: `string`
* Required: `false`
* Default: `null`

Unit of the quantity. e.g. kg, m, m2, m3, pcs and so on.

### item_gross_total

* Type: `string`
* Required: `false`
* Default: `null`

Price price the quantity of the item, VAT included.

### tax_percent

* Type: `string`
* Required: `false`
* Default: `null`
* Number: == None

VAT in percent.

### item_id

* Type: `string`
* Required: `false`
* Default: `null`

Item identifier. Preferred in the order from left to right: **EAN**, **UPC**, **ISBN**, **commodity code**, **serial number**, **other identifiers**.

</div>

## Currency :euro:

In schemas where a Currency field occurs it's value determines the currency used for the [Money](#money) fields in the same schema. If the schema has a nested structure, the Currency field only affects the Money fields at the same nesting level. The Currency field takes a string of 3 chars representing a currency code according to the [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) standard.

## MoneyInteger :100:

Type that represents a monetary amount as an integer. In schemas where one or more [`Money`](/api/resources/types/#money) fields appears there will always be a Currency field present, that determines the currency of the Money fields.

## Capture :card_index:

The list of captures done for the payment request.

<div class="md-api_reference_FiraCode">

### id

* Type: `string`
* Required: `false`
* Default: `null`

Local capture id. `null` if the full amount in the payment request is captured in one step.

### amount

* Type: [`MoneyInteger`](/api/resources/types/#moneyinteger)
* Required: `false`
* Default: `null`

Captured part of amount.

### additional_amount

* Type: [`MoneyInteger`](/api/resources/types/#moneyinteger)
* Required: `false`
* Default: `null`

Captured part of additional amount.

</div>

## Refund :money_with_wings:

The list of refunds done for the payment request.

<div class="md-api_reference_FiraCode">

### id

* Type: `string`
* Required: `false`
* Default: `null`

Local refund id. Null if the full amount in the payment request is refunded in one step.

### amount

* Type: [`MoneyInteger`](/api/resources/types/#moneyinteger)
* Required: `false`
* Default: `null`

Refunded part of amount.

### additional_amount

* Type: [`MoneyInteger`](/api/resources/types/#moneyinteger)
* Required: `false`
* Default: `null`

Refunded part of additional amount.

### chat_message_data_text

* Type: `string`
* Required: `false`
* Default: `null`

Given text reason for refund.

</div>

## PersonIdentifier :couple:

No info available for `PersonIdentifier` at of this moment. Please [contact us](https://settle.eu/contact/) for more information.

## DateTime :date:

UTC date and time as a string. The format is `YYYY-MM-DD hh:mm:ss` (24h time).

## JSON :page_with_curl:

No info available for `JSON` at of this moment. Please [contact us](https://settle.eu/contact/) for more information.

## AccessTokenResponse :closed_lock_with_key:

<div class="md-api_reference_FiraCode">

### access_token

* Type: `string`
* Required: `false`
* Default: `null`

Access token.

### id_token

* Type: `string`
* Required: `false`
* Default: `null`

A JWT that contains identity information about the user that is digitally signed by Settle.

### token_type

* Type: `string`
* Required: `true`
* Default: `null`

Type of access token, at this time it will always be Bearer.

### expires_in

* Type: `integer`
* Required: `false`
* Default: `null`

Lifetime in seconds of the access token.

### refresh_token

* Type: `string`
* Required: `false`
* Default: `null`

Refresh token used to issue new access token after expiration.

### scope

* Type: `string`
* Required: `false`
* Default: `null`
* Value: `address` | `bankid` | `email` | `fodselsnummer` | `openid` | `phone` | `profile` | `shipping_address`

Space-delimited list of scopes. Any of: "openid" (static id, "address" (user preferred address), "profile" (name), "phone", "email", "shipping_address", "fodselsnummer".

### currency

* Type: [`Currency`](/api/resources/types/#currency)
* Required: `false`
* Default: `null`
* Length: == 3

Currency for fee.

### transaction_fee

* Type: [`MoneyInteger`](/api/resources/types/#moneyinteger)
* Required: `false`
* Default: `null`
* Length: == 3

Permission fee to be deducted from settlement.

### status

* Type: `string`
* Required: `false`
* Default: `null`

Permission request status.

### status_code

* Type: `integer`
* Required: `false`
* Default: `null`

Permission request status code.

### pos_id

* Type: `string`
* Required: `true`
* Data Required: New or existing on update
* Length <= 64
* Regexp: ^\[a-zA-Z0-9.-]+$

The POS this request originates from, used for informing user about origin.

### pos_tid

* Type: `string`
* Required: `true`
* Data Required: New or existing on update
* Length <= 64
* Regexp: ^\[a-zA-Z0-9.-]+$

Local transaction id for POS. This must be unique for the POS.

### rid

* Type: `string`
* Required: `required`
* Data Required: New or existing on update

asdf.

### user_info

* Type: [`JSON`](/api/resources/types/#json)
* Required: `false`
* Default: `null`

User Info.

</div>

## NdbKey :lock_with_ink_pen:

No info available for `NdbKey` at of this moment. Please [contact us](https://settle.eu/contact/) for more information.

## MerchantProfileRegistration :office:

<div class="md-api_reference_FiraCode">

### first_address_line

* Type: `string`
* Required: `false`
* Default: `null`
* Length <= 100

First address line.

### postal_code

* Type: `string`
* Required: `false`
* Default: `null`
* Length 4<= and >=5
* Regexp: ^\[0-9]{4,5}$

Postal Code.

### country

* Type: `string`
* Required: `false`
* Default: `null`

Merchants country of operation.

### description

* Type: `string`
* Required: `false`
* Default: `null`

Description of Merchant.

### phone_number

* Type: `string`
* Required: `false`
* Validator: MSISDN

Phone number.

### email

* Type: `string`
* Required: `false`
* Default: `null`
* Regexp: ^.+@[^.].*.\[a-z]{2,10}$)

Merchant contact email address.

### url

* Type: `string`
* Required: `false`
* Default: `null`
* Length: <= 100
* Regexp: ^w+://([^/:]+.\[a-z]{2,10}|(\[0-9]{1,3}.){3}\[0-9]{1,3})(:\[0-9]+)?(/.*)?$

Website URL.

### twitter

* Type: `string`
* Required: `false`
* Default: `null`

Twitter URL.

### Facebook

* Type: `string`
* Required: `false`
* Default: `null`

Facebook URL.

### hours

* Type: `string`
* Required: `false`
* Default: `null`

Hours of operation.

### settlement_receivers

* Type: `string`
* Required: `false`
* Default: `null`
* Regexp: ^.+@[^.].*.\[a-z]{2,10}$)

Please write email address of people who should receive settlement files for this store.

### settlement_email_xls

* Type: `bollean`
* Required: `false`
* Default: `false`

Settlement Email Xls.

### logo_url

* Type: `string`
* Required: `false`
* Default: `null`

URL to Merchants logo.

</div>

## BusinessApplication :pencil2:

<div class="md-api_reference_FiraCode">

### status

* Type: `string`
* Required: `false`
* Default: `null`

Status of the current application.

### comment

* Type: `string`
* Required: `false`
* Default: `null`

Comments given on the current application.

</div>

## BusinessDocument :clipboard:

<div class="md-api_reference_FiraCode">

### gs_object_name

* Type: `string`
* Required: `false`
* Default: `null`

Gs Object Name.

### description

* Type: `string`
* Required: `false`
* Default: `null`

Description.

</div>

## PubKey :lock:

Field for public key

Settle accepts the following formats:

* OpenSSH public key format (the format in ~/.ssh/authorized_keys)
* PEM format

Max bit size: 4096.

The validator will try to add a BEGIN/END wrapper if the key lacks one. If the wrapper provided is wrong, the validation will fail.

## Location :round_pushpin:

A geographical point, specified by [floating-point latitude and longitude coordinates](https://support.google.com/maps/answer/18539) together with an accuracy measurement in meters.

<div class="md-api_reference_FiraCode">

### latitude

* Type: `float`
* Required: `false`
* Default: `null`

Latitude.

### longitude

* Type: `float`
* Required: `false`
* Default: `null`

Longitude.

### accuracy

* Type: `float`
* Required: `false`
* Default: `null`

Accuracy in meters.

</div>


## LineItemMetadata :bookmark_tabs:

<div class="md-api_reference_FiraCode">

### key

* Type: `string`
* Required: `true`
* Data Required: New or existing on update

Key.


### value

* Type: `string`
* Required: `true`
* Data Required: New or existing on update

Value.

</div>


## LineItem :memo:

<div class="md-api_reference_FiraCode">

### product_id

* Type: `string`
* Required: `true`
* Data Required: New or existing on update

External id for the product in the line item.


### description

* Type: `string`
* Required: `true`

Description of the line item.

</div>


## Money :moneybag:

Type that represents a monetary amount as a string using period as the decimal separator (e.g. `"12.50"`). In schemas where one or more Money fields appears there will always be a [Currency](#currency) field present, that determines the currency of the Money fields. The value string of the Money field must have the correct number of decimal places for the currency that has been supplied in the same schema. E,g, if the currency is `"USD"`, `"12.50"` is a valid Money value, while `"12.5"` and `"12.500"` are not.