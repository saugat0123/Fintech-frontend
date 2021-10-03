import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HomeLoanType} from '../../cad-constant/home-loan-type';

@Component({
  selector: 'app-home-loan-template-data',
  templateUrl: './home-loan-template-data.component.html',
  styleUrls: ['./home-loan-template-data.component.scss']
})
export class HomeLoanTemplateDataComponent implements OnInit {

  homeLoanForm: FormGroup;
  homeLoanType: Array<String> = new Array<String>();
  isConstructionLoan = false;
  isPurchaseLoan = false;
  isTakeOverLoan = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.getHomeLoanType();
  }

  private getHomeLoanType(): void {
    HomeLoanType.enumObject().forEach(element => {
      this.homeLoanType.push(element);
    });
  }

  private buildForm(): FormGroup {
    return this.homeLoanForm = this.formBuilder.group({
      homeLoanType: [undefined],
    });
  }

  public typeOfHomeLoan(value): void {
    this.isConstructionLoan = value === HomeLoanType.CONSTRUCTION.valueOf();
  }

}
