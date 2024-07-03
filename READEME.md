# Prepare
```shell
nvm use
npm install 
```

# AccessControl & Encryption

*Reference: https://developer.litprotocol.com/sdk/access-control/quick-start*

## Rules

- The decryption access control conditions must be the same as the encryption.
- The defined access control conditions must be met.

## Encryption Flow

1. Validate Params: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1416
2. Validate Access Control Conditions Schema: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1430
3. Hashing Access Control Conditions: phttps://github.com/LIT-Protocol/js-sdk/blob/master/ackages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1434
4. Hashing Private Data: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1452
5. Assemble identity parameter: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1462
6. Encrypt: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1468

## Decryption Flow

1. Validate Params: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1507
2. Hashing Access Control Conditions: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1522
3. Formatting Access Control Conditions: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1539
4. Assemble identity parameter: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1556
5. Get Network Signature, send access control conditions to all nodes, and if the success node count is less than the min node count, return an error: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1564
6. Decrypt if step 5 is success: https://github.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1556

## Test

```shell
npm run accessControlConditions 
```

# Resources

- Block Explorer: https://chain.litprotocol.com/
- RPC URL: https://chain-rpc.litprotocol.com/replica-http
