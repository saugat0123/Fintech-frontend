import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';
import {
    CollateralSiteVisitService
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {
    CollateralSiteVisit
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {
    SiteVisitDocument
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
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
    proposedSecurity1: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    existingSecurity1: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    existingAsPropose1: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    proposedSecurity2: {securityName: string, totalAmount} [] = [];
    existingSecurity2: {securityName: string, totalAmount} [] = [];
    existingAsPropose2: {securityName: string, totalAmount} [] = [];
    totalProposeSecurityAmount = 0;
    totalExistingSecurityAmount = 0;
    totalExistingAsProposedSecurityAmount = 0;
    totalMV = 0;
    totalFMV = 0;
    totalDV = 0;
    totalMVEx = 0;
    totalFMVEx = 0;
    totalDVEx = 0;
    totalMVAsPs = 0;
    totalFMVAsPs = 0;
    totalDVAsPs = 0;
    allTotalMV = 0;
    allTotalFMV = 0;
    allTotalDV = 0;
    allTotalMVEx = 0;
    allTotalFMVEx = 0;
    allTotalDVEx = 0;
    allTotalMVAsPs = 0;
    allTotalFMVAsPs = 0;
    allTotalDVAsPs = 0;
    allTotalProposedAmount = 0;
    allTotalExistingAmount = 0;
    allTotalExistingAsProposedAmount = 0;
    allProposedSecurityArray: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    allExistingSecurityArray: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    allExistingAsProposedSecurityArray: {securityName: string, considerValue: number, marketValue: number,
        distressValue: number, totalMV: number, totalFMV: number, totalDV: number} [] = [];
    allProposedSecurity: {securityName: string, totalAmount} [] = [];
    allExistingSecurity: {securityName: string, totalAmount} [] = [];
    allExistingAsProposeSecurity: {securityName: string, totalAmount} [] = [];

    constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.security)) {
            this.formData = JSON.parse(this.security.data);
        }

        if (this.formData['selectedArray'] !== undefined) {
            const allProposedSecurity = [];
            const allExistingSecurity = [];
            const allExistingAsProposedSecurity = [];

            let finalProposedLandArray = [];
            let finalExistingLandArray = [];
            let finalExistingLandAsProposedArray = [];
            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['landDetails'];
                let mv = 0;
                let fmv = 0;
                let dv = 0;
                let mvEx = 0;
                let fmvEx = 0;
                let dvEx = 0;
                let mvExAsPs = 0;
                let fmvExAsPs = 0;
                let dvExAsPs = 0;
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.landConsideredValue);
                        this.totalFMV += Number(d.marketValue);
                        this.totalDV += Number(d.distressValue);
                        mv += Number(d.landConsideredValue);
                        fmv += Number(d.marketValue);
                        dv += Number(d.distressValue);

                        this.proposedSecurity1.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mv,
                            totalFMV: fmv,
                            totalDV: dv
                        });
                        finalProposedLandArray = [this.proposedSecurity1[this.proposedSecurity1.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        mvEx += Number(d.landConsideredValue);
                        fmvEx += Number(d.marketValue);
                        dvEx += Number(d.distressValue);
                        this.existingSecurity1.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mvEx,
                            totalFMV: fmvEx,
                            totalDV: dvEx
                        });
                        finalExistingLandArray = [this.existingSecurity1[this.existingSecurity1.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        mvExAsPs += Number(d.landConsideredValue);
                        fmvExAsPs += Number(d.marketValue);
                        dvExAsPs += Number(d.distressValue);
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        this.existingAsPropose1.push({
                            securityName: 'Land',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mvExAsPs,
                            totalFMV: fmvExAsPs,
                            totalDV: dvExAsPs
                        });
                        finalExistingLandAsProposedArray = [this.existingAsPropose1[this.existingAsPropose1.length - 1]];
                    }
                });
            }
            allProposedSecurity.push(finalProposedLandArray);
            allExistingSecurity.push(finalExistingLandArray);
            allExistingAsProposedSecurity.push(finalExistingLandAsProposedArray);

            let finalProposedLandBuildingArray = [];
            let finalExistingLandBuildingArray = [];
            let finalExistingLandBuildingAsProposedArray = [];
            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['landBuilding'];
                let mv = 0;
                let fmv = 0;
                let dv = 0;
                let mvEx = 0;
                let fmvEx = 0;
                let dvEx = 0;
                let mvExAsPs = 0;
                let fmvExAsPs = 0;
                let dvExAsPs = 0;
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.landConsideredValue);
                        this.totalFMV += Number(d.marketValue);
                        this.totalDV += Number(d.distressValue);
                        mv += Number(d.landConsideredValue);
                        fmv += Number(d.marketValue);
                        dv += Number(d.distressValue);
                        this.proposedSecurity1.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mv,
                            totalFMV: fmv,
                            totalDV: dv
                        });
                        finalProposedLandBuildingArray = [this.proposedSecurity1[this.proposedSecurity1.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        mvEx += Number(d.landConsideredValue);
                        fmvEx += Number(d.marketValue);
                        dvEx += Number(d.distressValue);
                        this.existingSecurity1.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mvEx,
                            totalFMV: fmvEx,
                            totalDV: dvEx
                        });
                        finalExistingLandBuildingArray = [this.existingSecurity1[this.existingSecurity1.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        mvExAsPs += Number(d.landConsideredValue);
                        fmvExAsPs += Number(d.marketValue);
                        dvExAsPs += Number(d.distressValue);
                        this.existingAsPropose1.push({
                            securityName: 'Land and Building',
                            considerValue: d.landConsideredValue,
                            marketValue: d.marketValue,
                            distressValue: d.distressValue,
                            totalMV: mvExAsPs,
                            totalFMV: fmvExAsPs,
                            totalDV: dvExAsPs
                        });
                        finalExistingLandBuildingAsProposedArray = [this.existingAsPropose1[this.existingAsPropose1.length - 1]];
                    }
                });
            }
            allProposedSecurity.push(finalProposedLandBuildingArray);
            allExistingSecurity.push(finalExistingLandBuildingArray);
            allExistingAsProposedSecurity.push(finalExistingLandBuildingAsProposedArray);

            let finalProposedApartmentArray = [];
            let finalExistingApartmentArray = [];
            let finalExistingApartmentAsProposedArray = [];
            if (this.formData['initialForm'] !== undefined) {
                const landDetail = this.formData['initialForm']['buildingDetails'];
                let mv = 0;
                let fmv = 0;
                let dv = 0;
                let mvEx = 0;
                let fmvEx = 0;
                let dvEx = 0;
                let mvExAsPs = 0;
                let fmvExAsPs = 0;
                let dvExAsPs = 0;
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalMV += Number(d.totalCost);
                        this.totalFMV += Number(d.buildingFairMarketValue);
                        this.totalDV += Number(d.buildingDistressValue);
                        mv += Number(d.totalCost);
                        fmv += Number(d.buildingFairMarketValue);
                        dv += Number(d.buildingDistressValue);
                        this.proposedSecurity1.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: mv,
                            totalFMV: fmv,
                            totalDV: dv
                        });
                        finalProposedApartmentArray = [this.proposedSecurity1[this.proposedSecurity1.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalMVEx += Number(d.landConsideredValue);
                        this.totalFMVEx += Number(d.marketValue);
                        this.totalDVEx += Number(d.distressValue);
                        mvEx += Number(d.totalCost);
                        fmvEx += Number(d.buildingFairMarketValue);
                        dvEx += Number(d.buildingDistressValue);
                        this.existingSecurity1.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: mvEx,
                            totalFMV: fmvEx,
                            totalDV: dvEx
                        });
                        finalExistingApartmentArray = [this.existingSecurity1[this.existingSecurity1.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalMVAsPs += Number(d.landConsideredValue);
                        this.totalFMVAsPs += Number(d.marketValue);
                        this.totalDVAsPs += Number(d.distressValue);
                        mvExAsPs += Number(d.totalCost);
                        fmvExAsPs += Number(d.buildingFairMarketValue);
                        dvExAsPs += Number(d.buildingDistressValue);
                        this.existingAsPropose1.push({
                            securityName: 'Apartment',
                            considerValue: d.totalCost,
                            marketValue: d.buildingFairMarketValue,
                            distressValue: d.buildingDistressValue,
                            totalMV: mvExAsPs,
                            totalFMV: fmvExAsPs,
                            totalDV: dvExAsPs
                        });
                        finalExistingApartmentAsProposedArray = [this.existingAsPropose1[this.existingAsPropose1.length - 1]];
                    }
                });
            }
            allProposedSecurity.push(finalProposedApartmentArray);
            allExistingSecurity.push(finalExistingApartmentArray);
            allExistingAsProposedSecurity.push(finalExistingApartmentAsProposedArray);

            const arr1 = flatten(allProposedSecurity);
            arr1.forEach((d, i) => {
                this.allTotalMV += d.totalMV;
                this.allTotalFMV += d.totalFMV;
                this.allTotalDV += d.totalDV;
            });
            this.allProposedSecurityArray = arr1;

            const arr2 = flatten(allExistingSecurity);
            arr2.forEach((d, i) => {
                this.allTotalMVEx += d.totalMV;
                this.allTotalFMVEx += d.totalFMV;
                this.allTotalDVEx += d.totalDV;
            });
            this.allExistingSecurityArray = arr2;

            const arr3 = flatten(allExistingAsProposedSecurity);
            arr3.forEach((d, i) => {
                this.allTotalMVAsPs += d.totalMV;
                this.allTotalFMVAsPs += d.totalFMV;
                this.allTotalDVAsPs += d.totalDV;
            });
            this.allExistingAsProposedSecurityArray = arr3;

            const allProposedArray = [];
            const allExistingArray = [];
            const allExistingAsProposedArray = [];

            let finalProposedVehicleArray = [];
            let finalExistingVehicleArray = [];
            let finalExistingAsProposedVehicleArray = [];
            if (this.formData['initialForm'] !== undefined) {
                let totalProposed = 0;
                let totalExisting = 0;
                let totalExistingAsproposed = 0;
                const landDetail = this.formData['initialForm']['vehicleDetails'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalProposeSecurityAmount += Number(d.quotationAmount);
                        totalProposed += Number(d.quotationAmount);
                        this.proposedSecurity2.push({
                            securityName: 'Vehicle',
                            totalAmount: totalProposed
                        });
                        finalProposedVehicleArray = [this.proposedSecurity2[this.proposedSecurity2.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalExistingSecurityAmount += Number(d.quotationAmount);
                        totalExisting += Number(d.quotationAmount);
                        this.existingSecurity2.push({
                            securityName: 'Vehicle',
                            totalAmount: totalExisting
                        });
                        finalExistingVehicleArray = [this.existingSecurity2[this.existingSecurity2.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalExistingAsProposedSecurityAmount += Number(d.quotationAmount);
                        totalExistingAsproposed += Number(d.quotationAmount);
                        this.existingAsPropose2.push({
                            securityName: 'Vehicle',
                            totalAmount: totalExistingAsproposed
                        });
                        finalExistingAsProposedVehicleArray = [this.existingAsPropose2[this.existingAsPropose2.length - 1]];
                    }
                });
            }
            allProposedArray.push(finalProposedVehicleArray);
            allExistingArray.push(finalExistingVehicleArray);
            allExistingAsProposedArray.push(finalExistingAsProposedVehicleArray);

            let finalProposedPlantArray = [];
            let finalExistingPlantArray = [];
            let finalExistingAsProposedPlantArray = [];

            if (this.formData['initialForm'] !== undefined) {
                let totalProposed = 0;
                let totalExisting = 0;
                let totalExistingAsProposed = 0;
                const landDetail = this.formData['initialForm']['plantDetails'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalProposeSecurityAmount += Number(d.quotation);
                        totalProposed += Number(d.quotation);
                        this.proposedSecurity2.push({
                            securityName: 'Plant and Machinery Security',
                            totalAmount: totalProposed
                        });
                        finalProposedPlantArray = [this.proposedSecurity2[this.proposedSecurity2.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalExistingSecurityAmount += Number(d.quotation);
                        totalExisting += Number(d.quotation);
                        this.existingSecurity2.push({
                            securityName: 'Plant and Machinery Security',
                            totalAmount: totalExisting
                        });
                        finalExistingPlantArray = [this.existingSecurity2[this.existingSecurity2.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalExistingAsProposedSecurityAmount += Number(d.quotation);
                        totalExistingAsProposed += Number(d.quotation);
                        this.existingAsPropose2.push({
                            securityName: 'Plant and Machinery Security',
                            totalAmount: totalExistingAsProposed
                        });
                        finalExistingAsProposedPlantArray = [this.existingAsPropose2[this.existingAsPropose2.length - 1]];
                    }
                });
            }

            allProposedArray.push(finalProposedPlantArray);
            allExistingArray.push(finalExistingPlantArray);
            allExistingAsProposedArray.push(finalExistingAsProposedPlantArray);

            let finalProposedFixedArray = [];
            let finalExistingFixedArray = [];
            let finalExistingAsProposedFixedArray = [];
            if (this.formData['initialForm'] !== undefined) {
                let totalProposed = 0;
                let totalExisting = 0;
                let totalExistingAsProposed = 0;
                const landDetail = this.formData['initialForm']['fixedDepositDetails'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalProposeSecurityAmount += Number(d.amount);
                        totalProposed += Number(d.amount);
                        this.proposedSecurity2.push({
                            securityName: 'Fixed Deposit Receipt',
                            totalAmount: totalProposed
                        });
                        finalProposedFixedArray = [this.proposedSecurity2[this.proposedSecurity2.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalExistingSecurityAmount += Number(d.quotation);
                        totalExisting += Number(d.quotation);
                        this.existingSecurity2.push({
                            securityName: 'Fixed Deposit Receipt',
                            totalAmount: totalExisting
                        });
                        finalExistingFixedArray = [this.existingSecurity2[this.existingSecurity2.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalExistingAsProposedSecurityAmount += Number(d.quotation);
                        totalExistingAsProposed += Number(d.quotation);
                        this.existingAsPropose2.push({
                            securityName: 'Fixed Deposit Receipt',
                            totalAmount: totalExistingAsProposed
                        });
                        finalExistingAsProposedFixedArray = [this.existingAsPropose2[this.existingAsPropose2.length - 1]];
                    }
                });
            }
            allProposedArray.push(finalProposedFixedArray);
            allExistingArray.push(finalExistingFixedArray);
            allExistingAsProposedArray.push(finalExistingAsProposedFixedArray);

            let finalProposedHypoArray = [];
            let finalExistingHypoArray = [];
            let finalExistingAsProposedHypoArray = [];
            if (this.formData['initialForm'] !== undefined) {
                let totalProposed = 0;
                let totalExisting = 0;
                let totalExistingAsProposed = 0;
                const landDetail = this.formData['initialForm']['hypothecationOfStock'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalProposeSecurityAmount += Number(d.value);
                        totalProposed += Number(d.value);
                        this.proposedSecurity2.push({
                            securityName: 'Hypothecation of Stock',
                            totalAmount: totalProposed
                        });
                        finalProposedHypoArray = [this.proposedSecurity2[this.proposedSecurity2.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalExistingSecurityAmount += Number(d.value);
                        totalExisting += Number(d.value);
                        this.existingSecurity2.push({
                            securityName: 'Hypothecation of Stock',
                            totalAmount: totalExisting
                        });
                        finalExistingHypoArray = [this.existingSecurity2[this.existingSecurity2.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalExistingAsProposedSecurityAmount += Number(d.value);
                        totalExistingAsProposed += Number(d.value);
                        this.existingAsPropose2.push({
                            securityName: 'Hypothecation of Stock',
                            totalAmount: totalExistingAsProposed
                        });
                        finalExistingAsProposedHypoArray = [this.existingAsPropose2[this.existingAsPropose2.length - 1]];
                    }
                });
            }
            allProposedArray.push(finalProposedHypoArray);
            allExistingArray.push(finalExistingHypoArray);
            allExistingAsProposedArray.push(finalExistingAsProposedHypoArray);


            let finalProposedPolicyArray = [];
            let finalExistingPolicyArray = [];
            let finalExistingAsProposedPolicyArray = [];
            if (this.formData['initialForm'] !== undefined) {
                let totalProposed = 0;
                let totalExisting = 0;
                let totalExistingAsProposed = 0;
                const landDetail = this.formData['initialForm']['insurancePolicy'];
                landDetail.forEach((d, i) => {
                    if (d.forProposed) {
                        this.totalProposeSecurityAmount += Number(d.insuredAmount);
                        totalProposed += Number(d.insuredAmount);
                        this.proposedSecurity2.push({
                            securityName: 'Insurance Policy Security',
                            totalAmount: totalProposed
                        });
                        finalProposedPolicyArray = [this.proposedSecurity2[this.proposedSecurity1.length - 1]];
                    }
                    if (d.forExisting) {
                        this.totalExistingSecurityAmount += Number(d.insuredAmount);
                        totalExisting += Number(d.insuredAmount);
                        this.existingSecurity2.push({
                            securityName: 'Insurance Policy Security',
                            totalAmount: totalExisting
                        });
                        finalExistingPolicyArray = [this.existingSecurity2[this.existingSecurity2.length - 1]];
                    }
                    if (d.existingAsProposed) {
                        this.totalExistingAsProposedSecurityAmount += Number(d.insuredAmount);
                        totalExistingAsProposed += Number(d.insuredAmount);
                        this.existingAsPropose2.push({
                            securityName: 'Insurance Policy Security',
                            totalAmount: totalExistingAsProposed
                        });
                        finalExistingAsProposedPolicyArray = [this.existingAsPropose2[this.existingAsPropose2.length - 1]];
                    }
                });
            }
            allProposedArray.push(finalProposedPolicyArray);
            allExistingArray.push(finalExistingPolicyArray);
            allExistingAsProposedArray.push(finalExistingAsProposedPolicyArray);

            const array1 = flatten(allProposedArray);
            const array2 = flatten(allExistingArray);
            const array3 = flatten(allExistingAsProposedArray);

            array1.forEach((d, i) => {
                this.allTotalProposedAmount += d.totalAmount;
            });
            array2.forEach((d, i) => {
                this.allTotalExistingAmount += d.totalAmount;
            });
            array3.forEach((d, i) => {
                this.allTotalExistingAsProposedAmount += d.totalAmount;
            });
            this.allProposedSecurity = array1;
            this.allExistingSecurity = array2;
            this.allExistingAsProposeSecurity = array3;

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
        // shareList.forEach(share => {
        //     this.shareTotalValue += share.total;
        //     this.totalConsideredValue += share.consideredValue;
        // });
    }
}
