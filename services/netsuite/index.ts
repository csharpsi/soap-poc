import { createNetsuiteVendor, NetsuiteVendor } from "./models/vendor";
import { createNetsuiteAccount, NetsuiteAccount } from "./models/account";
import { createNetsuiteEmployee, NetsuiteEmployee } from "./models/employee";
import { NetsuiteClient } from "./client";
import { netsuiteSoapEnvironment } from "../../environment";

const { logRequests } = netsuiteSoapEnvironment;

type NetsuiteServiceDependencies = {
    client: NetsuiteClient;
}
type SearchOptions = {
    count?: number;
}
type NetsuiteService = {
    getVendors(options: SearchOptions): Promise<NetsuiteVendor[]>;
    getAccounts(options: SearchOptions): Promise<NetsuiteAccount[]>;
    getEmployees(options: SearchOptions): Promise<NetsuiteEmployee[]>;
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
type Employee = {
    attributes: {
        internalId: string;
    },
    entityId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function buildNetsuiteService({
    client
}: NetsuiteServiceDependencies): NetsuiteService {
    
    async function getVendors({count: pageSize}: SearchOptions): Promise<NetsuiteVendor[]> {
        client.addSoapHeader({
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: pageSize ?? 10,
                bodyFieldsOnly: false
            }
        
        });
    
        const {response, rawRequest} = (await client.searchAsync<Vendor>({
            "platformMsgs:searchRecord": {
                attributes: {
                    "xmlns:ns2": "urn:relationships_2022_1.lists.webservices.netsuite.com",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:type": "ns2:VendorSearch"
                },
                "ns2:basic": {}
            }
        }));

        if(logRequests) {
            console.log("\n", rawRequest, "\n");
        }
    
        return response.searchResult.recordList.record.map((vendor: Vendor) => {
            return createNetsuiteVendor(
                vendor.entityId,
                vendor.companyName ?? vendor.legalName ?? vendor.entityId,
                vendor.defaultAddress
            );
        });
    }

    async function getAccounts({count: pageSize}: SearchOptions): Promise<NetsuiteAccount[]> {
        client.addSoapHeader({
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: pageSize ?? 10,
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

        if(logRequests) {
            console.log("\n", rawRequest, "\n");
        }
        

        return response.searchResult.recordList.record.map((account) => {
            return createNetsuiteAccount(
                Number(account.attributes.internalId),
                account.acctName,
                account.acctNumber,
                account.acctType
            )
        });
    }

    async function getEmployees({count: pageSize}: SearchOptions): Promise<NetsuiteEmployee[]> {
        client.addSoapHeader({
            preferences: {
                runServerSuiteScriptAndTriggerWorkflows: false,   
            },
            searchPreferences: {
                pageSize: pageSize ?? 10,
                bodyFieldsOnly: false
            }
        });

        const {response, rawRequest} = await client.searchAsync<Employee>({
            "platformMsgs:searchRecord": {
                attributes: {
                    "xmlns:ns2": "urn:employees_2022_1.lists.webservices.netsuite.com",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:type": "ns2:EmployeeSearch"
                },
                "ns2:basic": {}
            }
        });

        if(logRequests) {
            console.log("\n", rawRequest, "\n");
        }
        

        return response.searchResult.recordList.record.map((employee) => {
            return createNetsuiteEmployee(
                Number(employee.attributes.internalId),
                employee.entityId,
                employee.firstName,
                employee.lastName,
                employee.email
            )
        });
    }

    return {
        getVendors,
        getAccounts,
        getEmployees
    };
}