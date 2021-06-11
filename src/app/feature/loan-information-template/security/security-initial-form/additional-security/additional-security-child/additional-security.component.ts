import {Component, Input, OnInit} from '@angular/core';
import {CalendarType} from '../../../../../../@core/model/calendar-type';
import {ShareSecurity} from '../../../../../admin/modal/shareSecurity';


@Component({
  selector: 'app-additional-security',
  templateUrl: './additional-security.component.html',
  styleUrls: ['./additional-security.component.scss']
})
export class AdditionalSecurityComponent implements OnInit {
  @Input() formData: string;
  @Input() calendarType: CalendarType;
  @Input() loanTag: string;
  @Input() shareSecurityData;
  @Input() customerSecurityId: number;
  @Input() customerInfoId: number;
  @Input() isContainedApprovedLoan;

  securityTypes = [
    {key: 'LandSecurity', value: 'Land Security'},
    {key: 'VehicleSecurity', value: 'Vehicle Security'},
    {key: 'ApartmentSecurity', value: 'Apartment Security'},
    {key: 'LandAndBuildingSecurity', value: 'Land and Building Security'},
    {key: 'PlantAndMachinerySecurity', value: 'Plant and Machinery Security'},
    {key: 'FixedDepositSecurity', value: 'Fixed Deposit Receipt'},
    {key: 'ShareSecurity', value: 'Share Security'},
    {key: 'HypothecationOfStockSecurity', value: 'Hypothecation of Stock'},
    {key: 'CorporateGuaranteeSecurity', value: 'Corporate Guarantee'},
    {key: 'PersonalGuaranteeSecurity', value: 'Personal Guarantee'},
    {key: 'InsurancePolicySecurity', value: 'Insurance Policy Security'},
    {key: 'AssignmentOfReceivablesSecurity', value: 'Assignment of Receivables'},
    {key: 'LeaseAssignmentSecurity', value: 'Lease Assignment'},
    {key: 'OtherSecurity', value: 'Other Security'}
  ];

  landSecurity = false;
  vehicleSecurity = false;
  apartmentSecurity = false;
  landAndBuildingSecurity = false;
  plantAndMachinerySecurity = false;
  fixedDepositSecurity = false;
  shareSecurity = false;
  hypothecationOfStockSecurity = false;
  corporateGuaranteeSecurity = false;
  personalGuaranteeSecurity = false;
  insurancePolicySecurity = false;
  assignmentOfReceivablesSecurity = false;
  leaseAssignmentSecurity = false;
  otherSecuritySecurity = false;

  constructor() {}


  ngOnInit() {}

  public selectedSecurity(selectedSecurity: string): void {
    this.landSecurity = this.vehicleSecurity = this.apartmentSecurity = this.landAndBuildingSecurity =
    this.plantAndMachinerySecurity = this.fixedDepositSecurity = this.shareSecurity = this.hypothecationOfStockSecurity =
    this.corporateGuaranteeSecurity = this.personalGuaranteeSecurity = this.insurancePolicySecurity =
    this.assignmentOfReceivablesSecurity = this.leaseAssignmentSecurity = this.otherSecuritySecurity = false;
    switch (selectedSecurity) {
      case 'LandSecurity':
        this.landSecurity = true;
            break;
      case 'VehicleSecurity':
        this.vehicleSecurity = true;
        break;
      case 'ApartmentSecurity':
        this.apartmentSecurity = true;
        break;
      case 'LandAndBuildingSecurity':
        this.landAndBuildingSecurity = true;
        break;
      case 'PlantAndMachinerySecurity':
        this.plantAndMachinerySecurity = true;
        break;
      case 'FixedDepositSecurity':
        this.fixedDepositSecurity = true;
        break;
      case 'ShareSecurity':
        this.shareSecurity = true;
        break;
      case 'HypothecationOfStockSecurity':
        this.hypothecationOfStockSecurity = true;
        break;
      case 'CorporateGuaranteeSecurity':
        this.corporateGuaranteeSecurity = true;
        break;
      case 'PersonalGuaranteeSecurity':
        this.personalGuaranteeSecurity = true;
        break;
      case 'InsurancePolicySecurity':
        this.insurancePolicySecurity = true;
        break;
      case 'AssignmentOfReceivablesSecurity':
        this.assignmentOfReceivablesSecurity = true;
        break;
      case 'LeaseAssignmentSecurity':
        this.leaseAssignmentSecurity = true;
        break;
      case 'OtherSecurity':
        this.otherSecuritySecurity = true;
        break;
    }
  }

}
