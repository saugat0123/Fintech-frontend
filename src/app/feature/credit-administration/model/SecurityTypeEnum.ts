export enum SecurityTypeEnum {
  AAA = 'Gold/Silver',
  CAA = 'Non Government Securities - Bonds',
  CAB = 'Non Government Securities - Shares',
  CAC = 'Non Government Securities - Others',
  DAA = 'Fixed A/c Receipt - On Own Bank',
  DAB = 'Fixed A/c Receipt - On Other Banks',
  EAA = 'Fixed Assets - Lands  & Buildings',
  EAB = 'Fixed Assets - Machinary & Tools',
  EAC = 'Fixed Assets - Furniture & Fixture',
  EAD = 'Fixed Assets - Vehicles',
  EAE = 'Fixed Assets - Other Fixed Assets',
  EAF = 'Current Assets Agro - Rice',
  EAG = 'Current Assets Agro - Raw Jute',
  EAH = 'Current Assets - Other Agricultural Products',
  EAI = 'Current Assets Non Agro - Raw Materials',
  EAJ = 'Current Assets Non Agro - Semi Ready Made Goods',
  EAK = 'Current Assets Non Agro - Salt, Sugar, Ghee, Oil',
  EAL = 'Current Assets Non Agro - Clothing',
  EAM = 'Current Assets Non Agro - Other Goods',
  FAA = 'Bills Guarantee - Domestic Bills',
  FAB = 'Bills Guarantee Foreign - Import Bill & Letter of Credit',
  FAC = 'Bills Guarantee Foreign - Export Bill',
  FAD = 'Bills Guarantee Foreign - Against  Export Bill',
  FAE = 'Bills Guarantee Foreign - Other Foreign Bills',
  GAA = 'Guarantee - Government Guarantee',
  GAB = 'Guarantee - Institutional Guarantee',
  GAC = 'Guarantee - Personal Guarantee',
  GAD = 'Guarantee - Group Guarantee',
  GAE = 'Guarantee - Internationally rated Banks Guarantee',
  GAF = 'On Other Guarantee',
  HAA = 'Credit, Debit Card',
  IAA = 'Other Securities',

}

export namespace SecurityTypeEnum {

  export function key() {
    return Object.keys(SecurityTypeEnum).filter(
        (type) => isNaN(<any>type) && type !== 'key' && type !== 'pair'
    );
  }

  export function pair() {
    const enums = [];
    key().forEach(elem => {
      enums.push({
        key: elem,
        value: SecurityTypeEnum[elem],
      });
    });
    return enums;
  }
}


