import {Component, Input, OnInit} from '@angular/core';
import {Guarantor} from '../../../model/guarantor';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-guarantor-adder',
  templateUrl: './guarantor-adder.component.html',
  styleUrls: ['./guarantor-adder.component.scss']
})
export class GuarantorAdderComponent implements OnInit {

  @Input() guarantorData;
  guarantorList: Array<Guarantor> = [];
  guarantorForm: FormGroup;
  selectedGuarantorList: Array<Guarantor> = [];

  guarantor = new FormControl(undefined , Validators.required);

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.guarantorData)){
    this.guarantorList = this.guarantorData.guarantorList;
    }
  }

  addGuarantorDetail(data) {
    const presentGuarantor = this.selectedGuarantorList.filter(d => d.id === data.id);
    if (presentGuarantor.length <= 0) {
      this.selectedGuarantorList.push(data);
    }
  }

  removeGuarantor(data) {
    const removeIndex = this.findGuarantorIndex(data);
    this.selectedGuarantorList.splice(removeIndex, 1);
  }

  findGuarantorIndex(data) {
    return this.selectedGuarantorList.indexOf(this.selectedGuarantorList.
    filter(d => d.id.toString() === data.id.toString())[0]);
  }

  onSubmit(){

  }
}
