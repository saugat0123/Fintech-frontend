export enum ShareType {

  ORDINARY= 'ORDINARY' ,
   PROMOTER= 'PROMOTER'
}

export namespace ShareType {

  export function values() {
    return Object.keys(ShareType).filter(
        (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
