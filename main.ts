import { run } from "./iife";
import { buildNetsuiteService } from "./services/netsuite";
import { buildNetsuiteClient } from "./services/netsuite/client";

async function main(args: Set<string>): Promise<void> {
    
    const describeMode = args.has("describe");
    const client = await buildNetsuiteClient(describeMode);

    if(describeMode){
        return;
    }

    const service = buildNetsuiteService({client});

    const [feature] = args;
    let result: any;

    switch(feature) {
        case "vendors":
            result = await service.getVendors({count: 10});
            break;
        case "accounts":
            result = await service.getAccounts({count: 10});
            break;
        case "employees":
            result = await service.getEmployees({count: 10});
            break;
        default:
            result = await Promise.all([
                service.getVendors({count: 10}),
                service.getAccounts({count: 20}),
                service.getEmployees({count: 30})
            ]);
            break;
    }

    console.log(JSON.stringify(result, null, 4));
}

run(main);