import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {OwnershipTransfer} from '../../loan/model/ownershipTransfer';
import {environment as envSrdb} from '../../../../environments/environment.srdb';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {CollateralSiteVisit} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {CollateralSiteVisitService} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';

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
  @Input() securityId: number;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitJson = [];
  isCollateralSiteVisit = false;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    this.securityData = JSON.parse(this.security.data);
    // land security
    this.securityData['initialForm']['landDetails'].filter(f => {
      if (f.owner !== '') {
        this.landSelected = true;
      }
    });

    // apartment security
    this.securityData['initialForm']['buildingDetails'].filter(f => {
      if (f.buildArea !== '') {
        this.apartmentSelected = true;
      }
    });
    // land and building security
    this.securityData['initialForm']['landBuilding'].filter(f => {
      if (f.owner !== null) {
        this.landBuilding = true;
      }
    });
    // plant and machinery security
    this.securityData['initialForm']['plantDetails'].filter(f => {
      if (f.model !== '') {
        this.plantSelected = true;
      }
    });
    // // vehicle security
    this.securityData['initialForm']['vehicleDetails'].filter(f => {
      if (f.model !== '') {
        this.vehicleSelected = true;
      }
    });
    // fixed deposit receipt security
    this.securityData['initialForm']['fixedDepositDetails'].filter(f => {
      if (f.accountNumber !== null) {
        this.depositSelected = true;
      }
    });
    //
    // // shared security
    if (this.shareSecurityData !== null) {
        this.shareSelected = true;
    }
    // hypothecation of stock security
    this.securityData['initialForm']['hypothecationOfStock'].filter(f => {
      if (f.owner !== null) {
        this.hypothecation = true;
      }
    });
    // assignment of receivables
    this.securityData['initialForm']['assignmentOfReceivables'].filter(f => {
      if (f.amount !== null) {
        this.assignment = true;
      }
    });
    // lease assignment
    this.securityData['initialForm']['leaseAssignment'].filter(f => {
      if (f.otherDetail !== '') {
        this.assignments = true;
      }
    });
    // other security
    this.securityData['initialForm']['otherSecurity'].filter(f => {
      if (f.otherDetail !== '') {
        this.securityOther = true;
      }
    });
    // corporate guarantee
    this.securityData['initialForm']['corporateGuarantee'].filter(f => {
      if (f.name !== null) {
        this.corporate = true;
      }
    });
    // personal guarantee
    this.securityData['initialForm']['personalGuarantee'].filter(f => {
      if (f.name !== null) {
        this.personal = true;
      }
    });
    // insurance policy
    this.securityData['initialForm']['insurancePolicy'].filter(f => {
      if (f.insuredAmount !== null) {
        this.insurancePolicySelected = true;
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
    if (this.securityId !== undefined) {
      this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.securityId)
          .subscribe((response: any) => {
            this.collateralSiteVisits = response.detail;
              this.collateralSiteVisits.filter(item => {
                this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
              });
              if (response.detail.length > 0) {
                this.isCollateralSiteVisit = true;
              }
          });
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

}
