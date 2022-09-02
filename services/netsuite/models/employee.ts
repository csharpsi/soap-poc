export type NetsuiteEmployee = {
    internalId: number;
    entityId: string;
    firstName: string;
    lastName: string;
    email: string;
}

export function createNetsuiteEmployee(
    internalId: number,
    entityId: string,
    firstName: string,
    lastName: string,
    email: string
): NetsuiteEmployee {
    return {
        internalId,
        entityId,
        firstName,
        lastName,
        email
    }
}