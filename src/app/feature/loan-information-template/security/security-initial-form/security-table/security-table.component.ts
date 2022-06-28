import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Clients} from '../../../../../../environments/Clients';
import {environment} from '../../../../../../environments/environment';
import {FixAssetCollateralComponent} from '../fix-asset-collateral/fix-asset-collateral.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

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
  @Input() securityId;
  @Input() readMode;
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
  dialogRef: NbDialogRef<any>;

  constructor(private nbDialogService: NbDialogService) { }

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
          this.shareSecurityData = JSON.parse(this.shareSecurity.data);
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
    }
  }

  public sendSecurityName(formArrayName: string, securityName: string, index: number) {
    const valueToEmit = {formArrayName, securityName, index};
    this.securityEmitter.emit(valueToEmit);
    if (formArrayName === 'landDetails') {
     this.isLandSecurity = this.checkArray(this.landSecurity , index);
    }
    if (formArrayName === 'buildingDetails') {
      this.isApartmentSecurity =  this.checkArray(this.apartmentSecurity , index);;
    }
    if (formArrayName === 'landBuilding') {
      this.isLandAndBuilding = this.checkArray(this.landAndBuilding , index);
    }
    if (formArrayName === 'plantDetails') {
      this.isPlantAndMachinery =  this.checkArray(this.plantAndMachinery , index);;
    }
    if (formArrayName === 'vehicleDetails') {
      this.isVehicle = this.checkArray(this.vehicleSecurity , index);;
    }
    if (formArrayName === 'fixedDepositDetails') {
      this.isFixedDeposit = this.checkArray(this.fixedDeposit , index);;
    }
    if (formArrayName === 'shareSecurityDetails') {
      this.isShareSecurity = this.checkArray(this.shareSecurityData.shareSecurityDetails, index);;
    }
    if (formArrayName === 'hypothecationOfStock') {
      this.isHypothecation = this.checkArray(this.hypothecation , index);;
    }
    if (formArrayName === 'assignmentOfReceivables') {
      this.isAssignmentOfReceivables = this.checkArray(this.assignmentOfReceivables , index);;
    }
    if (formArrayName === 'leaseAssignment') {
      this.isleaseAssignment = this.checkArray(this.leaseAssignment , index);;
    }
    if (formArrayName === 'otherSecurity') {
      this.isOtherSecurity = this.checkArray(this.otherSecurity , index);;
    }
    if (formArrayName === 'corporateGuarantee') {
      this.isCorporateGuarantee = this.checkArray(this.corporateGuarantee , index);;
    }
    if (formArrayName === 'personalGuarantee') {
      this.isPersonalGuarantee =  this.checkArray(this.personalGuarantee , index);;
    }
    if (formArrayName === 'insurancePolicy') {
      this.isInsurancePolicy = this.checkArray(this.insurancePolicy , index);;
    }
  }

  openSiteVisitModel(security: string, uuid?: string) {
    // this.close();
    const context = {
      securityId: this.securityId,
      security: security,
      uuid: uuid
    };
    this.dialogRef = this.nbDialogService.open(FixAssetCollateralComponent, {
      context,
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true
    });
  }
  public close() {
      this.dialogRef.close();
  }
  checkArray(array, i) {
    array.splice(i, 1);
    if (array.length < 1) {
     return  false;
    } else {
      return true;
    }
  }
}
