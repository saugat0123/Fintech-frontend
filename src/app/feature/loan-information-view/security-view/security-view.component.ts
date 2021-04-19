import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {OwnershipTransfer} from '../../loan/model/ownershipTransfer';
import {environment as envSrdb} from '../../../../environments/environment.srdb';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-security-view',
  templateUrl: './security-view.component.html',
  styleUrls: ['./security-view.component.scss']
})
export class SecurityViewComponent implements OnInit {
  @Input() security: Security;
  @Input() shareSecurityData;
  securityData: Security;
  shareSecurity;
  vehicleSelected = false;
  landSelected = false;
  hypothecation = false;
  corporate = false;
  personal = false;
  apartmentSelected = false;
  plantSelected = false;
  depositSelected = false;
  totalAmount = 0;
  shareSelected = false;
  insurancePolicySelected = false;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  loanSharePercent: NepseMaster = new NepseMaster();
  buildingSelected = false;
  landBuilding = false;
  ownerShipTransfer = OwnershipTransfer;
  disableCrgAlphaParams = envSrdb.disableCrgAlpha;
  crgLambdaDisabled = envSrdb.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  securityOther: any;
  assignments: any;
  assignment = false;
  buildingSecurities = {
    totaldv: 0,
    totalmv: 0,
    totalcv: 0
  };
  landSecurities = {
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
    this.securityData = JSON.parse(this.security.data);

    (this.securityData['selectedArray'] as Array<any>).forEach(selectedValue => {
      switch (selectedValue) {
        case 'VehicleSecurity':
          this.vehicleSelected = true;
          break;
        case 'LandSecurity' :
          this.landSelected = true;
          break;
        case 'ApartmentSecurity' :
          this.apartmentSelected = true;
          break;
        case 'Land and Building Security' :
          this.landBuilding = true;
          break;
        case 'FixedDeposit':
          this.depositSelected = true;
          break;
        case 'ShareSecurity' :
          this.shareSelected = true;
          break;
        case 'PlantSecurity' :
          this.plantSelected = true;
          break;
        case 'HypothecationOfStock':
          this.hypothecation = true;
          break;
        case 'OtherSecurity':
          this.securityOther = true;
          break;
        case 'LeaseAssignment':
          this.assignments = true;
          break;
        case 'CorporateGuarantee':
          this.corporate = true;
          break;
        case 'PersonalGuarantee':
          this.personal = true;
          break;
        case 'InsurancePolicySecurity':
          this.insurancePolicySelected = true;
          break;
        case 'AssignmentOfReceivables':
          this.assignment = true;

      }
    });
    if (!ObjectUtil.isEmpty(this.shareSecurityData)) {
      this.shareSecurity = JSON.parse(this.shareSecurityData.data);
    } else {
      this.shareSelected = false;
    }
    if (this.shareSelected) {
      this.calculateShareTotals();
      this.loanSharePercent = this.shareSecurity['loanShareRate'];
    }
    if (this.depositSelected) {
      this.calculateTotal();
    }

    if (this.landSelected) {
      this.calcLandSecuritiesTotal();
    }
    if (this.apartmentSelected) {
      this.calcBuildingSecuritiesTotal();
    }
    if (this.landAndBuildingSecurities) {
      this.calcLandAndBuildingSecurityTotal();
    }
  }

  calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
  }

  calculateTotal() {
    const depositList = this.securityData['initialForm']['fixedDepositDetails'];
    depositList.forEach(deposit => {
      this.totalAmount += deposit.amount;
    });
  }

  calcBuildingSecuritiesTotal() {
    this.securityData['initialForm']['buildingDetails'].forEach(sec => {
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

  calcLandSecuritiesTotal() {
    this.securityData['initialForm']['landDetails'].forEach(sec => {
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

  calcLandAndBuildingSecurityTotal() {
    this.securityData['initialForm']['landBuilding'].forEach(sec => {
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
