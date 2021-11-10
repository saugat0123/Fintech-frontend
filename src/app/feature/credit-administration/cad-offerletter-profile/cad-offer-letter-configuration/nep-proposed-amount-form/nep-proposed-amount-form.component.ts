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
            branchName: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.branch) ? undefined : this.branch.nepaliName : undefined, Validators.required],
            branchDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.branch) && ObjectUtil.isEmpty(this.branch.district) ? undefined : this.branch.district.nepaliName : undefined, Validators.required],
            branchMunVdc: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.branch) && ObjectUtil.isEmpty(this.branch.municipalityVdc) ? undefined : this.branch.municipalityVdc.nepaliName : undefined, Validators.required],
            branchWardNo: [this.nepDataPersonal.branchWardNo, Validators.required],
            loanType: [this.nepDataPersonal.loanType, Validators.required],
            interestRate: [this.nepDataPersonal.interestRate, Validators.required],
            serviceFee: [this.nepDataPersonal.serviceFee, Validators.required],
            tenureOfLoanInMonths: [this.nepDataPersonal.tenureOfLoanInMonths, Validators.required],
            tenureOfLoanInYears: [this.nepDataPersonal.tenureOfLoanInYears, Validators.required],
            installmentAmount: [this.nepDataPersonal.installmentAmount, Validators.required]
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
        this.nepDataPersonal.branchName = this.nepForm.get('branchName').value;
        this.nepDataPersonal.branchDistrict = this.nepForm.get('branchDistrict').value;
        this.nepDataPersonal.branchMunVdc = this.nepForm.get('branchMunVdc').value;
        this.nepDataPersonal.branchWardNo = this.nepForm.get('branchWardNo').value;
        this.nepDataPersonal.loanType = this.nepForm.get('loanType').value;
        this.nepDataPersonal.interestRate = this.nepForm.get('interestRate').value;
        this.nepDataPersonal.serviceFee = this.nepForm.get('serviceFee').value;
        this.nepDataPersonal.tenureOfLoanInMonths = this.nepForm.get('tenureOfLoanInMonths').value;
        this.nepDataPersonal.tenureOfLoanInYears = this.nepForm.get('tenureOfLoanInYears').value;
        this.nepDataPersonal.installmentAmount = this.nepForm.get('installmentAmount').value;
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
