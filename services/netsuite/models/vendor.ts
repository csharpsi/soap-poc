export type NetsuiteVendor = {
    id: string;
    name: string;
    address?: string;
}
export function createNetsuiteVendor(
    id: string,
    name: string,
    address?: string
): NetsuiteVendor {
    return {id, name, address};
}