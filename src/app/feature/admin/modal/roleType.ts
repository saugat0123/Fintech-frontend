export enum RoleType {
    MAKER = 'MAKER',
    APPROVAL = 'APPROVAL',
    COMMITTEE = 'COMMITTEE',
    CAD_ADMIN = 'CAD_ADMIN',
    ADMIN = 'ADMIN',
    CAD_SUPERVISOR = 'CAD_SUPERVISOR',

}

export namespace RoleType {

    export function values() {
        return Object.keys(RoleType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
