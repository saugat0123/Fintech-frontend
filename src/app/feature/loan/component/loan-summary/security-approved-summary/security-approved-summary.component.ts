import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {CollateralSiteVisit} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {SummaryType} from '../../SummaryType';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {flatten} from '@angular/compiler';

@Component({
  selector: 'app-security-approved-summary',
  templateUrl: './security-approved-summary.component.html',
  styleUrls: ['./security-approved-summary.component.scss']
})
export class SecurityApprovedSummaryComponent implements OnInit {
  @Input() formData: Object;
  @Input() count;
  @Input() shareSecurity;
  @Input() collateralData;
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
  bondSecurity = false;
  leaseAssignment: any;
  @Input() securityId: number;
  @Input() collateralSiteVisitDetail: Array<CollateralSiteVisit>;
  @Input() isCollateralSiteVisit;
  @Input() nepaliDate;
  @Input() siteVisitDocuments: Array<SiteVisitDocument>;
  isCollateralSiteVisitPresent = false;
  collateralSiteVisits: Array<CollateralSiteVisit> = [];
  siteVisitJson = [];
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  @Input() loanCategory;
  @Input() approveSheet;
  totalBondSecurityValue = 0;
  isPrintable = 'YES';
  @Input() docStatus;
  @Output() downloadSiteVisitDocument = new EventEmitter();
  isSecurityPresent = false;

  constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
  }

  ngOnInit() {
    if (this.formData['selectedArray'] !== undefined) {
      this.isSecurityPresent = true;
      // land security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('LandSecurity') !== -1) {
          this.showTitle = true;
          this.landSelected = true;
        }
      });

      // apartment security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('ApartmentSecurity') !== -1) {
          this.showTitle = true;
          this.apartmentSelected = true;
        }
      });
      // land and building security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('Land and Building Security') !== -1) {
          this.showTitle = true;
          this.landBuilding = true;
        }
      });
      // plant and machinery security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('PlantSecurity') !== -1) {
          this.showTitle = true;
          this.plantSelected = true;
        }
      });
      // // vehicle security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('VehicleSecurity') !== -1) {
          this.showTitle = true;
          this.vehicleSelected = true;
        }
      });
      // fixed deposit receipt security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('FixedDeposit') !== -1) {
          this.showTitle = true;
          this.depositSelected = true;
        }
      });
      //
      // // shared security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('ShareSecurity') !== -1) {
          this.showTitle = true;
          this.shareSelected = true;
        }
      });
      // hypothecation of stock security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('HypothecationOfStock') !== -1) {
          this.showTitle = true;
          this.hypothecation = true;
        }
      });
      // assignment of receivables
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('AssignmentOfReceivables') !== -1) {
          this.showTitle = true;
          this.assignment = true;
        }
      });
      // lease assignment
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('LeaseAssignment') !== -1) {
          this.showTitle = true;
          this.assignments = true;
        }
      });
      // other security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('OtherSecurity') !== -1) {
          this.showTitle = true;
          this.securityOther = true;
        }
      });
      // corporate guarantee
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('CorporateGuarantee') !== -1) {
          this.showTitle = true;
          this.corporate = true;
        }
      });
      // personal guarantee
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('PersonalGuarantee') !== -1) {
          this.showTitle = true;
          this.personal = true;
        }
      });
      // insurance policy
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('InsurancePolicySecurity') !== -1) {
          this.showTitle = true;
          this.insurancePolicySelected = true;
        }
      });
      // bond security
      this.formData['selectedArray'].filter(f => {
        if (f.indexOf('BondSecurity') !== -1) {
          this.showTitle = true;
          this.bondSecurity = true;
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
    if (this.formData['guarantorsForm']['guarantorsDetails'].length !== 0) {
      this.isPresentGuarantor = true;
    }
    if (this.docStatus.toString() === 'APPROVED') {
      this.collateralSiteVisitService.getCollateralSiteVisitBySecurityId(this.securityId)
          .subscribe((response: any) => {
            this.collateralSiteVisits = response.detail;
      const arr = [];
      this.collateralSiteVisits.forEach(f => {
        if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
          arr.push(f.siteVisitDocuments);
        }
      });
      // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
      const docArray = flatten(arr);
      // filter for only printable document
      this.siteVisitDocuments = docArray.filter(f => f.isPrintable === this.isPrintable);

      this.collateralSiteVisits.filter(item => {
        if (!ObjectUtil.isEmpty(item.isApproved) && item.isApproved) {
          this.isCollateralSiteVisitPresent = true;
          this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
        }
      });
      this.downloadSiteVisitDocument.emit(this.siteVisitDocuments);
    });
    } else {
      if (!ObjectUtil.isEmpty(this.securityId)) {
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
                if (!ObjectUtil.isEmpty(item.isApproved) && item.isApproved) {
                  this.isCollateralSiteVisitPresent = true;
                  this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
                }
              });
              this.downloadSiteVisitDocument.emit(this.siteVisitDocuments);
            });
      }
    }
    if (this.bondSecurity) {
      this.calculateTotalBondSecurityAmount();
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

  private calculateTotalBondSecurityAmount(): void {
    const bondSecurity = this.formData['initialForm']['bondSecurity'];
    bondSecurity.forEach(value => {
      this.totalBondSecurityValue += Number(value.bondValue);
    });
  }
}
