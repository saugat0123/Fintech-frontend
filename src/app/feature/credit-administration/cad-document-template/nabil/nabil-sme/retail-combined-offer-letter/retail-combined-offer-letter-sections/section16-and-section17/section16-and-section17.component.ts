import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section16-and-section17',
  templateUrl: './section16-and-section17.component.html',
  styleUrls: ['./section16-and-section17.component.scss']
})
export class Section16AndSection17Component implements OnInit {
  @Input() cadData;
  form: FormGroup;
  saveDiv: any;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].supportedInformation)) {
          this.saveDiv = JSON.parse(this.cadData.offerDocumentList[0].supportedInformation);
        }
      }
    }
    this.fillForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      loanCommitmentCheck: [false],
      crossDefaultCheck: [false]
    });
  }

  fillForm() {
    this.form.patchValue({
      loanCommitmentCheck: !ObjectUtil.isEmpty(this.saveDiv.section16) ?
          !ObjectUtil.isEmpty(this.saveDiv.section16.loanCommitmentCheck) ?
              this.saveDiv.section16.loanCommitmentCheck : '' : '',
      crossDefaultCheck: !ObjectUtil.isEmpty(this.saveDiv.section16) ?
          !ObjectUtil.isEmpty(this.saveDiv.section16.crossDefaultCheck) ?
              this.saveDiv.section16.crossDefaultCheck : '' : '',
    });
  }

  showDefaultCheck(data) {
    console.log('Show Default Check?', data);
  }
  showCollateralCheck(data) {
    console.log('Show Collateral Check?', data);
  }
}
