import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sme-global-content',
  templateUrl: './sme-global-content.component.html',
  styleUrls: ['./sme-global-content.component.scss']
})
export class SmeGlobalContentComponent implements OnInit {
  globalForm: FormGroup;
  loanOptions = [
      {value: 'New Plain Renewal'},
      {value: 'Plain Renewal'},
      {value: 'Renewal with Enhancement or Additional Loan'},
      {value: 'Additional Loan'}
  ];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  mortgageType = [
    {value: 'New'},
    {value: 'Existing'},
    {value: 'Enhancement'}
  ];
  hypothecationType = [
    {value: 'New'},
    {value: 'Existing'}
  ];
  chargeType = [
    {value: 'For All Loan'},
    {value: 'For Specific Loan Only'},
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.globalForm = this.formBuilder.group({});
  }

}
