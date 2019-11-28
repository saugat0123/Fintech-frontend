export enum IncomeSource {
  SALARY = 'Salary',
  RENT = 'Rent',
  REMITTANCE = 'Remittance',
  VEHICLE = 'Vehicle Income',
  BUSINESS = 'Business',
  PROFIT = 'Business Profit',
  PENSION = 'Pension',
  CAPITAL_GAIN = 'Capital Gain Income',
  AGRICULTURE = 'Agriculture'
}

export namespace IncomeSource {

  export function values() {
    return Object.keys(IncomeSource).filter(
        (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
    );
  }

  export function enumObject() {
    const enums = [];
    values().forEach(value => {
      enums.push({
        key: value,
        value: IncomeSource[value]
      });
    });
    return enums;
  }
}
