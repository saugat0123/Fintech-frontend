import {Component, DoCheck, Input, IterableDiffers, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ExistingExposure} from '../../../../../model/existingExposure';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-above-request-of-the-customer',
    templateUrl: './above-request-of-the-customer.component.html',
    styleUrls: ['./above-request-of-the-customer.component.scss'],
})
export class AboveRequestOfTheCustomerComponent implements OnInit, DoCheck {
    @Input() customerAllLoanList: LoanDataHolder[];
    @Input() existingExposureData: ExistingExposure[] = [];
    customerLoanAndExposureData: {
        loanType: string,
        loanName: string,
        proposedLimit: number,
    } [] = [];
    iterableDiffer;

    constructor(private iterableDiffers: IterableDiffers) {
        this.iterableDiffer = iterableDiffers.find([]).create(null);
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        const changes = this.iterableDiffer.diff(this.customerAllLoanList);
        if (changes) {
            this.customerLoanAndExposureData = [];
            this.customerAllLoanList.forEach(cl => {
                this.setExistingAndProposedData(cl.loan.name, cl.loanType, cl.proposal.proposedLimit);
            });
            if (!ObjectUtil.isEmpty(this.existingExposureData) && this.existingExposureData.length > 0) {
                this.existingExposureData.forEach(ee => {
                    if (ee.isReview) {
                        this.setExistingAndProposedData(ee.loanName, ee.loanType, ee.originalLimit);
                    }
                });
            }
        }
    }

    setExistingAndProposedData(loanName, loanType, amount) {
        const proposalAndExposure = {
            loanType: null,
            loanName: null,
            proposedLimit: null,
        };
        proposalAndExposure.loanName = loanName;
        proposalAndExposure.loanType = loanType;
        proposalAndExposure.proposedLimit = amount;
        this.customerLoanAndExposureData.push(proposalAndExposure);
    }
}
