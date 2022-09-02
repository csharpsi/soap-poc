import { createClientAsync } from "soap";
import { netsuiteSoapEnvironment as env } from "../../environment";
import { SearchResponse } from "./model";
import { buildTokenPassportSecurity } from "./security";

export type NetsuiteClient = {
    addSoapHeader(header: any): void;
    searchAsync<T>(options: any): Promise<{
        response: SearchResponse<T>, 
        rawResponse?: string, 
        metadata?: object, 
        rawRequest?: string
    }>;
}

export async function buildNetsuiteClient(describe?: boolean): Promise<NetsuiteClient> {
    const { wsdl, webServiceUrl: endpoint } = env;
    
    const client = await createClientAsync(wsdl, {
        endpoint,
        useEmptyTag: true
    });

    if(describe){
        console.log(client.describe());
    }

    client.setSecurity(buildTokenPassportSecurity());

    function addSoapHeader(header: {}): void {
        client.clearSoapHeaders();
        client.addSoapHeader(() => ({...header}));
    }

    async function searchAsync<T>(options: any): Promise<{
        response: SearchResponse<T>, 
        rawResponse?: string, 
        metadata?: object, 
        rawRequest?: string
    }> {
        const [response, rawResponse, metadata, rawRequest] = (await client.searchAsync(options)) as [SearchResponse<T>, string, object, string];
        return {
            response,
            rawResponse,
            metadata,
            rawRequest
        };
    }

    return {
        addSoapHeader,
        searchAsync
    }
}