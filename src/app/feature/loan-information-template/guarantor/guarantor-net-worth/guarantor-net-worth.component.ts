import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-guarantor-net-worth',
  templateUrl: './guarantor-net-worth.component.html',
  styleUrls: ['./guarantor-net-worth.component.scss']
})
export class GuarantorNetWorthComponent implements OnInit {
  @Input() netWorthData: any;
  @Input() index: number;
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('netWorthData', this.netWorthData);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.netWorthData)) {
      const gData = JSON.parse(this.netWorthData);
      this.setGuarantorNetWorth(gData.guarantorNetWorth);
    } else {
      this.addForm();
    }
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      guarantorNetWorth: this.formBuilder.array([])
    });
  }

  calculateTotalAssets(i: any) {
    const total = Number(this.formGroup.get(['guarantorNetWorth', i, 'cashDepositInOtherBank']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'realEstateProperties']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'investmentInShares']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'vehicle']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'jewelleries']).value);
    this.formGroup.get(['guarantorNetWorth', i, 'totalAssets']).patchValue(total);
    this.calculateNetWorth(i);
  }

  calculateTotalLiabilities(i: any) {
    const total = Number(this.formGroup.get(['guarantorNetWorth', i, 'loanFromCCBL']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'creditCardsLimit']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'otherLiabilities']).value) +
        Number(this.formGroup.get(['guarantorNetWorth', i, 'loanFromOtherBfi']).value);
    this.formGroup.get(['guarantorNetWorth', i, 'totalLiabilities']).patchValue(total);
    this.calculateNetWorth(i);
  }

  calculateNetWorth(i: any) {
    if (!ObjectUtil.isEmpty(this.formGroup.get(['guarantorNetWorth', i, 'totalLiabilities']))) {
      const totalNetWorth = (Number(this.formGroup.get(['guarantorNetWorth', i, 'totalAssets']).value)
          - Number(this.formGroup.get(['guarantorNetWorth', i, 'totalLiabilities']).value));
      this.formGroup.get(['guarantorNetWorth', i, 'totalNetWorth']).patchValue(totalNetWorth);
    }
  }

  addForm() {
    const form = this.formGroup.get('guarantorNetWorth') as FormArray;
    form.push(this.formBuilder.group({
      cashDepositInOtherBank: undefined,
      realEstateProperties: undefined,
      investmentInShares: undefined,
      vehicle: undefined,
      jewelleries: undefined,
      totalAssets: undefined,
      loanFromCCBL: undefined,
      creditCardsLimit: undefined,
      otherLiabilities: undefined,
      totalLiabilities: undefined,
      totalNetWorth: undefined,
      loanFromOtherBfi: undefined,
    }));
  }

  setGuarantorNetWorth(data) {
    const control = this.formGroup.get('guarantorNetWorth') as FormArray;
    if (!ObjectUtil.isEmpty(data)) {
      data.forEach(d => {
        control.push(
            this.formBuilder.group({
              cashDepositInOtherBank: [d.cashDepositInOtherBank],
              realEstateProperties: d.realEstateProperties,
              investmentInShares: d.investmentInShares,
              vehicle: d.vehicle,
              jewelleries: d.jewelleries,
              totalAssets: d.totalAssets,
              loanFromCCBL: d.loanFromCCBL,
              creditCardsLimit: d.creditCardsLimit,
              otherLiabilities: d.otherLiabilities,
              totalLiabilities: d.totalLiabilities,
              totalNetWorth: d.totalNetWorth,
              loanFromOtherBfi: d.loanFromOtherBfi,
            })
        );
      });
    }
  }

}
