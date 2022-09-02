import { config } from "dotenv";

config();

type Environment = {
    webServiceUrl: string;
    account: string;
    consumerKey: string;
    consumerSecret: string;
    tokenId: string;
    tokenSecret: string;
    wsdl: string;
    logRequests: boolean;
}

export const netsuiteSoapEnvironment: Environment = {
    webServiceUrl: process.env["NETSUITE_SERVICE_URL"] ?? "",
    account: process.env["NETSUITE_ACCOUNT"] ?? "",
    consumerKey: process.env["NETSUITE_CONSUMER_KEY"] ?? "",
    consumerSecret: process.env["NETSUITE_CONSUMER_SECRET"] ?? "",
    tokenId: process.env["NETSUITE_TOKEN_ID"] ?? "",
    tokenSecret: process.env["NETSUITE_TOKEN_SECRET"] ?? "",
    wsdl: "https://webservices.netsuite.com/wsdl/v2022_1_0/netsuite.wsdl",
    logRequests: false // if true, the raw request XML will be logged to the console
};