# [Lit Protocol](https://developer.litprotocol.com/resources/how-it-works)

## How Does Lit Protocol Work

### [Introduction](https://developer.litprotocol.com/resources/how-it-works#introduction)

Lit Protocol combines cutting-edge cryptography, sealed confidential hardware, and peer-to-peer networking to provide builders in web3 with the ability to use cryptographic keys and perform private compute jobs.

Around key management and private compuation, Lit Protocal can do below:

1. Securely generate and manage non-custodial keys to build user wallets and signers. This enables you to seamlessly onboard users into your application without relying on a centralized custodian or dealing with the complexities of key management.
Example implementations: PatchWallet, Silk, Collab.Land, Tria, Index Network

2. Perform data encryption and manage access to data with flexible access control rules and policies.
Example implementations: Fox, Terminal3, Streamr, Cheqd, Lens Protocol, Gitcoin

3. Write and execute private and immutable functions for cross-chain messaging and transaction automation, enabling the development of protocols that have the ability to read and write data between blockchains. Lit Action as js code(https://developer.litprotocol.com/sdk/serverless-signing/conditional-signing) and any logic(https://developer.litprotocol.com/sdk/serverless-signing/dependencies)
Example implementations: Event Listener, Yacht Labs SDK

overview: https://messari.io/report/understanding-lit-protocol-a-comprehensive-overview

Lit Architecture
Chronicle
Chronicle is an EVM-compatible rollup, launched as an Arbitrum Orbit chain, that settles on Ethereum. Though Lit is not a blockchain, it uses this rollup primarily to coordinate its node set, manage permissions for PKPs, and act as a persistent layer for shared state among nodes. Once LITKEY launches, Lit nodes will stake the token to determine their inclusion in the active validator set, which is refreshed every epoch. PKPs are represented as ERC-721 tokens (NFTs) on Chronicle. The permissions associated with PKPs are also onchain and used to verify signature requests by end users.

Chronicle is also used for metering usage and can support unique signature verification schemes that Ethereum’s EVM cannot. Users load LITKEY tokens into a contract, and their balance is deducted as they use the Lit network. Regarding signature verification support, Boneh–Lynn–Shacham (BLS) aggregation signatures can be verified onchain, lowering verification costs.

Chronicle adds an additional security assumption to Lit at the rollup sequencing layer. Currently, the Chronicle sequencer is centrally operated by Conduit, the rollup deployer team. However, Lit requires Lit nodes to also run Chronicle nodes to maintain high performance when syncing onchain and offchain operations. At the same time, Chronicle also benefits through the added redundancy and sequencer accountability. Because Lit nodes run a replicate of the chain, Lit nodes would know and immediately reject any invalid state transitions if Conduit were to act maliciously.

Lit Nodes
Each Lit node operates a sealed encrypted virtual machine. The term "sealed" implies that neither the operator, data center owner, nor any other party can access the interior of the processor. Each node includes a JavaScript execution environment and holds key shares. These nodes collectively form the Lit Network, which ensures data authenticity by requiring nodes to verify the seal of their peers through cryptographic proofs. This process ensures that all nodes in the network are genuine, sealed, and encrypted virtual machines.

The Lit Network operates using a distributed key management system where each node holds independent key shares of threshold key pairs. These threshold keys are created through distributed key generation. To perform operations with these keys, such as signing requests, at least two-thirds of the network nodes must participate. Each node must compute an authorization within its sealed environment, ensuring that no single node can compromise the system, thus maintaining a high level of security and trust within the network.


good architecture diagram: https://spark.litprotocol.com/lit-protocol-a-primer/


MPC/TSS/key shares: https://spark.litprotocol.com/xchain-bridging-yacht-lit-swap/

Distributed Trust
Harnessing multi-party computation (MPC) and threshold secret schemes (TSS), Lit distributes encrypted key shares across the Lit network. Neither you nor your users need to store any private key material. No party ever possesses the entire key.

Deeper explain from another article(https://medium.com/oregon-blockchain-group/decentralizing-key-management-a-deep-dive-into-lit-protocol-0004ec055d33):
Encryption and decryption occur on the client-side, based on “Access Control Conditions” that are defined by the end user, using either on-chain or off-chain data. For example, a condition could require a user to own a specific NFT in order to decrypt content. This process also applies to off-chain data through “Lit Actions”, which are JavaScript functions that are stored immutably on the IPFS. Essentially, Lit Actions are more powerful smart contracts written in JavaScript. In the protocol, Lit Actions trigger the Lit Node through a series of steps. Firstly, a Lit Action with a submitted input is executed by each node. Each node then verifies that the input meets the required conditions. If the conditions are met, the node provisions an independent key share. The Lit Node is then asked to sign data using the ECDSA algorithm with distributed ECDSA key-pairs, known as Programmable Key Pairs (PKPs), private key share. The resulting signature share is returned to the Lit JS SDK and it automatically combines the shares to form the full signature. It’s important to note that the complete signature can only be formed after an accumulation of over ⅔ of the shares have been collected.
Unlike traditional public and private key pairs, PKPs have an additional layer of programmability that enables developers to have control and manage access to their resources. Each PKP is generated using Distributed Key Generation (DKG), a process where the Lit nodes generate a new public or private key pair and each node only has a share of a private key. By splitting keys among multiple nodes, the Lit network eliminates the risk of a single point of failure. PKPs are represented as ERC-721 NFTs, with the NFT owner becoming the designated controller of the PKP, capable of assigning additional signing logic and authentication mechanisms using Lit Actions. Each PKP serves as a wallet, with the private key distributed across the Lit network. This unique design offers a level of censorship resistance and fault tolerance that surpasses typical 2-of-2 MPC designs. However, a majority of these 2-of-2 systems necessitate the end user to manage a key share, complicating the user experience (UX). Consequently, achieving a smooth onboarding UX, similar to web2 style without the need for seed phrases or private key management, becomes unattainable.

Lit offers decentralized encryption and decryption by using multi-party computation (MPC) and threshold secret schemes (TSS) to distribute encrypted key shares across the Lit network. MPC enables multiple parties, each holding private data, to evaluate a computation without ever revealing any of the private data held by each party. For example, in a digital wallet, MPC can be used to securely manage cryptographic keys and secrets. Conversely, TSS is a special case of MPC where the function to be computed is a cryptographic digital signature, and the private inputs are secret shares of the singing key. In the context of Lit, TSS is used to distribute encrypted key shares across the Lit network, ensuring that no single participant holds the complete signing authority, further enhancing security and reducing the risk of unauthorized access. This enhances the user experience by providing a more secure and convenient way to manage digital assets. For developers, MPC and TSS offer a robust, industry grade solution for key management and protection. It allows developers to build more secure, user-centric apps without worrying about the management of private keys.

### [Lit Nodes](https://developer.litprotocol.com/resources/how-it-works#1-lit-nodes)

Each Lit Node is a sealed encrypted virtual machine running on an independently operated server. The fact that each node is “sealed” means that neither the operator of the Lit Node, nor any other party, can access the interior of the processor.

[Sealed and Confidential Hardware](https://developer.litprotocol.com/resources/how-it-works#sealed-and-confidential-hardware)

All Lit node operators run a bare metal install of AMD’s SEV-SNP, ensuring they never have access to any key shares directly, nor the computation processed inside of each node.

Trusted Execution Environment (TEE): SEV-SNP is an example of a TEE, which provides advanced hardware-level isolation for all network operations.

Code Immutability and Confidentiality: Deployed programs within the TEE are immutable and private, preventing unauthorized changes and maintaining consistent operational integrity.

Each Lit node contains a JavaScript execution environment (Deno) and key shares. Each key share corresponds to a key pair that is "shared" among all participating operators, created using distributed key generation (DKG).

### [The Lit Network](https://developer.litprotocol.com/resources/how-it-works#2-the-lit-network)

The Lit network is composed of a collection of Lit nodes. All nodes must stake tokens in order to participate in the “active” node operator set, providing crypto-economic security guarantees.

## [AccessControl & Encryption](https://developer.litprotocol.com/sdk/access-control/quick-start)

You can use the Lit network to encrypt your data and store it privately on the open web. This guide will show you how you can encrypt a simple message with Lit, create an Access Control Condition (ACC), and permit decryption by users who meet the condition you set.

Encryption and Access Control Summery:

1 client encrypts raw data and get an encrypted data that can be shared to anyone
This step encrypts, the raw data and different decryption check condition, in json format (playground: https://lit-share-modal-v3-playground.netlify.app/) that will be executed/enforce in step 2.

2 client decrypt the encrypted data using the password returned from calling server encryption flow (where the check condition defined in json will be executed and enforced)


### Rules

- The decryption access control conditions must be the same as the encryption.
- The defined access control conditions must be met.

### Encryption & Decryption Flow Diagram

![Diagram](./lit-protocol.drawio.png)

### Client Encryption Flow

1. Validate Params: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1416
2. Validate Access Control Conditions Schema: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1430
3. Hashing Access Control Conditions: phttps://github.com/LIT-Protocol/js-sdk/blob/master/ackages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1434
4. Hashing Private Data: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1452
5. Assemble identity parameter: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1462
6. Encrypt using public key from server: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1468

### Client Decryption Flow

1. Validate Params: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1507
2. Hashing Access Control Conditions: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1522
3. Formatting Access Control Conditions: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1539
4. Assemble identity parameter: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1556
5. Get Network Signature, call API `/web/encryption/sign` with access control conditions to all nodes, and if the success node count is less than the min node count, return an error: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1564
6. Decrypt if step 5 is success: https://github1s.com/LIT-Protocol/js-sdk/blob/master/packages/lit-node-client-nodejs/src/lib/lit-node-client-nodejs.ts#L1556

### Server Encryption Sign Flow

1. Check Condition Count: https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L320
2. Hash the access control condition: https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L331
3. Validate auth sig item: https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L351
4. Check whether user satisfies access control conditions: https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L416
5. Sign the identity parameter using the blsful secret key share: https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L452

#### Example Server Encryption Sign Full Flow With Condition Type: RPC

1. encryption_sign
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L302
2. Check Condition Count
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L320
3. check_multiple_access_control_conditions
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L416
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L1221
4. check_access_control_conditions
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L1235
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L111
5. check_condition_group
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L129
6. check_condition
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L221
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L298
7. check_condition_via_rpc_method
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L330
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L444
8. check_return_value_int
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L467
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L1052
9. return error if condition not meet
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L434
10. return signature_share
   - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/endpoints/web_client.rs#L459

### All type of conditions can be implemented in tee-worker

- [POAP](https://developer.litprotocol.com/sdk/access-control/evm/poap) is an integration with https://poap.xyz
  - check_condition_via_poap
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L412
  - get_poaps_for_user
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L417

- [Timelock](https://developer.litprotocol.com/sdk/access-control/evm/timelock): Time-based Access Control, this will get the latest block from your blockchain of choice, and compare it to the unix timestamp that was specified in the returnValueTest.
  - check_condition_via_timestamp
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L347

- [SIWE](https://developer.litprotocol.com/sdk/access-control/evm/siwe): Sign In With Ethereum Parameters, see https://docs.login.xyz/
  - check_condition_via_siwe
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L474

- [Lit action](https://developer.litprotocol.com/sdk/access-control/lit-action-conditions)
  - check_condition_via_lit_action
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L506
  - execute_js
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L563
      - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/functions/spawner.rs#L76
      - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/functions/mod.rs#L40

- [Custom contract calls](https://developer.litprotocol.com/sdk/access-control/evm/custom-contract-calls)
  - check_condition_via_contract_call
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L325
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L621

- [Basic Signature](https://developer.litprotocol.com/sdk/access-control/evm/basic-examples#a-specific-wallet-address): without method
  - check_condition_via_signature
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L325
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L334
  - substitute_special_params
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L339
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L1190

- [Basic RPC](https://developer.litprotocol.com/sdk/access-control/evm/basic-examples): with method
  - check_condition_via_rpc_method
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L330
    - https://github1s.com/LIT-Protocol/Node/blob/HEAD/rust/lit-node/src/access_control/mod.rs#L444


### Run Test

```shell
nvm use
npm install
npm run dev 
```

## [Decentralized Compute](https://developer.litprotocol.com/sdk/serverless-signing/overview)

Blockchains like Ethereum have smart contracts that let developers encode logic to change state. With Lit, you can encode logic that governs signing and encryption.

This logic is encoded using a Lit Action, an immutable JavaScript program that can be "assigned" to the key pairs generated on Lit and used to dictate how they are used.

### [Use `Fetch` in Lit Action Code](https://developer.litprotocol.com/sdk/serverless-signing/fetch)

The HTTP request will be sent out by all the Lit Nodes in parallel, and consensus is based on at least 2/3 of the nodes getting the same response. If less than 2/3 nodes get the same response, then the user can not collect the signature shares above the threshold and therefore cannot produce the final signature. Note that your HTTP request will be sent N times where N is the number of nodes in the Lit Network, because it's sent from every Lit Node in parallel.

## Resources

- Block Explorer: https://chain.litprotocol.com/
- RPC URL: https://chain-rpc.litprotocol.com/replica-http
