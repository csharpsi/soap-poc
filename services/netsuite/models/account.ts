export type NetsuiteAccount = {
    internalId: number;
    name: string;
    number: string;
    type: string;
}

export function createNetsuiteAccount(
    internalId: number,
    name: string,
    number: string,
    type: string
): NetsuiteAccount {
    return {
        internalId,
        name,
        number,
        type
    }
}