import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MicroBorrowerFinancial} from '../../../loan/model/micro-borrower-financial';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {FiscalYearModalComponent} from '../../../loan-information-template/financial/fiscal-year-modal/fiscal-year-modal.component';
import {ModalResponse} from '../../../../@core/utils';
import {FinancialDeleteComponentComponent} from '../../../loan-information-template/financial/financial-delete-component/financial-delete-component.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-borrower-financial',
  templateUrl: './borrower-financial.component.html',
  styleUrls: ['./borrower-financial.component.scss']
})
export class BorrowerFinancialComponent implements OnInit {
  @Input() fromProfile;
  @Input() microBorrowerFinancial: MicroBorrowerFinancial;
  @Output() dataEmitter = new EventEmitter();

  microFinancialForm: FormGroup;
  fiscalYear = [];
  auditorList = [];
  currentFormData;

  constructor(protected formBuilder: FormBuilder,
              protected modalService: NgbModal) {
  }

  ngOnInit() {
    this.microFinancialForm = this.formBuilder.group({
      borrowingAndDepositToCoreCapital: this.formBuilder.array([]),
      costOfFund: this.formBuilder.array([]),
      yieldOnPortfolio: this.formBuilder.array([]),
      capitalAdequacyRatio: this.formBuilder.array([]),
      NPARate: this.formBuilder.array([]),
      debtEquityRatio: this.formBuilder.array([]),
      returnOnAsset: this.formBuilder.array([]),
      iscr: this.formBuilder.array([]),
      dscr: this.formBuilder.array([])
    });

    if (!ObjectUtil.isEmpty(this.microBorrowerFinancial)) {
      this.currentFormData = JSON.parse(this.microBorrowerFinancial.data);
      this.fiscalYear = this.currentFormData['fiscalYear'];
      this.auditorList = this.currentFormData['auditorList'];

      for (const [key, value] of Object.entries(this.currentFormData)) {
        if (key !== 'fiscalYear' && key !== 'auditorList') {
          this.setExistingData(value, key);
        }
      }
    }
  }

  addFiscalYear(year, auditorDetails) {

    this.fiscalYear.push(year);
    if (!ObjectUtil.isEmpty(auditorDetails)) {
      this.auditorList.push(auditorDetails);
    }
    for (const [key, value] of Object.entries(this.microFinancialForm.value)) {
      (this.microFinancialForm.controls[`${key}`] as FormArray).push(this.formBuilder.group({
        year: [year],
        value: [0]
      }));
    }
  }

  removingFiscalYear(fiscalYear, index) {
    this.modalService.open(FinancialDeleteComponentComponent).result.then(message => {
      if (message === ModalResponse.SUCCESS) {
        const removeParamsObject = {fiscalYear: fiscalYear, index: index};
        this.fiscalYear.splice(index, 1);
        this.auditorList = this.auditorList.filter(value => !(removeParamsObject.fiscalYear as string).match(value.audited));
        for (const [key, value] of Object.entries(this.microFinancialForm.value)) {
          (this.microFinancialForm.get(key) as FormArray).removeAt(index);
        }
      }
    });
  }

  setExistingData(currentData, header) {
    const controls = this.microFinancialForm.get(header) as FormArray;
    currentData.forEach(singleData => {
      controls.push(
          this.formBuilder.group({
            year: [singleData.year],
            value: [singleData.value]
          })
      );
    });
  }

  openFiscalYearModal() {
    const fiscalYearModalRef = this.modalService.open(FiscalYearModalComponent, {backdrop: 'static', size: 'lg'});
    fiscalYearModalRef.result.then( closeParams => {
      this.addFiscalYear(closeParams.fiscalYearValue, closeParams.auditorDetails);
    }, dismiss => {
      console.log(dismiss);
    });
  }

  onSubmit() {
    const currentFormData = {
      fiscalYear: this.fiscalYear,
      auditorList: this.auditorList,
      ...this.microFinancialForm.value
    };
    const financialData = new MicroBorrowerFinancial();
    financialData.data = JSON.stringify(currentFormData);
    this.dataEmitter.emit(financialData);
  }
}
