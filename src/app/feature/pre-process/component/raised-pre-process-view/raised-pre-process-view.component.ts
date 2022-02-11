import {Component, Input, OnInit} from '@angular/core';
import {PreProcessService} from '../../service/pre-process.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {PreProcessLoanModalComponent} from '../pre-process-loan-modal/pre-process-loan-modal.component';
import {CustomerType} from '../../../customer/model/customerType';
import {Router} from '@angular/router';
import {LoanType} from '../../../loan/model/loanType';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-raised-pre-process-view',
    templateUrl: './raised-pre-process-view.component.html',
    styleUrls: ['./raised-pre-process-view.component.scss']
})
export class RaisedPreProcessViewComponent implements OnInit {
    @Input() customerInfoId: number;
    @Input() customerProfileId;
    @Input() customerType: CustomerType;
    @Input() customerInfoDetails: CustomerInfoData;
    customerPreProcessData: any;
    selectedLoan: any;
    loanLists = [];
    showOptions = false;
    isValidationEnabled = environment.validation;

    constructor(private preProcessService: PreProcessService,
                private toastService: ToastService,
                private modalService: NbDialogService,
                private router: Router) {
    }

    ngOnInit() {
        /* For Pre process Details */
        this.getPreProcessDetails();
        console.log('This is customer info id', this.customerInfoId);
    }

    getPreProcessDetails() {
        this.preProcessService.getPreProcessList(this.customerInfoId).subscribe((res: any) => {
            this.customerPreProcessData = res.detail;
            this.getLoanName(this.customerPreProcessData);
            console.log('Customer Pre Process Details ::', this.customerPreProcessData);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    getLoanName(details) {
        if (details.length > 0) {
            const tempData = details.filter((val: any) => val.status === 'RAISED');
            this.loanLists = tempData;
            console.log('This is loan lists::', tempData);
            /*details.forEach(data => {
                if (data.status === 'PENDING') {
                    this.loanLists.push(data);
                }
            });*/
        }

        if (this.loanLists.length > 0) {
            this.showOptions = true;
        } else {
            this.showOptions = false;
        }
    }

    openModal() {
        console.log('Open Modal', this.customerType);
        const dialog = this.modalService.open(PreProcessLoanModalComponent, {
            context: {
                preProcessDetails: this.selectedLoan,
                customerInfoId: this.customerInfoId,
                loanConfigId: this.selectedLoan.loanConfig.id,
                customerType: this.customerType,
                customerProfileId: this.customerProfileId,
                loanType: LoanType.keyValue(LoanType.NEW_LOAN),
                customerInfoDetails: this.customerInfoDetails,
            },
            /*dialogClass: 'model-full',*/
            closeOnBackdropClick: false,
            hasBackdrop: true,
            hasScroll: true
        });
    }

}
