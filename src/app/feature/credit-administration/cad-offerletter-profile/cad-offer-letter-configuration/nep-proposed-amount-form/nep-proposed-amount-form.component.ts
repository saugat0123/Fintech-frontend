import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NbDialogRef} from '@nebular/theme';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {PersonalLoan} from '../../../model/personalLoan';

@Component({
    selector: 'app-nep-proposed-amount-form',
    templateUrl: './nep-proposed-amount-form.component.html',
    styleUrls: ['./nep-proposed-amount-form.component.scss']
})
export class NepProposedAmountFormComponent implements OnInit {
    @Input() customerInfo: CustomerInfoData;
    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    nepaliNumber = new NepaliNumberAndWords();
    personalLoan = new PersonalLoan();
    nepForm: FormGroup;
    spinner = false;
    submitted = false;
    client = environment.client;
    clientList = Clients;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private service: CreditAdministrationService,
                private router: RouterUtilsService,
                private dialogRef: NbDialogRef<NepProposedAmountFormComponent>) {
    }

    ngOnInit() {
        console.log('cadData', this.cadData);
        if (ObjectUtil.isEmpty(this.cadData.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData.personalLoan)) {
            this.personalLoan = JSON.parse(this.cadData.personalLoan);
        }
        this.buildForm();
    }

    buildForm() {
        this.nepForm = this.formBuilder.group({
            nepaliNumber: [this.nepaliNumber.numberNepali],
            engNumber: [this.nepaliNumber.engNumber, Validators.required],
            initDate: [this.nepaliNumber.initDate, Validators.required],
            branchName: [this.personalLoan.branchName, Validators.required],
            branchDistrict: [this.personalLoan.branchDistrict, Validators.required],
            branchMunVdc: [this.personalLoan.branchMunVdc, Validators.required],
            branchWardNo: [this.personalLoan.branchWardNo, Validators.required],
            loanType: [this.personalLoan.loanType, Validators.required],
            interestRate: [this.personalLoan.interestRate, Validators.required],
            serviceFee: [this.personalLoan.serviceFee, Validators.required],
            tenureOfLoanInMonths: [this.personalLoan.tenureOfLoanInMonths, Validators.required],
            tenureOfLoanInYears: [this.personalLoan.tenureOfLoanInYears, Validators.required],
            installmentAmount: [this.personalLoan.installmentAmount, Validators.required]
        });
    }

    onChangeValue(event) {
        let number = 0;
        if (!ObjectUtil.isEmpty(event.target.value)) {
            number = event.target.value;
        }
        this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
        this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
        this.nepaliNumber.engNumber = number;
    }

    get nepFormControls() {
        return this.nepForm.controls;
    }

    save() {
        this.submitted = true;
        if (this.nepForm.invalid) {
            return;
        }
        this.spinner = true;
        this.nepaliNumber.initDate = this.nepForm.get('initDate').value;
        this.personalLoan.branchName = this.nepForm.get('branchName').value;
        this.personalLoan.branchDistrict = this.nepForm.get('branchDistrict').value;
        this.personalLoan.branchMunVdc = this.nepForm.get('branchMunVdc').value;
        this.personalLoan.branchWardNo = this.nepForm.get('branchWardNo').value;
        this.personalLoan.loanType = this.nepForm.get('loanType').value;
        this.personalLoan.interestRate = this.nepForm.get('interestRate').value;
        this.personalLoan.serviceFee = this.nepForm.get('serviceFee').value;
        this.personalLoan.tenureOfLoanInMonths = this.nepForm.get('tenureOfLoanInMonths').value;
        this.personalLoan.tenureOfLoanInYears = this.nepForm.get('tenureOfLoanInYears').value;
        this.personalLoan.installmentAmount = this.nepForm.get('installmentAmount').value;
        this.cadData.nepData = JSON.stringify(this.nepaliNumber);
        this.cadData.personalLoan = JSON.stringify(this.personalLoan);
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res: any) => {
            this.spinner = false;
            this.dialogRef.close();
            this.router.reloadCadProfileRoute(this.cadData.id);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Updated SUCCESSFULLY!!!'));
        }, error => {
            this.spinner = false;
            this.dialogRef.close();
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
        });
    }

    closeModal() {
        this.dialogRef.close();
    }
}
