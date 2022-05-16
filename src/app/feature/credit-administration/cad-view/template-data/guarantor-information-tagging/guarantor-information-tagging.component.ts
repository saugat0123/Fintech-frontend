import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CadOneformService} from '../../../service/cad-oneform.service';
import {ToastService} from '../../../../../@core/utils';

@Component({
  selector: 'app-guarantor-information-tagging',
  templateUrl: './guarantor-information-tagging.component.html',
  styleUrls: ['./guarantor-information-tagging.component.scss']
})
export class GuarantorInformationTaggingComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  guarantorTaggingForm: FormGroup;
  guarantorsList: Array <any> = new Array<any>();
  taggedList: Array <any> = new Array <any>();
  flagValue = false;
  buttonFlag = false;
  spinner = false;
  constructor(private formBuilder: FormBuilder,
              private oneFormService: CadOneformService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.loanHolder)) {
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder.guarantors)) {
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.guarantors.guarantorList) &&
        !ObjectUtil.isEmpty(this.cadData.loanHolder.guarantors.guarantorList[0].name)) {
          this.guarantorsList = this.cadData.loanHolder.guarantors.guarantorList;
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
        if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0].taggedGuarantors)) {
          this.taggedList = this.cadData.assignedLoan[0].taggedGuarantors;
        }
      }
    }
  }

  buildForm() {
    this.guarantorTaggingForm = this.formBuilder.group({
      guarantorTag: [undefined],
    });
  }

  addGuarantor() {
    const Id = this.guarantorTaggingForm.get('guarantorTag').value;
    let tempGuarantor;
    if (!ObjectUtil.isEmpty(this.guarantorsList)) {
      tempGuarantor = this.guarantorsList.filter((va) => va.id === Id);
    }
    if (this.taggedList.some(valueId => valueId.id === Id)) {
      this.flagValue = true;
    }
    if (!this.taggedList.some(valueId => valueId.id === Id)) {
      if (!ObjectUtil.isEmpty(tempGuarantor) && !ObjectUtil.isEmpty(tempGuarantor[0])) {
        this.taggedList.push(tempGuarantor[0]);
      }
    }
  }
  setGuarantorId(eve) {
    if (!ObjectUtil.isEmpty(eve)) {
      this.buttonFlag = true;
      this.flagValue = false;
    }
  }
  removeAtIndex(i) {
    const Id = this.guarantorTaggingForm.get('guarantorTag').value;
    if (!ObjectUtil.isEmpty(this.taggedList)) {
      this.taggedList.splice(i, 1);
    }
    if (this.taggedList.some(valueId => valueId.id === Id)) {
      this.flagValue = true;
    } else {
      this.flagValue = false;
    }
  }
  getAddress(guarantor) {
    let tempAddress;
    if (!ObjectUtil.isEmpty(guarantor)) {
    tempAddress = (!ObjectUtil.isEmpty(guarantor.municipalities) &&
        !ObjectUtil.isEmpty(guarantor.municipalities.name) ? guarantor.municipalities.name : '') +
        (!ObjectUtil.isEmpty(guarantor.wardNumber) &&
        !ObjectUtil.isEmpty(guarantor.municipalities) ? ' - ' :
            ObjectUtil.isEmpty(guarantor.wardNumber) &&
            !ObjectUtil.isEmpty(guarantor.municipalities) ? ', ' : '') +
        (!ObjectUtil.isEmpty(guarantor.wardNumber) ? guarantor.wardNumber + ', ' : '') +
        (!ObjectUtil.isEmpty(guarantor.district) &&
        !ObjectUtil.isEmpty(guarantor.district.name) ? guarantor.district.name + ', ' : '') +
        (!ObjectUtil.isEmpty(guarantor.province) && !ObjectUtil.isEmpty(guarantor.province.name) ?
            guarantor.province.name : '');
    }
    return !ObjectUtil.isEmpty(tempAddress) ? tempAddress : '';
  }
  saveGuarantorTagged() {
    this.spinner = true;
    const taggedGuarantorId = [];
    const assignedLoanId = [];
    if (!ObjectUtil.isEmpty(this.taggedList)) {
      this.taggedList.forEach(val => {
        taggedGuarantorId.push(val.id);
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.cadData.assignedLoan.forEach(val => {
        assignedLoanId.push(val.id);
      });
    }
    const data = {
      assignedLoanIds: assignedLoanId,
      taggedGuarantorIds: taggedGuarantorId
    };
    this.oneFormService.saveTaggedGuarantors(data).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Guarantors'));
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Save Guarantors'));
      this.spinner = false;
    });
  }
}
