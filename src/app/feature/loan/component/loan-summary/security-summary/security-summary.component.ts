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
    ckeConfig: any;

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
