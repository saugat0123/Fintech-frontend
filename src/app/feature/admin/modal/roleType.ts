export enum RoleType {
  MAKER = 'MAKER',
  APPROVAL = 'APPROVAL',
  COMMITTEE = 'COMMITTEE',
  CAD_ADMIN = 'CAD_ADMIN',
  ADMIN = 'ADMIN',
  CAD_SUPERVISOR = 'CAD_SUPERVISOR',
  CAD_LEGAL = 'CAD_LEGAL',
  CAS_CHECKER = 'Cas Checker',
  CAS_MAKER = 'Cas Maker',
  CAS_DOC_MAKER = 'Cas Doc Maker',
  CAS_DOC_CHECKER = 'Cas Doc Checker',
  CLAD_MAKER = 'Clad Maker',
  CLAD_CHECKER = 'Clad Checker'
}

export namespace RoleType {

  export function values() {
    return Object.keys(RoleType).filter(
        (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
