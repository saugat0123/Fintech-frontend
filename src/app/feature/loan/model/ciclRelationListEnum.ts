export enum CiclRelationListEnum {
  BORROWER = 'Borrower',
  GUARANTOR = 'Guarantor',
  COLLATERAL_OWNER = 'Collateral Owner',
  SHAREHOLDER = 'Shareholder',
  DIRECTOR = 'Director',
  PROPRIETOR = 'Proprietor',
  CEO = 'Ceo',
  MANAGING_DIRECTOR_AUTHORIZED_PERSON = 'Managing Director',
  AUTHORIZED_PERSON = ' Authorized Person',
  OTHERS = 'Others',
}

export namespace CiclRelationListEnum {

  export function key() {
    return Object.keys(CiclRelationListEnum).filter(
        (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
    );
  }
  export function pair() {
    const enums = [];
    key().forEach(elem => {
      enums.push({
        key: elem,
        value: CiclRelationListEnum[elem],
      });
    });
    return enums;
  }
}


