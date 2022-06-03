export enum Occupation {
  JOB_HOLDER = 'Job Holder',
  HOUSEWIFE = 'Housewife',
  FOREIGN_EMPLOYMENT = 'Foreign Employment',
  BUSINESS = 'Business',
  PENSIONER = 'Pensioner',
  FARMER = 'Farmer',
  MARKETABLE_SECURITIES_TRADER = 'Marketable Securities Trader',
  Freelancer = 'Freelancer',
  NA = 'Not Applicable'
}

export namespace Occupation {

  export function values() {
    return Object.keys(Occupation).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: Occupation[value]
      });
    });
    return enums;
  }
}
