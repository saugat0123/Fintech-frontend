import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {FiscalYearService} from "../../../../admin/service/fiscal-year.service";
import {FiscalYear} from "../../../../admin/modal/FiscalYear";
import {OtherCompanyDetail} from "../../../../admin/modal/otherCompanyDetail";

@Component({
  selector: 'app-company-other-detail',
  templateUrl: './company-other-detail.component.html',
  styleUrls: ['./company-other-detail.component.scss']
})
export class CompanyOtherDetailComponent implements OnInit {
  @Input() companyOtherDetail;
  companyOtherDetailGroupForm: FormGroup;
  submitted = false;
  fiscalYears: Array<FiscalYear> = [];
  submitData: OtherCompanyDetail;

  constructor(private formBuilder: FormBuilder,
              private fiscalYearService: FiscalYearService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYears = response.detail;
    });
  }

  get form () {
    return this.companyOtherDetailGroupForm.controls;
  }

  buildForm() {
    this.companyOtherDetailGroupForm = this.formBuilder.group({
      taxClearanceTill: [undefined, Validators.required],
      taxClearanceRemark: [undefined],
      ClassificationByNRB: [undefined],
      negativeList: [undefined],
      negativeListRemark : [undefined],
    });
  }

  onSubmit() {
    this.submitData = this.companyOtherDetailGroupForm.value;
  }
}
