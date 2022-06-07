import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../loan/model/security';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-retail-security',
    templateUrl: './retail-security.component.html',
    styleUrls: ['./retail-security.component.scss']
})
export class RetailSecurityComponent implements OnInit {

    constructor() {
    }

    @Input() security: Security;
    @Input() loanDataHolder: LoanDataHolder;
    formData: any;
    landSelected;
    apartmentSelected;
    landBuilding;
    plantSelected;
    vehicleSelected;
    depositSelected;
    shareSelected;
    hypothecation;
    assignment;
    assignments;
    personal;
    insurancePolicySelected;
    corporate;
    securityOther;
    proposalAllData;
    files = [];
    shareData;
    shareDataDetails;
    ngOnInit() {
        this.formData = JSON.parse(this.security.data);
        console.log(this.formData, 'files security::;');
        if (!ObjectUtil.isEmpty(this.formData.files)) {
            this.files = JSON.parse(this.formData.files);
        }
        this.selectedSecurity();
    }

    selectedSecurity() {
        if (this.formData['selectedArray'] !== undefined) {
            // land security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('LandSecurity') !== -1) {
                    this.landSelected = true;
                }
            });

            // apartment security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('ApartmentSecurity') !== -1) {
                    this.apartmentSelected = true;
                }
            });
            // land and building security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('Land and Building Security') !== -1) {
                    this.landBuilding = true;
                }
            });
            // plant and machinery security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('PlantSecurity') !== -1) {
                    this.plantSelected = true;
                }
            });
            // // vehicle security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('VehicleSecurity') !== -1) {
                    this.vehicleSelected = true;
                }
            });
            // fixed deposit receipt security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('FixedDeposit') !== -1) {
                    this.depositSelected = true;
                }
            });
            //
            // // shared security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('ShareSecurity') !== -1) {
                    this.shareSelected = true;
                }
            });
            // hypothecation of stock security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('HypothecationOfStock') !== -1) {
                    this.hypothecation = true;
                }
            });
            // assignment of receivables
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('AssignmentOfReceivables') !== -1) {
                    this.assignment = true;
                }
            });
            // lease assignment
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('LeaseAssignment') !== -1) {
                    this.assignments = true;
                }
            });
            // other security
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('OtherSecurity') !== -1) {
                    this.securityOther = true;
                }
            });
            // corporate guarantee
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('CorporateGuarantee') !== -1) {
                    this.corporate = true;
                }
            });
            // personal guarantee
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('PersonalGuarantee') !== -1) {
                    this.personal = true;
                }
            });
            // insurance policy
            this.formData['selectedArray'].filter(f => {
                if (f.indexOf('InsurancePolicySecurity') !== -1) {
                    this.insurancePolicySelected = true;
                }
            });
        }
        this.shareData = JSON.parse(this.loanDataHolder.loanHolder.shareSecurity.data);
        this.shareDataDetails = this.loanDataHolder.loanHolder.shareSecurity;
        console.log('shareData', this.shareData);
        console.log(this.shareDataDetails, 'share Data Details');

    }

    getTotal(controlName, keyName) {
        let total = 0;
        Array.from(this.formData['initialForm'][controlName]).forEach((d) => {
            if (!isNaN(Number(d[keyName]))) {
                total += Number(d[keyName]);
            }
        });
        return total;
    }
}
