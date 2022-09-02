import { createNetsuiteVendor, NetsuiteVendor } from "./models/vendor";
import { createNetsuiteAccount, NetsuiteAccount } from "./models/account";
import { NetsuiteClient } from "./client";

type NetsuiteServiceDependencies = {
    client: NetsuiteClient;
}
type NetsuiteService = {
    getVendors(): Promise<NetsuiteVendor[]>;
    getAccounts(): Promise<NetsuiteAccount[]>;
}
type Vendor = {
    attributes: {
        internalId: string;
    };
    entityId: string;
    isPerson: boolean;
    isInactive: boolean;
    companyName: string | undefined;
    defaultAddress: string | undefined;
    legalName: string | undefined;
}

type Account = {
    attributes: {
        internalId: string;
    };
    acctType: string;
    acctNumber: string;
    acctName: string;
}

export function buildNetsuiteService({
    client
}: NetsuiteServiceDependencies): NetsuiteService {
    
    async function getVendors(): Promise<NetsuiteVendor[]> {
        client.addSoapHeader({
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: 10,
                bodyFieldsOnly: false
            }
        
        });
    
        const {response} = (await client.searchAsync<Vendor>({
            "platformMsgs:searchRecord": {
                attributes: {
                    "xmlns:ns2": "urn:relationships_2022_1.lists.webservices.netsuite.com",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:type": "ns2:VendorSearch"
                },
                "ns2:basic": {}
            }
        }));
    
        return response.searchResult.recordList.record.map((vendor: Vendor) => {
            return createNetsuiteVendor(
                vendor.entityId,
                vendor.companyName ?? vendor.legalName ?? vendor.entityId,
                vendor.defaultAddress
            );
        });
    }

    async function getAccounts(): Promise<NetsuiteAccount[]> {
        client.addSoapHeader({
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: 10,
                bodyFieldsOnly: false
            }
        });

        const {response, rawRequest} = await client.searchAsync<Account>({
            "platformMsgs:searchRecord": {
                attributes: {
                    "xmlns:ns2": "urn:accounting_2022_1.lists.webservices.netsuite.com",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:type": "ns2:AccountSearch"
                },
                "ns2:basic": {}
            }
        });

        console.log(rawRequest);

        return response.searchResult.recordList.record.map((account) => {
            return createNetsuiteAccount(
                Number(account.attributes.internalId),
                account.acctName,
                account.acctNumber,
                account.acctType
            )
        });
    }

    return {
        getVendors,
        getAccounts
    };
}