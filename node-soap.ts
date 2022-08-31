import { createClientAsync, ISecurity } from "soap";
import { netsuiteSoapEnvironment as env } from "./environment";
import { randomBytes, createHmac } from "crypto";
import { run } from "./iife";
import { createNetsuiteVendor, NetsuiteVendor, SearchResponse, Vendor } from "./model";

async function main(): Promise<void> {
    const vendors = await getVendors();
    console.log(JSON.stringify(vendors, null, 4));
}

async function getVendors(): Promise<NetsuiteVendor[]> {
    const { wsdl, webServiceUrl: endpoint } = env;
    
    const client = await createClientAsync(wsdl, {
        endpoint,
        useEmptyTag: true
    });

    client.setSecurity(new TokenPassportSecurity());

    client.addSoapHeader(() => {
        return {
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: 10,
                bodyFieldsOnly: false
            }
        }
    });

    const [response] = (await client.searchAsync({
        "platformMsgs:searchRecord": {
            attributes: {
                "xmlns:ns2": "urn:relationships_2022_1.lists.webservices.netsuite.com",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:type": "ns2:VendorSearch"
            },
            "ns2:basic": {}
        }
    })) as [SearchResponse<Vendor>];

    const vendors = response.searchResult.recordList.record.map((vendor: Vendor): NetsuiteVendor => {
        return createNetsuiteVendor(
            vendor.entityId,
            vendor.companyName ?? vendor.legalName ?? vendor.entityId,
            vendor.defaultAddress
        );
    });

    return vendors ?? [];
}

const { 
    account, 
    consumerKey,
    consumerSecret,
    tokenId,
    tokenSecret, 
} = env;

class TokenPassportSecurity implements ISecurity {
    
    private nonce: string;
    private timestamp: string;
    
    constructor() {
        this.timestamp = new Date().getTime().toString().substring(0, 10);
        this.nonce = randomBytes(10).toString("hex");
    }

    private generateSignature(): string {
        const baseString = `${account}&${consumerKey}&${tokenId}&${this.nonce}&${this.timestamp}`;
        const key = `${consumerSecret}&${tokenSecret}`;
        const hmac = createHmac("sha256", key);
        const sigData = hmac.update(baseString);

        return sigData.digest("base64");
    }

    toXML(): string {
        return `
        <tokenPassport>
            <account>${account}</account>
            <consumerKey>${consumerKey}</consumerKey>
            <token>${tokenId}</token>
            <nonce>${this.nonce}</nonce>
            <timestamp>${this.timestamp}</timestamp>
            <signature algorithm="HMAC-SHA256">${this.generateSignature()}</signature>
        </tokenPassport>
        `;
    }
}

run(main);