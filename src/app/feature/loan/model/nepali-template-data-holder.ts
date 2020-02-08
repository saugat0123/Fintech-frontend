import {NepaliTemplateType} from '../../admin/modal/nepali-template-type.enum';
import {Province} from '../../admin/modal/province';
import {District} from '../../admin/modal/district';
import {MunicipalityVdc} from '../../admin/modal/municipality_VDC';
import {CustomerRelative} from '../../admin/modal/customer-relative';

/**
 * @description This is a model class to hold the data of Nepali templates.
 */
export class NepaliTemplateDataHolder {
  id: number;
  type: NepaliTemplateType;
  data: string;
  customerName: string;
  dob: Date;
  customerId: string;
  accountNo: string;
  province: Province;
  district: District;
  municipalities: MunicipalityVdc;
  street: string;
  wardNumber: string;
  contactNumber: string;
  email: string;
  initialRelationDate: Date;
  citizenshipNumber: string;
  citizenshipIssuedDate: Date;
  citizenshipIssuedPlace: string;
  status: string;
  customerRelatives: Array<CustomerRelative>;
  occupation: string;
  incomeSource: string;
  version: number;
}
