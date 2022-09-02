import { netsuiteSoapEnvironment as env } from "../../environment";
import { randomBytes, createHmac } from "crypto";

const { 
    account, 
    consumerKey,
    consumerSecret,
    tokenId,
    tokenSecret, 
} = env;

export function buildTokenPassportSecurity(): {
    toXML: () => string;
} {
    function createSecurityHeader(): {
        nonce: string;
        timestamp: string;
        signature: string;
    } {

        const timestamp = new Date().getTime().toString().substring(0, 10);
        const nonce = randomBytes(10).toString("hex");
        const baseString = `${account}&${consumerKey}&${tokenId}&${nonce}&${timestamp}`;
        const key = `${consumerSecret}&${tokenSecret}`;
        const hmac = createHmac("sha256", key);
        const sigData = hmac.update(baseString);

        const signature = sigData.digest("base64");

        return {nonce, timestamp, signature};
    }

    function toXML(): string {
        const {nonce, timestamp, signature} = createSecurityHeader();
        return `
        <tokenPassport>
            <account>${account}</account>
            <consumerKey>${consumerKey}</consumerKey>
            <token>${tokenId}</token>
            <nonce>${nonce}</nonce>
            <timestamp>${timestamp}</timestamp>
            <signature algorithm="HMAC-SHA256">${signature}</signature>
        </tokenPassport>
        `;
    }

    return {
        toXML
    }
}