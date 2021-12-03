import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiBanking} from '../../loan/model/multiBanking';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-multi-banking',
  templateUrl: './multi-banking.component.html',
  styleUrls: ['./multi-banking.component.scss']
})
export class MultiBankingComponent implements OnInit {
  @Input() fromProfile: boolean;
  @Input() multiBankingData: MultiBanking;
  @Output() multiBankingDataEmitter = new EventEmitter();
  calendarType = 'AD';
  multiBankingForm: FormGroup;
  multiBanking: MultiBanking = new MultiBanking();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.multiBankingData)) {
        this.multiBanking = this.multiBankingData;
        const data = JSON.parse(this.multiBankingData.data);
        this.multiBankingForm.patchValue(data);
    } else {
        this.addMultiBanking();
        this.addConsortium();
    }
  }

  buildForm() {
    this.multiBankingForm = this.formBuilder.group({
      multiBanking: this.formBuilder.array([]),
      consortium: this.formBuilder.array([]),
    });
  }

  submitForm() {
    this.multiBanking.data = JSON.stringify(this.multiBankingForm.value);
    this.multiBankingDataEmitter.emit(this.multiBanking);
  }

  addMultiBanking() {
    (this.multiBankingForm.get('multiBanking') as FormArray).push(
        this.formBuilder.group({
          bankName: [undefined],
          date: [undefined],
          fundedLimited: [undefined],
          nonFundedLimited: [undefined],
          totalLimit: [undefined],
          fundedOS: [undefined],
          nonFundedOS: [undefined],
          totalOS: [undefined],
          remarks: [undefined],
        })
    );
  }

  addConsortium() {
    (this.multiBankingForm.get('consortium') as FormArray).push(
        this.formBuilder.group({
          conBankName: [undefined],
          conDate: [undefined],
          conFundedLimited: [undefined],
          conNonFundedLimited: [undefined],
          conTotalLimit: [undefined],
          conFundedOS: [undefined],
          conNonFundedOS: [undefined],
          conTotalOS: [undefined],
          conRemarks: [undefined],
        })
    );
  }

  removeMultiBanking(i) {
    (<FormArray>this.multiBankingForm.get('multiBanking')).removeAt(i);
  }

  removeConsortium(i) {
    (<FormArray>this.multiBankingForm.get('consortium')).removeAt(i);
  }
}
