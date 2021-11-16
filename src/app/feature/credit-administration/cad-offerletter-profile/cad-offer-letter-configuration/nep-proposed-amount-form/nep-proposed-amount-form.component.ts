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
import {NepDataPersonal} from '../../../model/nepDataPersonal';
import {CustomerType} from '../../../../customer/model/customerType';
import {Branch} from '../../../../admin/modal/branch';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';

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
        if (ObjectUtil.isEmpty(this.cadData.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData.nepDataPersonal)) {
            this.nepDataPersonal = JSON.parse(this.cadData.nepDataPersonal);
        }
        this.branch = this.customerInfo.branch;
        this.buildForm();
    }

    buildForm() {
        this.nepForm = this.formBuilder.group({
            nepaliNumber: [this.nepaliNumber.numberNepali],
            engNumber: [this.nepaliNumber.engNumber, Validators.required],
            initDate: [this.nepaliNumber.initDate, Validators.required],
            loanType: [this.nepDataPersonal.loanType, Validators.required],
            interestRate: [this.nepDataPersonal.interestRate, Validators.required],
            serviceFeePercent: [this.nepDataPersonal.serviceFeePercent, Validators.required],
            serviceFeeAmount: [this.nepDataPersonal.serviceFeeAmount, Validators.required],
            tenureOfLoanInMonths: [this.nepDataPersonal.tenureOfLoanInMonths, Validators.required],
            tenureOfLoanInYears: [this.nepDataPersonal.tenureOfLoanInYears, Validators.required],
            installmentAmount: [this.nepDataPersonal.installmentAmount, Validators.required],
            typeOfLoanInEnglish: [this.nepDataPersonal.typeOfLoanInEnglish, Validators.required],
            purposeOfLoan: [this.nepDataPersonal.purposeOfLoan, Validators.required],
            loanApprovalNo: [this.nepaliNumber.loanApprovalNo, Validators.required],
            baseRate: [this.nepDataPersonal.baseRate, Validators.required],
            premium: [this.nepDataPersonal.premium, Validators.required],
            discount: [this.nepDataPersonal.discount, Validators.required],
            cibCharges: [this.nepDataPersonal.cibCharges, Validators.required],
            interestInstallmentPaymentFrequency: [this.nepDataPersonal.interestInstallmentPaymentFrequency, Validators.required],
            loanMaturityDateBS: [this.nepDataPersonal.loanMaturityDateBS, Validators.required],
            loanMaturityDateAD: [this.nepDataPersonal.loanMaturityDateAD, Validators.required],
        });
    }

    checkIsIndividual() {
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerInfo.customerType]) {
            return true;
        }
        return false;
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
        this.nepaliNumber.loanApprovalNo = this.nepForm.get('loanApprovalNo').value;
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
        this.cadData.nepData = JSON.stringify(this.nepaliNumber);
        this.cadData.nepDataPersonal = JSON.stringify(this.nepDataPersonal);
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
