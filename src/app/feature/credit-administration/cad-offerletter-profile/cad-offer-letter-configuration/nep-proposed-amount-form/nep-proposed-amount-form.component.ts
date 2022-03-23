import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
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
import {NepDataPersonal} from '../../../model/nepDataPersonal';
import {CustomerType} from '../../../../customer/model/customerType';
import {Branch} from '../../../../admin/modal/branch';

@Component({
    selector: 'app-nep-proposed-amount-form',
    templateUrl: './nep-proposed-amount-form.component.html',
    styleUrls: ['./nep-proposed-amount-form.component.scss']
})

export class NepProposedAmountFormComponent implements OnInit {
    @Output() NepProposedAmountFormEmitter = new EventEmitter();
    @Input() customerInfo: CustomerInfoData;
    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    nepaliNumber = new NepaliNumberAndWords();
    nepDataPersonal = new NepDataPersonal();
    nepForm: FormGroup;
    spinner = false;
    submitted = false;
    client = environment.client;
    clientList = Clients;
    branch: Branch;

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
        if (!ObjectUtil.isEmpty(this.cadData.nepDataPersonal)) {
            this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
        }
        this.branch = this.customerInfo.branch;
        this.buildForm();
    }

    buildForm() {
        this.nepaliNumber = JSON.parse(this.cadData.nepData);
        this.nepForm = this.formBuilder.group({
            nepaliNumber: [this.nepDataPersonal.numberNepali],
            engNumber: [this.nepDataPersonal.engNumber, Validators.required],
            initDate: [this.nepDataPersonal.initDate],
            loanType: [this.nepDataPersonal.loanType],
            interestRate: [this.nepDataPersonal.interestRate],
            serviceFeePercent: [this.nepDataPersonal.serviceFeePercent],
            serviceFeeAmount: [this.nepDataPersonal.serviceFeeAmount],
            tenureOfLoanInMonths: [this.nepDataPersonal.tenureOfLoanInMonths],
            tenureOfLoanInYears: [this.nepDataPersonal.tenureOfLoanInYears],
            installmentAmount: [this.nepDataPersonal.installmentAmount],
            typeOfLoanInEnglish: [this.nepDataPersonal.typeOfLoanInEnglish],
            purposeOfLoan: [this.nepDataPersonal.purposeOfLoan],
            loanApprovalNo: [this.nepDataPersonal.loanApprovalNo],
            baseRate: [this.nepDataPersonal.baseRate],
            premium: [this.nepDataPersonal.premium],
            discount: [this.nepDataPersonal.discount],
            cibCharges: [this.nepDataPersonal.cibCharges],
            interestInstallmentPaymentFrequency: [this.nepDataPersonal.interestInstallmentPaymentFrequency],
            loanMaturityDateBS: [this.nepDataPersonal.loanMaturityDateBS],
            loanMaturityDateAD: [this.nepDataPersonal.loanMaturityDateAD],
        });
    }

    onChangeValue(event) {
        let number = 0;
        if (!ObjectUtil.isEmpty(event.target.value)) {
            number = event.target.value;
        }
        this.nepDataPersonal.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
        this.nepDataPersonal.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
        this.nepDataPersonal.engNumber = number;
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
        this.nepDataPersonal.initDate = this.nepForm.get('initDate').value;
        this.nepDataPersonal.loanApprovalNo = this.nepForm.get('loanApprovalNo').value;
        this.nepDataPersonal.loanType = this.nepForm.get('loanType').value;
        this.nepDataPersonal.interestRate = this.nepForm.get('interestRate').value;
        this.nepDataPersonal.serviceFeePercent = this.nepForm.get('serviceFeePercent').value;
        this.nepDataPersonal.serviceFeeAmount = this.nepForm.get('serviceFeeAmount').value;
        this.nepDataPersonal.tenureOfLoanInMonths = this.nepForm.get('tenureOfLoanInMonths').value;
        this.nepDataPersonal.tenureOfLoanInYears = this.nepForm.get('tenureOfLoanInYears').value;
        this.nepDataPersonal.installmentAmount = this.nepForm.get('installmentAmount').value;
        this.nepDataPersonal.typeOfLoanInEnglish = this.nepForm.get('typeOfLoanInEnglish').value;
        this.nepDataPersonal.purposeOfLoan = this.nepForm.get('purposeOfLoan').value;
        this.nepDataPersonal.baseRate = this.nepForm.get('baseRate').value;
        this.nepDataPersonal.premium = this.nepForm.get('premium').value;
        this.nepDataPersonal.discount = this.nepForm.get('discount').value;
        this.nepDataPersonal.cibCharges = this.nepForm.get('cibCharges').value;
        this.nepDataPersonal.interestInstallmentPaymentFrequency = this.nepForm.get('interestInstallmentPaymentFrequency').value;
        this.nepDataPersonal.loanMaturityDateBS = this.nepForm.get('loanMaturityDateBS').value;
        this.nepDataPersonal.loanMaturityDateAD = this.nepForm.get('loanMaturityDateAD').value;
        this.cadData.nepData = JSON.stringify(this.nepDataPersonal);
        this.cadData.nepDataPersonal = JSON.stringify(this.nepDataPersonal);
        this.NepProposedAmountFormEmitter.emit(this.cadData);
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

    getCadValue() {
        this.nepDataPersonal.initDate = this.nepForm.get('initDate').value;
        this.nepDataPersonal.loanApprovalNo = this.nepForm.get('loanApprovalNo').value;
        this.nepDataPersonal.loanType = this.nepForm.get('loanType').value;
        this.nepDataPersonal.interestRate = this.nepForm.get('interestRate').value;
        this.nepDataPersonal.serviceFeePercent = this.nepForm.get('serviceFeePercent').value;
        this.nepDataPersonal.serviceFeeAmount = this.nepForm.get('serviceFeeAmount').value;
        this.nepDataPersonal.tenureOfLoanInMonths = this.nepForm.get('tenureOfLoanInMonths').value;
        this.nepDataPersonal.tenureOfLoanInYears = this.nepForm.get('tenureOfLoanInYears').value;
        this.nepDataPersonal.installmentAmount = this.nepForm.get('installmentAmount').value;
        this.nepDataPersonal.typeOfLoanInEnglish = this.nepForm.get('typeOfLoanInEnglish').value;
        this.nepDataPersonal.purposeOfLoan = this.nepForm.get('purposeOfLoan').value;
        this.nepDataPersonal.baseRate = this.nepForm.get('baseRate').value;
        this.nepDataPersonal.premium = this.nepForm.get('premium').value;
        this.nepDataPersonal.discount = this.nepForm.get('discount').value;
        this.nepDataPersonal.cibCharges = this.nepForm.get('cibCharges').value;
        this.nepDataPersonal.interestInstallmentPaymentFrequency = this.nepForm.get('interestInstallmentPaymentFrequency').value;
        this.nepDataPersonal.loanMaturityDateBS = this.nepForm.get('loanMaturityDateBS').value;
        this.nepDataPersonal.loanMaturityDateAD = this.nepForm.get('loanMaturityDateAD').value;
        this.cadData.nepData = JSON.stringify(this.nepDataPersonal);
        this.cadData.nepDataPersonal = JSON.stringify(this.nepDataPersonal);
        this.NepProposedAmountFormEmitter.emit(this.cadData);
        return this.cadData;
    }
    closeModal() {
        this.dialogRef.close();
    }
}
