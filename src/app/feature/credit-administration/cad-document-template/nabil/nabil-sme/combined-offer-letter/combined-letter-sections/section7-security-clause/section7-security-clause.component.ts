import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-section7-security-clause',
  templateUrl: './section7-security-clause.component.html',
  styleUrls: ['./section7-security-clause.component.scss']
})
export class Section7SecurityClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  loanHolderInfo;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.fillForm();
    }
  }

  buildForm() {
    this.form = this.formbuilder.group({
      nameOfBranch: [undefined],
    })
  }

  fillForm() {
    this.form.patchValue({
      nameOfBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
    })
  }

}
