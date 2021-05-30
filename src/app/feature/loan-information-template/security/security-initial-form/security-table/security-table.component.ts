import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-table',
  templateUrl: './security-table.component.html',
  styleUrls: ['./security-table.component.scss']
})
export class SecurityTableComponent implements OnInit {
  @Input() formDataForEdit: Object;
  @Input() shareSecurity: any;
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

  constructor() { }

  ngOnInit() {
    // land security
      this.formDataForEdit['landDetails'].filter(f => {
        if (f.owner !== '') {
          this.landSecurity = this.formDataForEdit['landDetails'];
          this.isLandSecurity = true;
        }
      });

    // apartment security
    this.formDataForEdit['buildingDetails'].filter(f => {
      if (f.buildArea !== '') {
        this.apartmentSecurity = this.formDataForEdit['buildingDetails'];
        this.isApartmentSecurity = true;
      }
    });
    // land and building security
    this.formDataForEdit['landBuilding'].filter(f => {
      if (f.owner !== null) {
        this.landAndBuilding = this.formDataForEdit['landBuilding'];
        this.isLandAndBuilding = true;
      }
    });
    // plant and machinery security
    this.formDataForEdit['plantDetails'].filter(f => {
      if (f.model !== '') {
        this.plantAndMachinery = this.formDataForEdit['plantDetails'];
        this.isPlantAndMachinery = true;
      }
    });
    // // vehicle security
    this.formDataForEdit['vehicleDetails'].filter(f => {
      if (f.model !== '') {
        this.vehicleSecurity = this.formDataForEdit['vehicleDetails'];
        this.isVehicle = true;
      }
    });
    // fixed deposit receipt security
    this.formDataForEdit['fixedDepositDetails'].filter(f => {
      if (f.accountNumber !== null) {
        this.fixedDeposit = this.formDataForEdit['fixedDepositDetails'];
        this.isFixedDeposit = true;
      }
    });
    //
    // // shared security
    if (!ObjectUtil.isEmpty(this.shareSecurity)) {
      this.shareSecurityData = JSON.parse(this.shareSecurity.data);
      if (this.shareSecurityData.avgDaysForPrice !== '') {
        this.isShareSecurity = true;
      }
    }
    // hypothecation of stock security
    this.formDataForEdit['hypothecationOfStock'].filter(f => {
      if (f.owner !== null) {
        this.hypothecation = this.formDataForEdit['hypothecationOfStock'];
        this.isHypothecation = true;
      }
    });
    // assignment of receivables
    this.formDataForEdit['assignmentOfReceivables'].filter(f => {
      if (f.amount !== null) {
        this.assignmentOfReceivables = this.formDataForEdit['assignmentOfReceivables'];
        this.isAssignmentOfReceivables = true;
      }
    });
    // lease assignment
    this.formDataForEdit['leaseAssignment'].filter(f => {
      if (f.otherDetail !== '') {
        this.leaseAssignment = this.formDataForEdit['leaseAssignment'];
        this.isleaseAssignment = true;
      }
    });
    // other security
    this.formDataForEdit['otherSecurity'].filter(f => {
      if (f.otherDetail !== '') {
        this.otherSecurity = this.formDataForEdit['otherSecurity'];
        this.isOtherSecurity = true;
      }
    });
    // corporate guarantee
    this.formDataForEdit['corporateGuarantee'].filter(f => {
      if (f.name !== null) {
        this.corporateGuarantee = this.formDataForEdit['corporateGuarantee'];
        this.isCorporateGuarantee = true;
      }
    });
    // personal guarantee
    this.formDataForEdit['personalGuarantee'].filter(f => {
      if (f.name !== null) {
        this.personalGuarantee = this.formDataForEdit['personalGuarantee'];
        this.isPersonalGuarantee = true;
      }
    });
    // insurance policy
    this.formDataForEdit['insurancePolicy'].filter(f => {
      if (f.insuredAmount !== null) {
        this.insurancePolicy = this.formDataForEdit['insurancePolicy'];
        this.isInsurancePolicy = true;
      }
    });
  }

}
