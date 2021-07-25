export enum RegisteredOfficeList {
  DEPARTMENT_OF_COMMERCE= 'Department of Commerce',
CHAMBER_OF_COMMERCE= 'Chamber of Commerce',
COOPERATIVE_DIVISION_OFFICE = 'Co-Operative Division Office',
DEPARTMENT_OF_COOPERATIVE= 'Department of Cooperative',
DEPARTMENT_OF_DRUG_ADMINISTRATION= 'Department of Drug Administration',
DEPARTMENT_OF_INDUSTRY= 'Department of Industry',
DEPARTMENT_OF_INDUSTRY_AND_COMMERCE = 'Department of Industry & Commerce',
DEPARTMENT_OF_TRANSPORT_MANAGEMENT =  'Department of Transport Management',
DEPARTMENT_OF_COMMERCE_AND_SUPPLY_MANAGEMENT = 'Department of Commerce & Supply Management',
DEPARTMENT_OF_LIVESTOCK_SERVICE= 'Department of Livestock Service',
DISTRICT_ADMINISTRATION_OFFICE= 'District Administration Office',
DISTRICT_DEVELOPMENT_COMMITTEE= 'District Development Committee',
DISTRICT_EDUCATION_OFFICE= 'District Education Office',
DISTRICT_IRRIGATION_COMMITTEE= 'District Irrigation Committee',
FNCCI= 'FNCCI',
INLAND_REVENUE_DEPARTMENT= 'Inland Revenue Department',
INLAND_REVENUE_OFFICE= 'Inland Revenue Office',
INSTITUTE_OF_CHARTERED_ACCOUNTANT_NEPAL= 'Institute of Chartered Accountant Nepal',
MUNICIPALITY_OFFICE= 'Municipality Office',
NATIONAL_SPORTS_COUNCIL= 'National Sports Council',
NEPAL_CMA_SANGHA= 'Nepal CMA Sangha',
OFFICE_OF_COMPANY_REGISTRAR= 'Office of Company Registrar',
OFFICE_OF_COTTAGE_AND_SMALL_INDUSTRY= 'Office of Cottage & Small Industry ',
TRIBHUWAN_UNIVERSITY= 'Tribhuwan University',
VDC_OFFICE= 'VDC Office',
  DEPARTMENT_OF_COMMERCE_SUPPLIES_AND_CUNSUMER_PROTECTION_MANAGEMENT= 'Department of Commerce, Supplies & Consumer Protection Management',
OTHER= 'Other',
}

export namespace RegisteredOfficeList {
  export function values() {
    return Object.keys(RegisteredOfficeList).filter((data) => isNaN(<any>(data)) && data !== 'values' && data !== 'enumObject');
  }
  export function enumObject() {
    const  enums = [];
    values().forEach(data => {
      enums.push( {key: data, value: RegisteredOfficeList[data]} );
    });
    return enums;

  }
}

