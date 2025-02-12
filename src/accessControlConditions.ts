import { LitNetwork } from "@lit-protocol/constants";
import {
  LitNodeClient,
  decryptToString,
  encryptString,
} from "@lit-protocol/lit-node-client";
import {
  LitAbility,
  LitAccessControlConditionResource,
  LitActionResource,
} from "@lit-protocol/auth-helpers";
import { genWallet, genSession } from "./utils.js";
import { AccessControlConditions } from "@lit-protocol/types";
import { Wallet } from "ethers";

const chain = "ethereum";
const dataToEncrypt = "this is data need be encrypted";

const accessControlConditions1 = [
  {
    contractAddress: "",
    standardContractType: "timestamp",
    chain: "ethereum",
    method: "eth_getBlockByNumber",
    parameters: ["latest"],
    returnValueTest: {
      comparator: ">=",
      value: "0"
    },
  },
];
const accessControlConditions2 = [
  {
    contractAddress: "",
    standardContractType: "timestamp",
    chain: "ethereum",
    method: "eth_getBlockByNumber",
    parameters: ["latest"],
    returnValueTest: {
      comparator: ">=",
      value: "1"
    },
  },
];
const accessControlConditions3 = [
  {
    contractAddress: "",
    standardContractType: "timestamp",
    chain: "ethereum",
    method: "eth_getBlockByNumber",
    parameters: ["latest"],
    returnValueTest: {
      comparator: "<",
      value: "1"
    },
  },
];

const decrypt = async (client: LitNodeClient, wallet: Wallet, accessControlConditions: AccessControlConditions, dataToEncryptHash: string, ciphertext: string) => {
  const accsResourceString =
    await LitAccessControlConditionResource.generateResourceString(
      accessControlConditions,
      dataToEncryptHash
    );
  // need use wallet to sign message for decryption
  const sessionForDecryption = await genSession(wallet, client, [
    {
      resource: new LitActionResource("*"),
      ability: LitAbility.LitActionExecution,
    },
    {
      resource: new LitAccessControlConditionResource(accsResourceString),
      ability: LitAbility.AccessControlConditionDecryption,
    },
  ]);

  // call lit-node api to do decryption
  return await decryptToString(
    {
      sessionSigs: sessionForDecryption,
      chain,
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
    },
    client
  );
}

const case1 = async (client: LitNodeClient, wallet: Wallet) => {
  console.log("\n\n-------------------------------------------------------------------------------------------------------");
  console.log("case1: encrypt with accessControlConditions1, decrypt with accessControlConditions1");
  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions: accessControlConditions1,
      dataToEncrypt,
    },
    client,
  );
  console.log({ ciphertext, dataToEncryptHash })
  const decryptResponse = await decrypt(client, wallet, accessControlConditions1, dataToEncryptHash, ciphertext);
  console.log("case1, decrypt response: ", decryptResponse);
  console.log("-------------------------------------------------------------------------------------------------------");
};

const case2 = async (client: LitNodeClient, wallet: Wallet) => {
  console.log("\n\n-------------------------------------------------------------------------------------------------------");
  console.log("case2: encrypt with accessControlConditions2, decrypt with accessControlConditions2");
  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions: accessControlConditions2,
      dataToEncrypt,
    },
    client,
  );
  console.log({ ciphertext, dataToEncryptHash })
  const decryptResponse = await decrypt(client, wallet, accessControlConditions2, dataToEncryptHash, ciphertext);
  console.log("case2, decrypt response: ", decryptResponse);
  console.log("-------------------------------------------------------------------------------------------------------");
};

const case3 = async (client: LitNodeClient, wallet: Wallet) => {
  console.log("\n\n-------------------------------------------------------------------------------------------------------");
  console.log("case3: encrypt with accessControlConditions3, decrypt with accessControlConditions3");
  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions: accessControlConditions3,
      dataToEncrypt,
    },
    client,
  );
  console.log({ ciphertext, dataToEncryptHash })
  try {
    const decryptResponse = await decrypt(client, wallet, accessControlConditions3, dataToEncryptHash, ciphertext);
    console.log("case3, decrypt response: ", decryptResponse);
  } catch (e) {
    console.log("case3, decrypt failure, reason: ", e);
  }
  console.log("-------------------------------------------------------------------------------------------------------");
};

const case4 = async (client: LitNodeClient, wallet: Wallet) => {
  console.log("\n\n-------------------------------------------------------------------------------------------------------");
  console.log("case4: encrypt with accessControlConditions1, decrypt with accessControlConditions2");
  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions: accessControlConditions1,
      dataToEncrypt,
    },
    client,
  );
  console.log({ ciphertext, dataToEncryptHash })
  try {
    const decryptResponse = await decrypt(client, wallet, accessControlConditions2, dataToEncryptHash, ciphertext);
    console.log("case4, decrypt response: ", decryptResponse);
  } catch (e) {
    console.log("case4, decrypt failure, reason: ", e);
  }
  console.log("-------------------------------------------------------------------------------------------------------");
};

const main = async () => {
  const client = new LitNodeClient({
    litNetwork: LitNetwork.Cayenne,
    debug: false,
  });
  // need connect to lit-node before do encryption/decryption
  // 1) client need pubkey from lit-node to do encryption
  // 2) client need call lit-node api to do decryption
  await client.connect();
  console.log('Connected Nodes>>\n', Array.from(client.connectedNodes).join('\n'));

  const wallet = genWallet();

  // decrypt success because current block number > 0
  await case1(client, wallet);
  // decrypt success because current block number > 1
  await case2(client, wallet);
  // decrypt failure because current block number > 1, condition not meet
  await case3(client, wallet);
  // decrypt failure because conditions of encrypt and decrypt is not same
  await case4(client, wallet);

  client.disconnect();
};

main();
