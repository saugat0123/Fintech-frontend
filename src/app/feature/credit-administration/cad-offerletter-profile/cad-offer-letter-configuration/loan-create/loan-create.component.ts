import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanType} from '../../../../loan/model/loanType';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../../@core/utils';
import {CadOneformService} from '../../../service/cad-oneform.service';
import { Attributes } from '../../../../../@core/model/attributes';

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
  loanTypeList = LoanType;
  attributes: Attributes = new Attributes();
  translatedLoanDataDetails = [];

  constructor(
      private formBuilder: FormBuilder,
      private translateService: SbTranslateService,
      private loanConfigService: LoanConfigService,
      private toastService: ToastService,
      private cadOneFormService: CadOneformService,
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
      console.log(response.detail);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanDetails: this.formBuilder.array([])
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
            loan: [d.loan],
            proposedAmount: [d.proposedAmount],
            status: [d.status],
            approvedOn: [d.approvedOn],
            comments: [d.comments],
          })
      );
    });
  }

  addEmptyLoan() {
    (this.form.get('loanDetails') as FormArray).push(
        this.formBuilder.group({
          loanHolderId: this.translatedLoanDataDetails,
          loanHolderCT: this.translatedLoanDataDetails,
          loanHolderTrans: this.translatedLoanDataDetails,
          loanType: [undefined],
          loanTypeCT: [undefined],
          loanTypeTrans: [undefined],
          loan: [undefined],
          loanCT: [undefined],
          loanTrans: [undefined],
          proposedAmount: [undefined],
          proposedAmountCT: [undefined],
          proposedAmountTrans: [undefined],
          status: [undefined],
          statusCT: [undefined],
          statusTrans: [undefined],
          approvedOn: [undefined],
          approvedOnCT: [undefined],
          approvedOnTrans: [undefined],
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
    console.log('index: ', index);
    console.log('this.form: ', this.form);
    let allLoans = this.form.get('loanDetails').value as FormArray;
    console.log('allLoans: ', allLoans);
    if (allLoans.length > 0) {
      this.spinner = true;
      let loanDetails: any = [];
      loanDetails = await this.translateService.translateForm(this.form, 'loanDetails', index);
      console.log('translateLoanForm: ', loanDetails);
      this.form.get(['loanDetails', index, 'loanTrans']).setValue(loanDetails.loan || '');
      this.form.get(['loanDetails', index, 'proposedAmountTrans']).setValue(loanDetails.proposedAmount || '');

      let formArrayDataArrays: FormArray = this.form.get(`loanDetails`) as FormArray;
      let a: any;
      a = formArrayDataArrays.controls;
      let newArr = {};
      let individualData = a[index] as FormGroup;
      console.log('individualData: ', individualData);
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
      console.log('this.translatedLoanDataDetails: ', this.translatedLoanDataDetails);
      this.spinner = false;
    }
  }

  save() {
    this.spinner = true;
    let loanDetailsToSave = [];
    this.translatedLoanDataDetails.forEach((val, index) => {
      loanDetailsToSave.push({...this.data,
        ...this.form.get('loanDetails').value[index],
        nepData: this.translatedLoanDataDetails[index]
      })
    });
    console.log('loanDetailsToSave: ', loanDetailsToSave);
    this.cadOneFormService.saveLoan(loanDetailsToSave).subscribe(res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan created successfully'));
      this.spinner = false;
      this.cadApprovedData.emit(res.detail);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Error while creating loan'));
      this.spinner = false;
    });
  }
}
