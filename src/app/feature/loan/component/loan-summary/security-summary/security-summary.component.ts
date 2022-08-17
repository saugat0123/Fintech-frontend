import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {
    CollateralSiteVisitService
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/collateral-site-visit.service';
import {
    CollateralSiteVisit
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/CollateralSiteVisit';
import {
    SiteVisitDocument
} from '../../../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
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
    hypothecation = false;
    securityOther = false;
    corporate = false;
    personal = false;
    loanSharePercent: NepseMaster = new NepseMaster();
    landBuilding = false;
    showTitle = false;
    insurancePolicySelected = false;
    assignment = false;
    otherDetail: any;
    assignments = false;
    leaseAssignment: any;
    fixedDepositSelected = false;
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
    proposedSecurity1: { securityName: string, considerValue: number, marketValue: number, distressValue: number } [] = [];
    existingSecurity1: { securityName: string, considerValue: number, marketValue: number, distressValue: number } [] = [];
    proposedSecurity2: { securityName: string, totalAmount } [] = [];
    existingSecurity2: { securityName: string, totalAmount } [] = [];
    existingAsPropose2: { securityName: string, totalAmount } [] = [];
    totalExistingAsProposedSecurityAmount = 0;
    allExistingSecurity: { securityName: string, totalAmount } [] = [];
    existingSecurityOnly = [];
    realEstateExistingTotal = {
        marketValue: 0,
        considerValue: 0,
        distressValue: 0,
    };
    realEstateProposeTotal = {
        marketValue: 0,
        considerValue: 0,
        distressValue: 0,
    };

    nonRealEstateExistingTotal = {
        totalAmount: 0,
    };

    nonRealEstateProposeTotal = {
        totalAmount: 0,
    };
    proposeAndExistingSecurity = [];
    nonEstateExistingSecurityOnly = [];
    nonEstateProposeExistingSecurity = [];

    constructor(private collateralSiteVisitService: CollateralSiteVisitService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.security)) {
            this.formData = JSON.parse(this.security.data);
        }

        if (this.formData['selectedArray'] !== undefined) {
            if (this.formData['initialForm'] !== undefined) {
                // For Land, Land and Building, And Apartment or real estate Collateral
                const landDetail = this.formData['initialForm']['landDetails'];
                const landBuildingDetail = this.formData['initialForm']['landBuilding'];
                const apartmentDetail = this.formData['initialForm']['buildingDetails'];

                this.checkSecurityInSelectedArray('LandSecurity');
                this.checkSecurityInSelectedArray('Land and Building Security');
                this.checkSecurityInSelectedArray('ApartmentSecurity');
                this.existingSecurityOnly = [];
                // land security
                if (this.landSelected) {
                    this.getEstateProposedAndExistingSecurity(landDetail, 'Land');
                    this.calculateExistingValue('Land');
                }
                // land and building Security
                if (this.landBuilding) {
                    this.getEstateProposedAndExistingSecurity(landBuildingDetail, 'Land and Building');
                    this.calculateExistingValue('Land and Building');
                }
                // Apartment Security
                if (this.apartmentSelected) {
                    this.getEstateProposedAndExistingSecurity(apartmentDetail, 'Apartment');
                    this.calculateExistingValue('Apartment');
                }
                this.calculateRealEstateExistingTotal();

                this.proposeAndExistingSecurity = [];
                if (this.landSelected) {
                    this.calculateExistingAndProposedValue('Land');
                }
                if (this.landBuilding) {
                    this.calculateExistingAndProposedValue('Land and Building');
                }
                if (this.apartmentSelected) {
                    this.calculateExistingAndProposedValue('Apartment');
                }
                this.calculateRealEstateProposedTotal();

                // Other Security ie. Vehicle, plant And Machinery
                const vehicle = this.formData['initialForm']['vehicleDetails'];
                const hypoOfStock = this.formData['initialForm']['hypothecationOfStock'];
                const plant = this.formData['initialForm']['plantDetails'];
                const fixedDeposit = this.formData['initialForm']['fixedDepositDetails'];
                const insurance = this.formData['initialForm']['insurancePolicy'];

                // Plant and machinery security
                this.checkSecurityInSelectedArray('PlantSecurity');
                // Hypothecation of stock security
                this.checkSecurityInSelectedArray('HypothecationOfStock');
                // Vehicle security
                this.checkSecurityInSelectedArray('VehicleSecurity');
                // Insurance policy
                this.checkSecurityInSelectedArray('InsurancePolicySecurity');
                // Fixed deposit receipt security
                this.checkSecurityInSelectedArray('FixedDeposit');
                this.nonEstateExistingSecurityOnly = [];
                if (this.vehicleSelected) {
                    this.getProposeExistingForNonEstate(vehicle, 'Vehicle');
                    this.calculateExistingNonEstateValue('Vehicle');
                }
                if (this.hypothecation) {
                    this.getProposeExistingForNonEstate(hypoOfStock, 'Hypothecation of Stock');
                    this.calculateExistingNonEstateValue('Hypothecation of Stock');
                }
                if (this.plantSelected) {
                    this.getProposeExistingForNonEstate(plant, 'Plant and Machinery Security');
                    this.calculateExistingNonEstateValue('Plant and Machinery Security');
                }
                if (this.fixedDepositSelected) {
                    this.getProposeExistingForNonEstate(fixedDeposit, 'Fixed Deposit Receipt');
                    this.calculateExistingNonEstateValue('Fixed Deposit Receipt');
                }
                if (this.insurancePolicySelected) {
                    this.getProposeExistingForNonEstate(insurance, 'Insurance Policy Security');
                    this.calculateExistingNonEstateValue('Insurance Policy Security');
                }
                this.calculateOtherSecurityExistingTotal();
                this.nonEstateProposeExistingSecurity = [];
                if (this.vehicleSelected) {
                    this.calculateExistingAndProposedNonEstate('Vehicle');
                }
                if (this.hypothecation) {
                    this.calculateExistingAndProposedNonEstate('Hypothecation of Stock');
                }
                if (this.plantSelected) {
                    this.calculateExistingAndProposedNonEstate('Plant and Machinery Security');
                }
                if (this.fixedDepositSelected) {
                    this.calculateExistingAndProposedNonEstate('Fixed Deposit Receipt');
                }
                if (this.insurancePolicySelected) {
                    this.calculateExistingAndProposedNonEstate('Insurance Policy Security');
                }
                this.calculateOtherSecurityProposedTotal();
            }
        }
    }

    getEstateProposedAndExistingSecurity(securityDetail: any[], securityName: string) {
        if (securityName === 'Apartment') {
            securityDetail.forEach(d => {
                if (d.forProposed) {
                    this.proposedSecurity1.push({
                        securityName: securityName,
                        considerValue: d.totalCost,
                        marketValue: d.buildingFairMarketValue,
                        distressValue: d.buildingDistressValue,
                    });
                }
                if (d.forExisting) {
                    this.existingSecurity1.push({
                        securityName: securityName,
                        considerValue: d.totalCost,
                        marketValue: d.buildingFairMarketValue,
                        distressValue: d.buildingDistressValue,
                    });
                }
            });
        } else {
            securityDetail.forEach(d => {
                if (d.forProposed) {
                    this.proposedSecurity1.push({
                        securityName: securityName,
                        considerValue: d.landConsideredValue,
                        marketValue: d.marketValue,
                        distressValue: d.distressValue,
                    });
                }
                if (d.forExisting) {
                    this.existingSecurity1.push({
                        securityName: securityName,
                        considerValue: d.landConsideredValue,
                        marketValue: d.marketValue,
                        distressValue: d.distressValue,
                    });
                }
            });
        }
    }


    calculateExistingValue(securityName: string) {
        if (this.existingSecurity1.length > 0) {
            const securityData = this.existingSecurity1.filter(es => es.securityName === securityName);
            if (securityData.length > 0) {
                let existingMV = 0;
                let existingFMV = 0;
                let existingCV = 0;
                securityData.forEach(sd => {
                    existingMV += !ObjectUtil.isEmpty(sd.marketValue) ? Number(sd.marketValue) : 0;
                    existingCV += !ObjectUtil.isEmpty(sd.considerValue) ? Number(sd.considerValue) : 0;
                    existingFMV += !ObjectUtil.isEmpty(sd.distressValue) ? Number(sd.distressValue) : 0;
                });
                const detail = {
                    securityName: securityName,
                    marketValue: existingMV.toFixed(2),
                    considerValue: existingCV.toFixed(2),
                    distressValue: existingFMV.toFixed(2),
                };
                this.existingSecurityOnly.push(detail);
            }
        }
    }

    calculateRealEstateExistingTotal() {
        if (this.existingSecurityOnly.length > 0) {
            let mv = 0;
            let dv = 0;
            let cv = 0;
            this.realEstateExistingTotal = {
                marketValue: 0,
                considerValue: 0,
                distressValue: 0,
            };
            this.existingSecurityOnly.forEach(ex => {
                mv += Number(ex.marketValue);
                cv += Number(ex.considerValue);
                dv += Number(ex.distressValue);
            });
            this.realEstateExistingTotal.marketValue = Number(mv.toFixed(2));
            this.realEstateExistingTotal.considerValue = Number(cv.toFixed(2));
            this.realEstateExistingTotal.distressValue = Number(dv.toFixed(2));
        }
    }

    calculateExistingAndProposedValue(securityName: string) {
        if (this.proposedSecurity1.length > 0) {
            const securityDetail = this.proposedSecurity1.filter(es => es.securityName === securityName);
            const existingSecurityDetail = this.existingSecurityOnly.filter(es => es.securityName === securityName);
            if (securityDetail.length > 0) {
                let existingMV = 0;
                let existingDv = 0;
                let existingCV = 0;
                securityDetail.forEach(sd1 => {
                    existingMV += !ObjectUtil.isEmpty(sd1.marketValue) ? Number(sd1.marketValue) : 0;
                    existingCV += !ObjectUtil.isEmpty(sd1.considerValue) ? Number(sd1.considerValue) : 0;
                    existingDv += !ObjectUtil.isEmpty(sd1.distressValue) ? Number(sd1.distressValue) : 0;
                });
                const finalDV = Number(existingDv) + (existingSecurityDetail.length > 0
                    ? Number(existingSecurityDetail[0].distressValue) : 0);
                const finalCV = Number(existingCV) + (existingSecurityDetail.length > 0
                    ? Number(existingSecurityDetail[0].considerValue) : 0);
                const finalMV = Number(existingMV) + (existingSecurityDetail.length > 0
                    ? Number(existingSecurityDetail[0].marketValue) : 0);
                const detail = {
                    securityName: securityName,
                    marketValue: finalMV.toFixed(2),
                    considerValue: finalCV.toFixed(2),
                    distressValue: finalDV.toFixed(2),
                };
                this.proposeAndExistingSecurity.push(detail);
            } else {
                const detail = {
                    securityName: securityName,
                    marketValue: existingSecurityDetail.length > 0 ? Number(existingSecurityDetail[0].marketValue).toFixed(2) : 0,
                    considerValue: existingSecurityDetail.length > 0 ? Number(existingSecurityDetail[0].considerValue).toFixed(2) : 0,
                    distressValue: existingSecurityDetail.length > 0 ? Number(existingSecurityDetail [0].distressValue).toFixed(2) : 0,
                };
                this.proposeAndExistingSecurity.push(detail);
            }
        } else {
            this.proposeAndExistingSecurity = this.existingSecurityOnly;
        }
    }

    calculateRealEstateProposedTotal() {
        if (this.proposeAndExistingSecurity.length > 0) {
            let dv = 0;
            let cv = 0;
            let mv = 0;
            this.realEstateProposeTotal = {
                marketValue: 0,
                considerValue: 0,
                distressValue: 0,
            };
            this.proposeAndExistingSecurity.forEach(pe => {
                mv += Number(pe.marketValue);
                cv += Number(pe.considerValue);
                dv += Number(pe.distressValue);
            });
            this.realEstateProposeTotal.marketValue += Number(mv.toFixed(2));
            this.realEstateProposeTotal.considerValue += Number(cv.toFixed(2));
            this.realEstateProposeTotal.distressValue += Number(dv.toFixed(2));
        }
    }

    getProposeExistingForNonEstate(securityData: any[], securityName: string) {
        switch (securityName) {
            case 'Vehicle':
                securityData.forEach(sd => {
                    if (sd.forProposed) {
                        let amount = 0;
                        amount += Number(sd.quotationAmount);
                        this.proposedSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                    if (sd.forExisting) {
                        let amount = 0;
                        amount += Number(sd.quotationAmount);
                        this.existingSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                });
                break;
            case 'Plant and Machinery Security':
                securityData.forEach(sd => {
                    if (sd.forProposed) {
                        let amount = 0;
                        amount += Number(sd.quotation);
                        this.proposedSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                    if (sd.forExisting) {
                        let amount = 0;
                        amount += Number(sd.quotation);
                        this.existingSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                });
                break;
            case 'Hypothecation of Stock':
                securityData.forEach(sd => {
                    if (sd.forProposed) {
                        let amount = 0;
                        amount += Number(sd.value);
                        this.proposedSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                    if (sd.forExisting) {
                        let amount = 0;
                        amount += Number(sd.value);
                        this.existingSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                });
                break;
            case 'Fixed Deposit Receipt':
                securityData.forEach(fd => {
                    if (fd.forProposed) {
                        let amount = 0;
                        amount += Number(fd.amount);
                        this.proposedSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                    if (fd.forExisting) {
                        let amount = 0;
                        amount += Number(fd.amount);
                        this.existingSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                });
                break;
            case 'Insurance Policy Security':
                securityData.forEach(insur => {
                    if (insur.forProposed) {
                        let amount = 0;
                        amount += Number(insur.insuredAmount);
                        this.proposedSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                    if (insur.forExisting) {
                        let amount = 0;
                        amount += Number(insur.insuredAmount);
                        this.existingSecurity2.push({
                            securityName: securityName,
                            totalAmount: amount
                        });
                    }
                });
                break;
            default:
        }
    }

    calculateExistingNonEstateValue(securityName: string) {
        if (this.existingSecurity2.length > 0) {
            const securityData = this.existingSecurity2.filter(es => es.securityName === securityName);
            if (securityData.length > 0) {
                let totalAmount = 0;
                securityData.forEach(sd => {
                    totalAmount += !ObjectUtil.isEmpty(sd.totalAmount) ? Number(sd.totalAmount) : 0;
                });
                const detail = {
                    securityName: securityName,
                    totalAmount: totalAmount.toFixed(2),
                };
                this.nonEstateExistingSecurityOnly.push(detail);
            }
        }
    }

    calculateExistingAndProposedNonEstate(securityName: string) {
        if (this.proposedSecurity2.length > 0) {
            const securityDetail = this.proposedSecurity2.filter(es => es.securityName === securityName);
            const existingSecurityDetail = this.nonEstateExistingSecurityOnly.filter(es => es.securityName === securityName);
            if (securityDetail.length > 0) {
                let totalAmount = 0;
                securityDetail.forEach(sd1 => {
                    totalAmount += !ObjectUtil.isEmpty(sd1.totalAmount) ? Number(sd1.totalAmount) : 0;
                });
                const detail = {
                    securityName: securityName,
                    totalAmount: totalAmount + (existingSecurityDetail.length > 0 ? existingSecurityDetail[0].totalAmount : 0),
                };
                this.nonEstateProposeExistingSecurity.push(detail);
            } else {
                const detail = {
                    securityName: securityName,
                    totalAmount: existingSecurityDetail.length > 0 ? existingSecurityDetail[0].totalAmount : 0,
                };
                this.nonEstateProposeExistingSecurity.push(detail);
            }
        } else {
            this.nonEstateProposeExistingSecurity = this.nonEstateExistingSecurityOnly;
        }
    }

    calculateOtherSecurityExistingTotal() {
        if (this.nonEstateExistingSecurityOnly.length > 0) {
            let amount = 0;
            this.nonRealEstateExistingTotal = {
                totalAmount: 0,
            };
            this.nonEstateExistingSecurityOnly.forEach(ne => {
                amount += Number(ne.totalAmount);
            });
            this.nonRealEstateExistingTotal.totalAmount = Number(amount.toFixed(2));
        }
    }

    calculateOtherSecurityProposedTotal() {
        if (this.nonEstateProposeExistingSecurity.length > 0) {
            let amount = 0;
            this.nonRealEstateProposeTotal = {
                totalAmount: 0,
            };
            this.nonEstateProposeExistingSecurity.forEach(nep => {
                amount += Number(nep.totalAmount);
            });
            this.nonRealEstateProposeTotal.totalAmount = Number(amount.toFixed(2));
        }
    }

    checkSecurityInSelectedArray(securityName: string) {
        this.formData['selectedArray'].filter(f => {
            if (f.indexOf(securityName) !== -1) {
                switch (securityName) {
                    case 'LandSecurity':
                        this.landSelected = true;
                        break;
                    case 'Land and Building Security':
                        this.landBuilding = true;
                        break;
                    case 'ApartmentSecurity':
                        this.apartmentSelected = true;
                        break;
                    case 'PlantSecurity':
                        this.plantSelected = true;
                        break;
                    case 'HypothecationOfStock':
                        this.hypothecation = true;
                        break;
                    case 'VehicleSecurity':
                        this.vehicleSelected = true;
                        break;
                    case 'InsurancePolicySecurity':
                        this.insurancePolicySelected = true;
                        break;
                    case 'FixedDeposit':
                        this.fixedDepositSelected = true;
                        break;
                }
            }
        });
    }
}
