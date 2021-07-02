---
layout: SpecialLayout
title: merchant.balance.get
description: Endpoint description.
api: merchant
schema: merchant.balance
operationId: merchant.balance.get
operation: get
method: get
authLevel: JWT
authRoles: USER, SUPERUSER, INTEGRATOR
---

::: slot example

## Examples

<code-group>
<code-block title="HTTP">
```http
GET /merchant/v1/merchant/5rg1dkk8/balance/ HTTP/1.1
Host: api.sandbox.settle.eu
X-Settle-Merchant: 5rg1dkk8
Authorization: SECRET 2Z49_HoqEdPu0VqGn6vy2679+tYOT0Fl
```
</code-block>

<code-block title="cURL">
```bash
curl \
--request GET 'https://api.sandbox.settle.eu/merchant/v1/merchant/5rg1dkk8/balance/' \
--header 'X-Settle-Merchant: 5rg1dkk8' \
--header 'Authorization: SECRET 2Z49_HoqEdPu0VqGn6vy2679+tYOT0Fl'
```
</code-block>

<code-block title="Python">
```python
import http.client
conn = http.client.HTTPSConnection("api.sandbox.settle.eu")
payload = ''
headers = {
'X-Settle-Merchant': '5rg1dkk8',
'Authorization': 'SECRET 2Z49_HoqEdPu0VqGn6vy2679+tYOT0Fl'
}
conn.request("GET", "/merchant/v1/merchant/5rg1dkk8/balance/", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```
</code-block>
</code-group>
:::
