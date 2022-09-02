import { createNetsuiteVendor, NetsuiteVendor } from "./model";
import { NetsuiteClient } from "./client";

type NetsuiteServiceDependencies = {
    client: NetsuiteClient;
}
type NetsuiteService = {
    getVendors(): Promise<NetsuiteVendor[]>;
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

    return {
        getVendors
    };
}