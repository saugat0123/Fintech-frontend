import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanType} from '../../../../loan/model/loanType';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../../@core/utils';
import {CadOneformService} from '../../../service/cad-oneform.service';
import { Attributes } from '../../../../../@core/model/attributes';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NbDialogRef, NbDialogService} from "@nebular/theme";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { CadOfferLetterConfigurationComponent } from '../cad-offer-letter-configuration.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
  selector: 'app-loan-create',
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent implements OnInit {
  // @Input() form;
  @Input() data;
  @Input() customerType;
  @Output() cadApprovedData = new EventEmitter();
  submitted = false;
  translatedValues: any;
  form: FormGroup;
  spinner = false;
  loanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
  filteredLoanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
  loanTypeList = LoanType;
  attributes: Attributes = new Attributes();
  translatedLoanDataDetails = [];
  isTranslatedLoanDetails = false;
  isCombinedLoan = false;
  offerLetterConst = NabilOfferLetterConst;

  constructor(
      private formBuilder: FormBuilder,
      private translateService: SbTranslateService,
      private loanConfigService: LoanConfigService,
      private toastService: ToastService,
      private cadOneFormService: CadOneformService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private dialogService: NbDialogService,
      private modalService: NgbModal,
      protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.loadData();
  }

  loadData() {
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((response: any) => {
      console.log(response);
      this.loanFacilityList = response.detail;
      if (!ObjectUtil.isEmpty(this.loanFacilityList)) {
        this.filteredLoanFacilityList = this.loanFacilityList.filter((val) =>
            val.offerLetterConst !== 'COMBINED_LETTER');
      }
      console.log(response.detail);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanDetails: this.formBuilder.array([]),
      isCombinedLoan: this.isCombinedLoan
    });
    this.addEmptyLoan();
  }

  setLoan(data) {
    if (data.length === 0) {
      this.addEmptyLoan();
      return;
    }
    data.forEach(d => {
      (this.form.get('loanDetails') as FormArray).push(
          this.formBuilder.group({
            loan: [d.loan, Validators.required],
            proposedAmount: [d.proposedAmount, Validators.required],
            comments: [d.comments],
          })
      );
    });
  }

  addEmptyLoan() {
    (this.form.get('loanDetails') as FormArray).push(
        this.formBuilder.group({
          loanHolderId: [this.data.customerInfoId ? this.data.customerInfoId : this.data.id, Validators.required],
          loan: [this.data.customerInfoId ? this.data.customerInfoId : this.data.id, Validators.required],
          loanCT: [undefined],
          loanTrans: [undefined],
          proposedAmount: [undefined, Validators.required],
          proposedAmountCT: [undefined],
          proposedAmountTrans: [undefined],
          comments: [undefined],
          commentsCT: [undefined],
          commentsTrans: [undefined],
        })
    );
  }

  removeLoan(i) {
    (this.form.get('loanDetails') as FormArray).removeAt(i);
    this.translatedLoanDataDetails.splice(i, 1);
  }

  async translate(index) {
    const allLoans = this.form.get('loanDetails').value as FormArray;
    if (allLoans.length > 0) {
      this.spinner = true;
      let loanDetails: any = [];
      loanDetails = await this.translateService.translateForm(this.form, 'loanDetails', index);
      this.form.get(['loanDetails', index, 'loanTrans']).setValue(loanDetails.loan || '');
      this.form.get(['loanDetails', index, 'proposedAmountTrans']).setValue(loanDetails.proposedAmount || '');

      const formArrayDataArrays: FormArray = this.form.get(`loanDetails`) as FormArray;
      let a: any;
      a = formArrayDataArrays.controls;
      const newArr = {};
      const individualData = a[index] as FormGroup;
      Object.keys(individualData.controls).forEach(key => {
        console.log('key: ', key);
        if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value) {
          return;
        }
        if (key === 'loan' || key === 'proposedAmount') {
          this.attributes = new Attributes();
          this.attributes.en = individualData.get(key).value;
          this.attributes.np = loanDetails[key];
          this.attributes.ct = individualData.get(key + 'CT').value;
          newArr[key] = this.attributes;
        }
      });
      this.translatedLoanDataDetails[index] = newArr;
      // end loanDetails
      this.isTranslatedLoanDetails = true;
      this.spinner = false;
    }
  }

  deleteCTAndTransContorls(index) {
    const formArrayDataArrays: FormArray = this.form.get(`loanDetails`) as FormArray;
      let a: any;
      a = formArrayDataArrays.controls;
      const individualData = a[index] as FormGroup;
      Object.keys(individualData.controls).forEach(key => {
        if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1) {
          individualData.removeControl(key);
        }
      });
  }
  save() {
    this.spinner = true;
    this.form.get('isCombinedLoan').patchValue(this.isCombinedLoan);
    this.cadOneFormService.saveLoan(this.form.value).subscribe(res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan created successfully'));
      this.spinner = false;
      this.cadApprovedData.emit(res.detail);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error while creating loan'));
      this.spinner = false;
    });
  }

  public patchValue(index) {
    const proposedAmount = this.engToNepaliNumberPipe.transform(
        this.currencyFormatterPipe.transform(this.form.get(['loanDetails', index, 'proposedAmount']).value));
    this.form.get(['loanDetails', index, 'proposedAmountTrans']).patchValue(proposedAmount);
    this.form.get(['loanDetails', index, 'proposedAmountCT']).patchValue(proposedAmount);
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }

  dismiss(template) {
    this.modalService.dismissAll();
  }

  decline(template) {
    this.modalService.dismissAll();
  }

  accept() {
    this.modalService.dismissAll();
    this.dialogRef.close();
  }

  combinedLoan(event) {
    this.isCombinedLoan = event.target.checked === true;
    if (this.isCombinedLoan) {
      if (!ObjectUtil.isEmpty(this.filteredLoanFacilityList)) {
        this.filteredLoanFacilityList = this.loanFacilityList.filter((val) =>
            val.offerLetterConst === 'COMBINED_LETTER');
      }
    } else {
      this.filteredLoanFacilityList = this.loanFacilityList.filter((val) =>
          val.offerLetterConst !== 'COMBINED_LETTER');
    }
  }
}
