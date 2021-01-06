import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-exposure',
    templateUrl: './exposure.component.html',
    styleUrls: ['./exposure.component.scss']
})
export class ExposureComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;

    // todo replace with api from backend predefined data
    frequencyList = ['Semi-Annually', 'Quarterly', 'Monthly', 'Bullet', 'Ballooning'];

    spinner = false;
    exposureForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private routerUtilsService: RouterUtilsService,
                private service: CreditAdministrationService,
                private toastService: ToastService) {
    }

    get disbursementDetails() {
        return this.exposureForm.get('disbursementDetails') as FormArray;
    }

    get totalLimit() {
        let t = 0;
        this.disbursementDetails.controls.forEach(value => t += Number(value.get('loanLimit').value));
        return t;
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;
        }
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData.exposure && !ObjectUtil.isEmpty(this.cadData.exposure.data))) {
            this.setDisbursementDetails();
        } else {
            this.addDisbursementDetail();
        }
    }

    buildForm() {
        this.exposureForm = this.formBuilder.group({
            disbursementDetails: this.formBuilder.array([])
        });
    }

    addDisbursementDetail() {
        this.cadData.assignedLoan.forEach(value => {
            this.disbursementDetails.push(this.formBuilder.group({
                loanName: [value.loan.name],
                loanLimit: [value.proposal.proposedLimit, Validators.required],
                feePercent: [0, Validators.required],
                disbursement: [0, Validators.required],
                initialRate: [0, Validators.required],
                maturity: [0, Validators.required],
                frequency: [undefined, Validators.required],
            }));
        });
    }

    setDisbursementDetails() {
        let data = [];
        if (!ObjectUtil.isEmpty(this.cadData.exposure.data)) {
            data = JSON.parse(this.cadData.exposure.data).disbursementDetails;
            data.forEach(value => {
                this.disbursementDetails.push(this.formBuilder.group({
                    loanName: [value.loanName],
                    loanLimit: [value.loanLimit, Validators.required],
                    feePercent: [value.feePercent, Validators.required],
                    disbursement: [value.disbursement, Validators.required],
                    initialRate: [value.initialRate, Validators.required],
                    maturity: [value.maturity, Validators.required],
                    frequency: [value.frequency, Validators.required],
                }));
            });
        }
    }

    submit() {
        this.spinner = true;
        this.cadData.exposure.data = JSON.stringify(this.exposureForm.value);
        this.service.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Exposure data!!!'));
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
            this.spinner = false;
        }, error => {
            console.log(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to save Exposure data!!!'));
        });
    }
}
