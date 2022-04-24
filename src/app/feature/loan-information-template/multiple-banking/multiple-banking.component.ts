import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultipleBanking} from '../../admin/modal/multipleBanking';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-multiple-banking',
  templateUrl: './multiple-banking.component.html',
  styleUrls: ['./multiple-banking.component.scss']
})
export class MultipleBankingComponent implements OnInit {

  @Input() fromProfile: boolean;
  @Input() multiBankingData: MultipleBanking;
  @Output() multiBankingDataEmitter = new EventEmitter();
  calendarType = 'AD';
  multiBankingForm: FormGroup;
  multiBanking: MultipleBanking = new MultipleBanking();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.multiBankingData)) {
      console.log('I have data');
    } else {
      this.addMultipleBanking();
    }
  }

  buildForm() {
    this.multiBankingForm = this.formBuilder.group({
      multiBanking: this.formBuilder.array([]),
      isMultiBanking: [true],
      isConsortium: [true],
      consortium: this.formBuilder.group([]),
      totalLimit: [undefined],
      totalOutstanding: [undefined],
    });
  }

  addMultipleBanking() {
    (this.multiBankingForm.get('multiBanking') as FormArray).push(
        this.formBuilder.group({
          bankName: [undefined],
          facilityName: [undefined],
          limit: [undefined],
          outstanding: [undefined],
          overDue: [undefined],
        })
    );
  }

  removeData(i: number, arrayName: string) {
    (this.multiBankingForm.get(arrayName) as FormArray).removeAt(i);
  }

  submitForm() {
    this.multiBanking.data = JSON.stringify(this.multiBankingForm.value);
    this.multiBankingDataEmitter.emit(this.multiBanking);
  }
}
