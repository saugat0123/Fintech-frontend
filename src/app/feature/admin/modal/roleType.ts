export enum RoleType {
    MAKER = 'MAKER',
    APPROVAL = 'APPROVAL',
    COMMITTEE = 'COMMITTEE',
    CAD_ADMIN = 'CAD_ADMIN',
    DISBURSEMENT_ADMIN = 'DISBURSEMENT_ADMIN',
    LEGAL_ADMIN = 'LEGAL_ADMIN',
    ADMIN = 'ADMIN'

}

export namespace RoleType {

    export function values() {
        return Object.keys(RoleType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
