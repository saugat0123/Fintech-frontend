import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {FormArray} from '@angular/forms';


@Component({
  selector: 'app-security-summary',
  templateUrl: './security-summary.component.html',
  styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
  @Input() formData: Object;
  @Input() shareSecurity;
  landSelected = false;
  apartmentSelected = false;
  plantSelected = false;
  vehicleSelected = false;
  depositSelected = false;
  shareSelected = false;
  isPresentGuarantor = false;
  totalAmount = 0;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  buildingSelected = false;
  hypothecation = false;
  securityOther = false;
  corporate = false;
  personal = false;
  loanSharePercent: NepseMaster = new NepseMaster();
  landBuilding = false;
  showTitle = false;
  insurancePolicySelected = false;
  client = environment.client;
  clientName = Clients;
  ownerShipTransfer = OwnershipTransfer;
  assignment = false;
  otherDetail: any;
  assignments = false;
  leaseAssignment: any;
  landSecurities = {
    totaldv: 0,
    totalmv: 0,
    totalcv: 0
  };
  buildingSecurities = {
    totaldv: 0,
    totalmv: 0,
    totalcv: 0
  };
  landAndBuildingSecurities = {
    totaldv: 0,
    totalmv: 0,
    totalcv: 0
  };

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formData)) {
      (this.formData['selectedArray'] as Array<any>).forEach(selectedValue => {
        switch (selectedValue) {
          case 'LandSecurity' :
            this.showTitle = true;
            this.landSelected = true;
            break;
          case 'VehicleSecurity' :
            this.showTitle = true;
            this.vehicleSelected = true;
            break;
          case 'ApartmentSecurity' :
            this.showTitle = true;
            this.apartmentSelected = true;
            break;
          case 'Land and Building Security' :
            this.showTitle = true;
            this.landBuilding = true;
            break;
          case 'PlantSecurity' :
            this.showTitle = true;
            this.plantSelected = true;
            break;
          case 'FixedDeposit':
            this.showTitle = true;
            this.depositSelected = true;
            break;
          case 'ShareSecurity':
            this.showTitle = true;
            this.shareSelected = true;
            break;
          case 'HypothecationOfStock':
            this.showTitle = true;
            this.hypothecation = true;
            break;
          case 'OtherSecurity':
            this.showTitle = true;
            this.securityOther = true;
            break;
          case 'LeaseAssignment':
            this.showTitle = true;
            this.assignments = true;
            break;
          case 'CorporateGuarantee':
            this.showTitle = true;
            this.corporate = true;
            break;
          case 'PersonalGuarantee':
            this.showTitle = true;
            this.personal = true;
            break;
          case 'InsurancePolicySecurity':
            this.showTitle = true;
            this.insurancePolicySelected = true;
            break;
          case 'AssignmentOfReceivables':
            this.showTitle = true;
            this.assignment = true;
        }
      });
    }

    if (this.depositSelected) {
      this.calculateTotal();
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
    if (this.apartmentSelected) {
      this.calcBuildingSecuritiesTotal();
    }
    if (this.landSelected) {
      this.calcLandSecuritiesTotal();
    }
    if (this.landAndBuildingSecurities) {
      this.calcLandAndBuildingSecurityTotal();
    }

    if (this.formData['guarantorsForm']['guarantorsDetails'].length !== 0) {
      this.isPresentGuarantor = true;
    }
  }

  calculateTotal() {
    const depositList = this.formData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }

  private calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }

  calcLandSecuritiesTotal() {
    this.formData['initialForm']['landDetails'].forEach(sec => {
      if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
        this.landSecurities['totaldv'] += Number(sec['revaluationData']['reValuatedDv']);
        this.landSecurities['totalmv'] += Number(sec['revaluationData']['reValuatedFmv']);
        this.landSecurities['totalcv'] += Number(sec['revaluationData']['reValuatedConsideredValue']);
      } else {
        this.landSecurities['totaldv'] += Number(sec['distressValue']);
        this.landSecurities['totalmv'] += Number(sec['marketValue']);
        this.landSecurities['totalcv'] += Number(sec['landConsideredValue']);
      }
    });
  }

  calcBuildingSecuritiesTotal() {
    this.formData['initialForm']['buildingDetails'].forEach(sec => {
      if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
        this.buildingSecurities['totaldv'] += Number(sec['revaluationData']['reValuatedDv']);
        this.buildingSecurities['totalmv'] += Number(sec['revaluationData']['reValuatedFmv']);
        this.buildingSecurities['totalcv'] += Number(sec['revaluationData']['reValuatedConsideredValue']);
      } else {
        this.buildingSecurities['totaldv'] += Number(sec['buildingDistressValue']);
        this.buildingSecurities['totalmv'] += Number(sec['buildingFairMarketValue']);
        this.buildingSecurities['totalcv'] += Number(sec['buildingConsideredValue']);
      }
    });
  }

  calcLandAndBuildingSecurityTotal() {
    this.formData['initialForm']['landBuilding'].forEach(sec => {
      if (sec['revaluationData'] !== null && sec['revaluationData']['isReValuated']) {
        this.landAndBuildingSecurities['totaldv'] += Number(sec['revaluationData']['reValuatedDv']);
        this.landAndBuildingSecurities['totalmv'] += Number(sec['revaluationData']['reValuatedFmv']);
        this.landAndBuildingSecurities['totalcv'] += Number(sec['revaluationData']['reValuatedConsideredValue']);
      } else {
        this.landAndBuildingSecurities['totaldv'] += Number(sec['distressValue']);
        this.landAndBuildingSecurities['totalmv'] += Number(sec['marketValue']);
        this.landAndBuildingSecurities['totalcv'] += Number(sec['landConsideredValue']);
      }
    });
  }
}
