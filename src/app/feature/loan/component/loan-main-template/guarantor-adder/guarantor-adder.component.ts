import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guarantor} from '../../../model/guarantor';
import {FormControl, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {GuarantorDetailComponent} from './guarantor-detail/guarantor-detail.component';
import {NbDialogService} from '@nebular/theme';

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
  toggle = [{toggled: false}];

  guarantor = new FormControl(undefined , Validators.required);

  constructor(private nbDialogService: NbDialogService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.guarantorData)) {
    this.guarantorList = this.guarantorData.guarantorList;
    } if (!ObjectUtil.isEmpty(this.taggedGuarantors)) {
    this.selectedGuarantorList = this.taggedGuarantors;
    }
    this.tagInitialGuarantors();
  }

  addGuarantorDetail(data) {
    const presentGuarantor = this.selectedGuarantorList.filter(d => d.id === data.id);
    if (presentGuarantor.length <= 0) {
      this.selectedGuarantorList.push(data);
      this.msg = '';
    } else {
      this.msg = 'selected guarantor is already added !';
    }
    this.emitter.emit(this.selectedGuarantorList);
  }

  removeGuarantor(data) {
    const removeIndex = this.findGuarantorIndex(data);
    this.selectedGuarantorList.splice(removeIndex, 1);
    this.emitter.emit(this.selectedGuarantorList);
  }

  findGuarantorIndex(data) {
    return this.selectedGuarantorList.indexOf(this.selectedGuarantorList.
    filter(d => d.id.toString() === data.id.toString())[0]);
  }

  openGuarantorDetailModal(guarantorData) {
    this.nbDialogService.open(GuarantorDetailComponent ,  {context: {guarantorData}});
  }

  tagInitialGuarantors(): void
  {
   this.guarantorList.forEach(g =>{
     this.selectedGuarantorList.push(g);
     this.toggle.push({toggled: false});
   })
  }
}
