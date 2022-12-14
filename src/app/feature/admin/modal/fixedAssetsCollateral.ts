import {InspectingStaff} from './inspectingStaff';

export class FixedAssetsCollateral {
  date: Date;
  address: string;
  nameOfPersonContacted: string;
  personContactedPhone: string;
  roadApproach: string;
  roadWidth: number;
  prominentPlace: string;
  approachDistance: number;
  waterSupply: boolean;
  electricity: boolean;
  boundryWallConstruction: boolean;
  boundryFencing: boolean;
  drainage: boolean;
  open: boolean;
  remarksForOtherFacility: string;
  building: boolean;
  buildingArea: number;
  dateOfBuildingConstruction: Date;
  qualityOfConstructionRemarks: string;
  loadBearingWall: boolean;
  mortarCement: boolean;
  otherRoofing: boolean;
  insideFurniture: boolean;
  frameStructure: boolean;
  rccRoofing: boolean;
  bathroomToilet: boolean;
  majorMarketplacesDistance: number;
  schoolCollegeDistance: number;
  hospitalNursingHomeDistance: number;
  electricityLineDistance: number;
  telephoneLineDistance: number;
  waterPipelineDistance: number;
  inspectingStaffList: Array<InspectingStaff> = new Array<InspectingStaff>();
  commentsAboutFAC: string;
  branchInchargeComment: string;
}
