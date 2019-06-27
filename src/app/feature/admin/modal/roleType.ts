export enum RoleType {
    MAKER = 'MAKER',
    APPROVAL = 'APPROVAL'

}

export namespace RoleType {

    export function values() {
        return Object.keys(RoleType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
