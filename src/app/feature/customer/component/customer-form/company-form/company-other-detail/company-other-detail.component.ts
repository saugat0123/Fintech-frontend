import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {FiscalYearService} from '../../../../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';
import {OtherCompanyDetail} from '../../../../../admin/modal/otherCompanyDetail';

@Component({
  selector: 'app-company-other-detail',
  templateUrl: './company-other-detail.component.html',
  styleUrls: ['./company-other-detail.component.scss']
})
export class CompanyOtherDetailComponent implements OnInit , OnChanges {
  @Input() companyOtherDetail;
  companyOtherDetailGroupForm: FormGroup;
  submitted = false;
  fiscalYears: Array<FiscalYear> = [];
  submitData: OtherCompanyDetail;

  constructor(private formBuilder: FormBuilder,
              private fiscalYearService: FiscalYearService) {
  }

  get form() {
    return this.companyOtherDetailGroupForm.controls;
  }

  ngOnInit() {
    console.log(this.companyOtherDetail, 'g');
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYears = response.detail;
    });
    this.buildForm();
    this.setData();
  }

  setData() {
    console.log(this.companyOtherDetail);
    if (!ObjectUtil.isEmpty(this.companyOtherDetail)) {
      this.companyOtherDetailGroupForm.patchValue(JSON.parse(this.companyOtherDetail));
    }
  }

  buildForm() {
    this.companyOtherDetailGroupForm = this.formBuilder.group({
      taxClearanceTill: [undefined, Validators.required],
      taxClearanceRemark: [undefined],
      ClassificationByNRB: [undefined, Validators.required],
      negativeList: [undefined, Validators.required],
      negativeListRemark: [undefined],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.submitData = this.companyOtherDetailGroupForm.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(changes.companyOtherDetail.currentValue)) {
      this.companyOtherDetailGroupForm.patchValue(changes.companyOtherDetail.currentValue);
    }
  }
}
