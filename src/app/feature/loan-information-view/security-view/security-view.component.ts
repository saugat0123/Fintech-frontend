import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {NepseMaster} from '../../admin/modal/NepseMaster';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {OwnershipTransfer} from '../../loan/model/ownershipTransfer';
import {Clients} from '../../../../environments/Clients';
import {environment} from '../../../../environments/environment';
import {CollateralSiteVisit} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {CollateralSiteVisitService} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {flatten} from '@angular/compiler';
import {SummaryType} from '../../loan/component/SummaryType';
import {LogicalProjectPath} from '@angular/compiler-cli/src/ngtsc/file_system';
import {OpeningBeneficiary} from '../../admin/modal/openingBeneficiary';

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
  disableCrgAlphaParams = environment.disableCrgAlpha;
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  securityOther: any;
  assignments: any;
  assignment = false;
  @Input() securityId: number;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitJson = [];
  isCollateralSiteVisit = false;
  siteVisitDocuments: Array<SiteVisitDocument>;
  url: string;
  separator = '/';
  fileType = '.jpg';
  isPrintable = 'YES';
  random;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    this.random = Math.floor(Math.random() * 100) + 1;
    this.url = ApiConfig.URL;
    this.securityData = JSON.parse(this.security.data);
    // land security
    this.securityData['initialForm']['landDetails'].filter(f => {
      const value = f.owner;
      if (!ObjectUtil.isEmpty(value)) {
        this.landSelected = true;
      }
    });

    // apartment security
    this.securityData['initialForm']['buildingDetails'].filter(f => {
      const value = f.buildArea;
      if (!ObjectUtil.isEmpty(value)) {
        this.apartmentSelected = true;
      }
    });
    // land and building security
    this.securityData['initialForm']['landBuilding'].filter(f => {
      const value = f.owner;
      if (!ObjectUtil.isEmpty(value)) {
        this.landBuilding = true;
      }
    });
    // plant and machinery security
    this.securityData['initialForm']['plantDetails'].filter(f => {
      const value = f.model;
      if (!ObjectUtil.isEmpty(value)) {
        this.plantSelected = true;
      }
    });
    // // vehicle security
    this.securityData['initialForm']['vehicleDetails'].filter(f => {
      const value = f.model;
      if (!ObjectUtil.isEmpty(value)) {
        this.vehicleSelected = true;
      }
    });
    // fixed deposit receipt security
    this.securityData['initialForm']['fixedDepositDetails'].filter(f => {
      const value = f.accountNumber;
      if (!ObjectUtil.isEmpty(value)) {
        this.depositSelected = true;
      }
    });
    //
    // // shared security
    if (!ObjectUtil.isEmpty(this.shareSecurityData)) {
        this.shareSelected = true;
    }
    // hypothecation of stock security
    this.securityData['initialForm']['hypothecationOfStock'].filter(f => {
      const value = f.owner;
      if (!ObjectUtil.isEmpty(value)) {
        this.hypothecation = true;
      }
    });
    // assignment of receivables
    this.securityData['initialForm']['assignmentOfReceivables'].filter(f => {
      const value = f.amount;
      if (!ObjectUtil.isEmpty(value)) {
        this.assignment = true;
      }
    });
    // lease assignment
    this.securityData['initialForm']['leaseAssignment'].filter(f => {
      const value = f.otherDetail;
      if (!ObjectUtil.isEmpty(value)) {
        this.assignments = true;
      }
    });
    // other security
    this.securityData['initialForm']['otherSecurity'].filter(f => {
      const value = f.otherDetail;
      if (!ObjectUtil.isEmpty(value)) {
        this.securityOther = true;
      }
    });
    // corporate guarantee
    this.securityData['initialForm']['corporateGuarantee'].filter(f => {
      const value = f.name;
      if (!ObjectUtil.isEmpty(value)) {
        this.corporate = true;
      }
    });
    // personal guarantee
    this.securityData['initialForm']['personalGuarantee'].filter(f => {
      const value = f.name;
      if (!ObjectUtil.isEmpty(value)) {
        this.personal = true;
      }
    });
    // insurance policy
    this.securityData['initialForm']['insurancePolicy'].filter(f => {
      const value = f.insuredAmount;
      if (!ObjectUtil.isEmpty(value)) {
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
            const arr = [];
            this.collateralSiteVisits.forEach(f => {
              if (f.siteVisitDocuments.length > 0) {
                arr.push(f.siteVisitDocuments);
              }
            });
            // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
            const docArray = flatten(arr);
            // filter for only printable document
            this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);

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

  viewDocument(url: string, name: string) {
    const viewDocName = name.concat(this.fileType);
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = `${ApiConfig.URL}/${url}${viewDocName}?${Math.floor(Math.random() * 100) + 1}`;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

  public onError(event): void {
    event.target.src = 'assets/img/noImage.png';
  }
}
