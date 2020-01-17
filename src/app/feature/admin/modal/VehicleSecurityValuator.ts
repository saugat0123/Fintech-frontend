import {Valuator} from './valuator';

export class VehicleSecurityValuator {
  id: number;
  vehicleName: string;
  model: string;
  manufactureYear: Date;
  registrationNumber: string;
  valuationAmount: number;
  engineNumber: string;
  chassisNumber: string;
  registrationDate: Date;
  color: string;
  purpose: string;
  supplier: string;
  downPayment: number;
  loanExposure: number;
  showroomCommission: number;
  valuator: Valuator;
  valuatedDate: Date;
  valuatorRepresentativeName: string;
  staffRepresentativeName: string;
  version: number;
}
