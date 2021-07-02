---
layout: ResourceOverview
title: merchant.apiKeys
description: Overview
schema: merchant.apiKeys
api: merchant
resourceDesc: true
---

::: slot resource
In order to gain access to the [Merchant API](/api/reference/rest) a client must authenticate itself using the `X-Settle-User` ID and the JWT/RSA KEY of an existing user. This means that the first user for a Merchant must be created in the **Self Service Portal** or by an Integrator on behalf of the Merchant.

Each `X-Settle-User` is created for a specific Merchant, which ID is given by the value of the `X-Settle-Merchant` header when making a [ `merchant.apiKeys.create` ](/api/reference/rest/v1/merchant.apiKeys/create/) request. An API User can only interact with the API on behalf of the Merchant which it was created for. The `X-Settle-User` ID is chosen on `merchant.apiKeys.create` and is has to be unique for the parent Merchant.
:::
