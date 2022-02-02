export enum RoleType {
    MAKER = 'MAKER',
    APPROVAL = 'APPROVAL',
    COMMITTEE = 'COMMITTEE',
    ADMIN = 'ADMIN',
    CAD_SUPERVISOR = 'CAD_SUPERVISOR',
    CAD_LEGAL = 'CAD_LEGAL',
    CRC = 'CRC',
    COPS = 'COPS'
}

export namespace RoleType {

    export function values() {
        return Object.keys(RoleType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
