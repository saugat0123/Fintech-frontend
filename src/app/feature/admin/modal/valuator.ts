import {District} from './district';
import {Province} from './province';
import {MunicipalityVdc} from './municipality_VDC';
import {Branch} from './branch';

export class Valuator {
  id: number;
  created: Date;
  version: number;
  name: string;
  contactNo: string;
  status: string;
  state: string;
  province: Province;
  district: District;
  municipalityVdc: MunicipalityVdc;
  streetName: string;
  wardNumber: number;
  email: string;
  valuatingField: string;
  branch: Array<Branch>;
  bankAssociateDate: Date;
  minAmount: number;
  maxAmount: number;
  inactiveComment: string;
  isAllBranch: boolean;
  multipleValuator: any;
}
