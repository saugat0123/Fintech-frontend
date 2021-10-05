import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-nrb-kyc',
  templateUrl: './nrb-kyc.component.html',
  styleUrls: ['./nrb-kyc.component.scss']
})
export class NrbKycComponent implements OnInit {
  constructor(
      private formBuilder: FormBuilder
  ) { }
  @Input() cadData;
  @Input() customerLoanId;
  @Input() documentId;
  initialInfoPrint;
spinner = false;
  form: FormGroup;
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.form = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({});
  }
submit() {
}
changes(event) {
  console.log('this is data', event);
}
}
