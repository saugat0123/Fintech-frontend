import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-security-table',
  templateUrl: './security-table.component.html',
  styleUrls: ['./security-table.component.scss']
})
export class SecurityTableComponent implements OnInit {
  @Input() formDataForEdit: Object;
  @Input() shareSecurity: any;
  @Output() securityEmitter = new EventEmitter<any>();
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
        const value = f.owner;
        if (!ObjectUtil.isEmpty(value)) {
          this.landSecurity = this.formDataForEdit['landDetails'];
          this.isLandSecurity = true;
        }
      });

    // apartment security
    this.formDataForEdit['buildingDetails'].filter(f => {
      const value = f.buildArea;
      if (!ObjectUtil.isEmpty(value)) {
        this.apartmentSecurity = this.formDataForEdit['buildingDetails'];
        this.isApartmentSecurity = true;
      }
    });
    // land and building security
    this.formDataForEdit['landBuilding'].filter(f => {
      const value = f.owner;
      if (!ObjectUtil.isEmpty(value)) {
        this.landAndBuilding = this.formDataForEdit['landBuilding'];
        this.isLandAndBuilding = true;
      }
    });
    // plant and machinery security
    this.formDataForEdit['plantDetails'].filter(f => {
      const value = f.model;
      if (!ObjectUtil.isEmpty(value)) {
        this.plantAndMachinery = this.formDataForEdit['plantDetails'];
        this.isPlantAndMachinery = true;
      }
    });
    // // vehicle security
    this.formDataForEdit['vehicleDetails'].filter(f => {
      const value = f.model;
      if (!ObjectUtil.isEmpty(value)) {
        this.vehicleSecurity = this.formDataForEdit['vehicleDetails'];
        this.isVehicle = true;
      }
    });
    // fixed deposit receipt security
    this.formDataForEdit['fixedDepositDetails'].filter(f => {
      const value = f.accountNumber;
      if (!ObjectUtil.isEmpty(value)) {
        this.fixedDeposit = this.formDataForEdit['fixedDepositDetails'];
        this.isFixedDeposit = true;
      }
    });
    //
    // // shared security
    if (!ObjectUtil.isEmpty(this.shareSecurity)) {
      this.shareSecurityData = JSON.parse(this.shareSecurity.data);
      const shareControlValue = this.shareSecurityData.shareSecurityDetails;
      shareControlValue.forEach(f => {
        const value = f.companyName;
        if (!ObjectUtil.isEmpty(value)) {
          this.isShareSecurity = true;
        }
      });
    }
    // hypothecation of stock security
    this.formDataForEdit['hypothecationOfStock'].filter(f => {
      const value = f.owner;
      if (!ObjectUtil.isEmpty(value)) {
        this.hypothecation = this.formDataForEdit['hypothecationOfStock'];
        this.isHypothecation = true;
      }
    });
    // assignment of receivables
    this.formDataForEdit['assignmentOfReceivables'].filter(f => {
      const value = f.amount;
      if (!ObjectUtil.isEmpty(value)) {
        this.assignmentOfReceivables = this.formDataForEdit['assignmentOfReceivables'];
        this.isAssignmentOfReceivables = true;
      }
    });
    // lease assignment
    this.formDataForEdit['leaseAssignment'].filter(f => {
      const value = f.otherDetail;
      if (!ObjectUtil.isEmpty(value)) {
        this.leaseAssignment = this.formDataForEdit['leaseAssignment'];
        this.isleaseAssignment = true;
      }
    });
    // other security
    this.formDataForEdit['otherSecurity'].filter(f => {
      const value = f.otherDetail;
      if (!ObjectUtil.isEmpty(value)) {
        this.otherSecurity = this.formDataForEdit['otherSecurity'];
        this.isOtherSecurity = true;
      }
    });
    // corporate guarantee
    this.formDataForEdit['corporateGuarantee'].filter(f => {
      const value = f.name;
      if (!ObjectUtil.isEmpty(value)) {
        this.corporateGuarantee = this.formDataForEdit['corporateGuarantee'];
        this.isCorporateGuarantee = true;
      }
    });
    // personal guarantee
    this.formDataForEdit['personalGuarantee'].filter(f => {
      const value = f.name;
      if (!ObjectUtil.isEmpty(value)) {
        this.personalGuarantee = this.formDataForEdit['personalGuarantee'];
        this.isPersonalGuarantee = true;
      }
    });
    // insurance policy
    this.formDataForEdit['insurancePolicy'].filter(f => {
      const value = f.insuredAmount;
      if (!ObjectUtil.isEmpty(value)) {
        this.insurancePolicy = this.formDataForEdit['insurancePolicy'];
        this.isInsurancePolicy = true;
      }
    });
  }

  public sendSecurityName(formArrayName: string) {
    this.securityEmitter.emit(formArrayName);
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
  }

}
