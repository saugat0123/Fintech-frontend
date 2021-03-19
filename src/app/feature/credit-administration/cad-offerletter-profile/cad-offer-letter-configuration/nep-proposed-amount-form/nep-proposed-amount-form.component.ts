import {Component, Input, OnInit} from '@angular/core';
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
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-nep-proposed-amount-form',
    templateUrl: './nep-proposed-amount-form.component.html',
    styleUrls: ['./nep-proposed-amount-form.component.scss']
})
export class NepProposedAmountFormComponent implements OnInit {
    @Input()
    cadData: CustomerApprovedLoanCadDocumentation;
    nepaliNumber = new NepaliNumberAndWords();
    nepForm: FormGroup;
    spinner = false;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private toastService: ToastService,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private service: CreditAdministrationService,
                private router: RouterUtilsService) {
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
        this.buildForm();
    }

    buildForm() {
        this.nepForm = this.formBuilder.group({
            nepaliNumber: [this.nepaliNumber.numberNepali],
            engNumber: [this.nepaliNumber.engNumber, Validators.required],
        });
    }

    onChangeValue(event) {
        console.log(event.target.value);
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
        this.cadData.nepData = JSON.stringify(this.nepaliNumber);
        console.log(this.cadData.nepData);
        this.service.saveCadDocumentBulk(this.cadData).subscribe((res: any) => {
            this.spinner = false;
            this.router.reloadCadProfileRoute(this.cadData.id);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Updated SUCCESSFULLY!!!'));
        }, error => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));

        });
    }


}
