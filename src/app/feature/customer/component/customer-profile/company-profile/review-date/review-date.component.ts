import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../../@core/utils';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CompanyInfoService} from '../../../../../admin/service/company-info.service';


@Component({
  selector: 'app-review-date',
  templateUrl: './review-date.component.html',
  styleUrls: ['./review-date.component.scss']
})
export class ReviewDateComponent implements OnInit {
  @Input() formValue;
  @Input() companyInfo;
  form: FormGroup;
  submitted = false;
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private toastService: ToastService,
      private companyInfoService: CompanyInfoService,
  ) { }

  get formControls() {
    return this.form.controls;
  }
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.form.patchValue(this.companyInfo);
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      lastReviewDate: [undefined],
      currentExtendedDate: [undefined],
      scheduledReviewDate: [undefined],
      nextReviewDate: [undefined]
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.spinner = true;
    const existingDetails = JSON.parse(this.formValue.companyJsonData);
    existingDetails['reviewDate'] = this.form.value;
    this.formValue.companyJsonData = JSON.stringify(existingDetails);
    this.companyInfoService.save(this.formValue).subscribe((res) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Review Date'));
      this.spinner = false;
    }, error => {
        console.log(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Error while saving: ' + error));
        this.spinner = false;
    });
  }
}
