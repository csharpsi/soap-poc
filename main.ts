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
            result = await service.getVendors();
            break;
        default:
            result = {error: `Unsupported Feature: ${feature}`}
            break;
    }

    console.log(JSON.stringify(result, null, 4));
}

run(main);