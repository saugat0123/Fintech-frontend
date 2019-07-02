export enum RoleAccess {
    SPECIFIC = 'SPECIFIC',
    OWN = 'OWN',
    ALL = 'ALL'

}

export namespace RoleAccess {

    export function values() {
        return Object.keys(RoleAccess).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
