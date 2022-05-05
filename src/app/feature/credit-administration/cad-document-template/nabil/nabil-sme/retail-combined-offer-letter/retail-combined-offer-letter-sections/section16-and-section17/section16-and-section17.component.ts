import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section16-and-section17',
  templateUrl: './section16-and-section17.component.html',
  styleUrls: ['./section16-and-section17.component.scss']
})
export class Section16AndSection17Component implements OnInit {
  @Input() cadData;
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      loanCommitmentCheck: [undefined],
      crossDefaultCheck: [undefined]
    });
  }
  showDefaultCheck(data) {
    console.log('Show Default Check?', data);
  }
  showCollateralCheck(data) {
    console.log('Show Collateral Check?', data);
  }
}
