import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guarantor} from '../../../model/guarantor';
import {FormControl, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-guarantor-adder',
  templateUrl: './guarantor-adder.component.html',
  styleUrls: ['./guarantor-adder.component.scss']
})
export class GuarantorAdderComponent implements OnInit {

  @Input() guarantorData;
  @Input() taggedGuarantors;
  @Output() emitter = new EventEmitter();
  guarantorList: Array<Guarantor> = [];
  selectedGuarantorList: Array<Guarantor> = [];
  msg = '';
  toggle: { hide: boolean } [] = [];

  guarantor = new FormControl(undefined , Validators.required);

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.guarantorData)) {
      this.toggle.push({hide: false});
    this.guarantorList = this.guarantorData.guarantorList;
    } if (!ObjectUtil.isEmpty(this.taggedGuarantors)) {
      this.toggle.push({hide: false});
    this.selectedGuarantorList = this.taggedGuarantors;
    }
  }

  addGuarantorDetail(data) {
    const presentGuarantor = this.selectedGuarantorList.filter(d => d.id === data.id);
    if (presentGuarantor.length <= 0) {
      this.selectedGuarantorList.push(data);
      this.toggle.push({hide: false});
      this.msg = '';
    } else {
      this.msg = 'selected guarantor is already added !';
    }
    this.emitter.emit(this.selectedGuarantorList);
  }

  removeGuarantor(data) {
    const removeIndex = this.findGuarantorIndex(data);
    this.selectedGuarantorList.splice(removeIndex, 1);
    this.toggle.splice(removeIndex, 1);
    this.emitter.emit(this.selectedGuarantorList);
  }

  findGuarantorIndex(data) {
    return this.selectedGuarantorList.indexOf(this.selectedGuarantorList.
    filter(d => d.id.toString() === data.id.toString())[0]);
  }
}
