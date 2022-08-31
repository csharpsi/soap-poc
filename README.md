# Netsuite SOAP API Proof of Concept

Here you will find a proof of concept for connecting to a SOAP API using typescript and node.js

To see the PoC working, run the following command, passing in the correct values for the environment variables (these can be found in the Postman collection).

```
$ NETSUITE_SERVICE_URL=service_url \
    NETSUITE_ACCOUNT=account \
    NETSUITE_CONSUMER_KEY=consumer_key \
    NETSUITE_CONSUMER_SECRET=consumer_secret \
    NETSUITE_TOKEN_ID=token_id \
    NETSUITE_TOKEN_SECRET=token_secret \
    yarn soap
```

This should print out a mapped list of 10 vendors from Netsuite.