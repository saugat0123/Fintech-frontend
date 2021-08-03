import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-security-table',
  templateUrl: './security-table.component.html',
  styleUrls: ['./security-table.component.scss']
})
export class SecurityTableComponent implements OnInit {
  @Input() formDataForEdit: Object;
  @Input() shareSecurity: any;
  @Output() securityEmitter = new EventEmitter<any>();
  @Input() selectedArray = [];
  clients = environment.client;
  clientName = Clients;
  isLandSecurity = false;
  landSecurity: any;
  isApartmentSecurity = false;
  apartmentSecurity: any;
  isLandAndBuilding = false;
  landAndBuilding: any;
  isPlantAndMachinery = false;
  plantAndMachinery: any;
  isVehicle = false;
  vehicleSecurity: any;
  isFixedDeposit = false;
  fixedDeposit: any;
  isSharedSecurity = false;
  sharedSecurity: any;
  isHypothecation = false;
  hypothecation: any;
  isAssignmentOfReceivables = false;
  assignmentOfReceivables: any;
  isleaseAssignment = false;
  leaseAssignment: any;
  isOtherSecurity = false;
  otherSecurity: any;
  isCorporateGuarantee = false;
  corporateGuarantee: any;
  isPersonalGuarantee = false;
  personalGuarantee: any;
  isInsurancePolicy = false;
  insurancePolicy: any;
  isShareSecurity = false;
  shareSecurityData: any;
  isBondSecurity = false;
  bondSecurity: any;

  constructor() { }

  ngOnInit() {
    if (this.selectedArray !== undefined) {
      // land security
      this.selectedArray.filter(f => {
        if (f.indexOf('LandSecurity') !== -1) {
          this.landSecurity = this.formDataForEdit['landDetails'];
          this.isLandSecurity = true;
        }
      });

      // apartment security
      this.selectedArray.filter(f => {
        if (f.indexOf('ApartmentSecurity') !== -1) {
          this.apartmentSecurity = this.formDataForEdit['buildingDetails'];
          this.isApartmentSecurity = true;
        }
      });
      // land and building security
      this.selectedArray.filter(f => {
        if (f.indexOf('Land and Building Security') !== -1) {
          this.landAndBuilding = this.formDataForEdit['landBuilding'];
          this.isLandAndBuilding = true;
        }
      });
      // plant and machinery security
      this.selectedArray.filter(f => {
        if (f.indexOf('PlantSecurity') !== -1) {
          this.plantAndMachinery = this.formDataForEdit['plantDetails'];
          this.isPlantAndMachinery = true;
        }
      });
      // vehicle security
      this.selectedArray.filter(f => {
        if (f.indexOf('VehicleSecurity') !== -1) {
          this.vehicleSecurity = this.formDataForEdit['vehicleDetails'];
          this.isVehicle = true;
        }
      });
      // fixed deposit receipt security
      this.selectedArray.filter(f => {
        if (f.indexOf('FixedDeposit') !== -1) {
          this.fixedDeposit = this.formDataForEdit['fixedDepositDetails'];
          this.isFixedDeposit = true;
        }
      });
      // shared security
      this.selectedArray.forEach(f => {
        if (f.indexOf('ShareSecurity') !== -1) {
          this.isShareSecurity = true;
        }
      });
      // hypothecation of stock security
      this.selectedArray.filter(f => {
        if (f.indexOf('HypothecationOfStock') !== -1) {
          this.hypothecation = this.formDataForEdit['hypothecationOfStock'];
          this.isHypothecation = true;
        }
      });
      // assignment of receivables
      this.selectedArray.filter(f => {
        if (f.indexOf('AssignmentOfReceivables') !== -1) {
          this.assignmentOfReceivables = this.formDataForEdit['assignmentOfReceivables'];
          this.isAssignmentOfReceivables = true;
        }
      });
      // lease assignment
      this.selectedArray.filter(f => {
        if (f.indexOf('LeaseAssignment') !== -1) {
          this.leaseAssignment = this.formDataForEdit['leaseAssignment'];
          this.isleaseAssignment = true;
        }
      });
      // other security
      this.selectedArray.filter(f => {
        if (f.indexOf('OtherSecurity') !== -1) {
          this.otherSecurity = this.formDataForEdit['otherSecurity'];
          this.isOtherSecurity = true;
        }
      });
      // corporate guarantee
      this.selectedArray.filter(f => {
        if (f.indexOf('CorporateGuarantee') !== -1) {
          this.corporateGuarantee = this.formDataForEdit['corporateGuarantee'];
          this.isCorporateGuarantee = true;
        }
      });
      // personal guarantee
      this.selectedArray.filter(f => {
        if (f.indexOf('PersonalGuarantee') !== -1) {
          this.personalGuarantee = this.formDataForEdit['personalGuarantee'];
          this.isPersonalGuarantee = true;
        }
      });
      // insurance policy
      this.selectedArray.filter(f => {
        if (f.indexOf('InsurancePolicySecurity') !== -1) {
          this.insurancePolicy = this.formDataForEdit['insurancePolicy'];
          this.isInsurancePolicy = true;
        }
      });
      this.selectedArray.filter(f => {
        if (f.indexOf('BondSecurity') !== -1) {
          this.bondSecurity = this.formDataForEdit['bondSecurity'];
          this.isBondSecurity = true;
        }
      });
    }
  }

  public sendSecurityName(formArrayName: string, securityName: string) {
    const valueToEmit = {formArrayName, securityName};
    this.securityEmitter.emit(valueToEmit);
    if (formArrayName === 'landDetails') {
      this.isLandSecurity = false;
    }
    if (formArrayName === 'buildingDetails') {
      this.isApartmentSecurity = false;
    }
    if (formArrayName === 'landBuilding') {
      this.isLandAndBuilding = false;
    }
    if (formArrayName === 'plantDetails') {
      this.isPlantAndMachinery = false;
    }
    if (formArrayName === 'vehicleDetails') {
      this.isVehicle = false;
    }
    if (formArrayName === 'fixedDepositDetails') {
      this.isFixedDeposit = false;
    }
    if (formArrayName === 'shareSecurityDetails') {
      this.isShareSecurity = false;
    }
    if (formArrayName === 'hypothecationOfStock') {
      this.isHypothecation = false;
    }
    if (formArrayName === 'assignmentOfReceivables') {
      this.isAssignmentOfReceivables = false;
    }
    if (formArrayName === 'leaseAssignment') {
      this.isleaseAssignment = false;
    }
    if (formArrayName === 'otherSecurity') {
      this.isOtherSecurity = false;
    }
    if (formArrayName === 'corporateGuarantee') {
      this.isCorporateGuarantee = false;
    }
    if (formArrayName === 'personalGuarantee') {
      this.isPersonalGuarantee = false;
    }
    if (formArrayName === 'insurancePolicy') {
      this.isInsurancePolicy = false;
    }
    if (formArrayName === 'bondSecurity') {
      this.isBondSecurity = false;
    }
  }

}
