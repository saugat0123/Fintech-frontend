import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepseMaster} from '../../../../admin/modal/NepseMaster';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {OwnershipTransfer} from '../../../model/ownershipTransfer';


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
    @Input() securityId: number;
    @Input() collateralSiteVisitDetail = [];
    @Input() isCollateralSiteVisit;

    constructor() {
    }

    ngOnInit() {
        // land security
        this.formData['initialForm']['landDetails'].filter(f => {
            if (f.owner !== null) {
                this.showTitle = true;
                this.landSelected = true;
            }
        });

        // apartment security
        this.formData['initialForm']['buildingDetails'].filter(f => {
            if (f.buildArea !== '') {
                this.showTitle = true;
                this.apartmentSelected = true;
            }
        });
        // land and building security
        this.formData['initialForm']['landBuilding'].filter(f => {
            if (f.owner !== null) {
                this.showTitle = true;
                this.landBuilding = true;
            }
        });
        // plant and machinery security
        this.formData['initialForm']['plantDetails'].filter(f => {
            if (f.model !== '') {
                this.showTitle = true;
                this.plantSelected = true;
            }
        });
        // // vehicle security
        this.formData['initialForm']['vehicleDetails'].filter(f => {
            if (f.model !== '') {
                this.showTitle = true;
                this.vehicleSelected = true;
            }
        });
        // fixed deposit receipt security
        this.formData['initialForm']['fixedDepositDetails'].filter(f => {
            if (f.accountNumber !== null) {
                this.showTitle = true;
                this.depositSelected = true;
            }
        });
        //
        // // shared security
        if (!ObjectUtil.isEmpty(this.shareSecurity.shareSecurityDetails)) {
            if (this.shareSecurity.avgDaysForPrice !== '') {
                this.showTitle = true;
                this.shareSelected = true;
            }
        }
        // hypothecation of stock security
        this.formData['initialForm']['hypothecationOfStock'].filter(f => {
            if (f.owner !== null) {
                this.showTitle = true;
                this.hypothecation = true;
            }
        });
        // assignment of receivables
        this.formData['initialForm']['assignmentOfReceivables'].filter(f => {
            if (f.amount !== null) {
                this.showTitle = true;
                this.assignment = true;
            }
        });
        // lease assignment
        this.formData['initialForm']['leaseAssignment'].filter(f => {
            if (f.otherDetail !== '') {
                this.showTitle = true;
                this.assignments = true;
            }
        });
        // other security
        this.formData['initialForm']['otherSecurity'].filter(f => {
            if (f.otherDetail !== '') {
                this.showTitle = true;
                this.securityOther = true;
            }
        });
        // corporate guarantee
        this.formData['initialForm']['corporateGuarantee'].filter(f => {
            if (f.name !== null) {
                this.showTitle = true;
                this.corporate = true;
            }
        });
        // personal guarantee
        this.formData['initialForm']['personalGuarantee'].filter(f => {
            if (f.name !== null) {
                this.showTitle = true;
                this.personal = true;
            }
        });
        // insurance policy
        this.formData['initialForm']['insurancePolicy'].filter(f => {
            if (f.insuredAmount !== null) {
                this.showTitle = true;
                this.insurancePolicySelected = true;
            }
        });

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
