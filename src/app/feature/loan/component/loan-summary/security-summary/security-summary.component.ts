import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {CollateralSiteVisitService} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {CollateralSiteVisit} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {SiteVisitDocument} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {flatten} from '@angular/compiler';
import {Security} from '../../../model/security';


@Component({
    selector: 'app-security-summary',
    templateUrl: './security-summary.component.html',
    styleUrls: ['./security-summary.component.scss']
})
export class SecuritySummaryComponent implements OnInit {
    formData: Object;
    @Input() shareSecurity;
    @Input() collateralData;
    @Input() security: Security;
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
    ownerShipTransfer = OwnershipTransfer;
    assignment = false;
    otherDetail: any;
    assignments = false;
    leaseAssignment: any;
    @Input() securityId: number;
    @Input() collateralSiteVisitDetail = [];
    @Input() isCollateralSiteVisit;
    @Input() nepaliDate;
    @Input() siteVisitDocuments: Array<SiteVisitDocument>;
    isCollateralSiteVisitPresent = false;
    collateralSiteVisits: Array<CollateralSiteVisit> = [];
    siteVisitJson = [];
    isPrintable = 'YES';
    @Input() docStatus;
    @Output() downloadSiteVisitDocument = new EventEmitter();
    proposedSecurity: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    existingSecurity: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    existingAsPropose: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    totalMV = 0;
    totalFMV = 0;
    totalDV = 0;
    totalMVEx = 0;
    totalFMVEx = 0;
    totalDVEx = 0;
    totalMVAsPs = 0;
    totalFMVAsPs = 0;
    totalDVAsPs = 0;

    constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.security)) {
            this.formData = JSON.parse(this.security.data);
        }
        if (this.formData['selectedArray'] !== undefined) {
            // land security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('LandSecurity') !== -1) {
                    this.showTitle = true;
                    this.landSelected = true;
                }
            });
            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['landDetails'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.landConsideredValue);
                        this.totalFMV += Number(d.marketValue);
                        this.totalDV += Number(d.distressValue);
                        this.proposedSecurity.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMV,
                            totalFMV: this.totalFMV,
                            totalDV: this.totalDV
                        });
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        this.existingSecurity.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMVEx,
                            totalFMV: this.totalFMVEx,
                            totalDV: this.totalDVEx
                        });
                    }
                    if (d.existingAsProposed) {
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        this.existingAsPropose.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMVAsPs,
                            totalFMV: this.totalFMVAsPs,
                            totalDV: this.totalDVAsPs
                        });
                    }
                });
            }

            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['landBuilding'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.landConsideredValue);
                        this.totalFMV += Number(d.marketValue);
                        this.totalDV += Number(d.distressValue);
                        this.proposedSecurity.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMV,
                            totalFMV: this.totalFMV,
                            totalDV: this.totalDV
                        });
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        this.existingSecurity.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMVEx,
                            totalFMV: this.totalFMVEx,
                            totalDV: this.totalDVEx
                        });
                    }
                    if (d.existingAsProposed) {
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        this.existingAsPropose.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: this.totalMVAsPs,
                            totalFMV: this.totalFMVAsPs,
                            totalDV: this.totalDVAsPs
                        });
                    }
                });
            }

            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['buildingDetails'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.totalCost);
                        this.totalFMV += Number(d.buildingFairMarketValue);
                        this.totalDV += Number(d.buildingDistressValue);
                        this.proposedSecurity.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: this.totalMV,
                            totalFMV: this.totalFMV,
                            totalDV: this.totalDV
                        });
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        this.existingSecurity.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: this.totalMVEx,
                            totalFMV: this.totalFMVEx,
                            totalDV: this.totalDVEx
                        });
                    }
                    if (d.existingAsProposed) {
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        this.existingAsPropose.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: this.totalMVAsPs,
                            totalFMV: this.totalFMVAsPs,
                            totalDV: this.totalDVAsPs
                        });
                    }
                });
            }

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
            if (!ObjectUtil.isEmpty(this.collateralData)) {
                this.collateralSiteVisits = this.collateralData;
                const arr = [];
                this.collateralSiteVisits.forEach(f => {
                    if (!ObjectUtil.isEmpty(f.siteVisitDocuments)) {
                        arr.push(f.siteVisitDocuments);
                    }
                });
                // make nested array of objects as a single array eg: [1,2,[3[4,[5,6]]]] = [1,2,3,4,5,6]
                this.siteVisitDocuments = flatten(arr);
                this.collateralSiteVisits.filter(item => {
                    this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
                });
                if (this.collateralData.length > 0) {
                    this.isCollateralSiteVisitPresent = true;
                }
            }
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
                        this.siteVisitDocuments = flatten(arr);
                        this.collateralSiteVisits.filter(item => {
                            this.siteVisitJson.push(JSON.parse(item.siteVisitJsonData));
                        });
                        if (response.detail.length > 0) {
                            this.isCollateralSiteVisitPresent = true;
                        }
                        this.downloadSiteVisitDocument.emit(this.siteVisitDocuments);
                    });
            }
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
}
