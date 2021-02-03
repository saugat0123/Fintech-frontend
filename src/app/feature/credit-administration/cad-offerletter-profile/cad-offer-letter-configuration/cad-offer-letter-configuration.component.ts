import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-cad-offer-letter-configuration',
  templateUrl: './cad-offer-letter-configuration.component.html',
  styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

  @Input() customerInfo: CustomerInfoData;

  @Output()
  customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();

  userConfigForm: FormGroup;

  spinner = false;

  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private customerInfoService: CustomerInfoService,
              private toastService: ToastService,
              protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>) {
  }

  get configForm() {
    return this.userConfigForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
      const data = JSON.parse(this.customerInfo.nepData);
      this.userConfigForm.patchValue(data);
    }
  }

  buildForm() {
    this.userConfigForm = this.formBuilder.group({
      name: [undefined],
      gender: [undefined],
      fatherName: [undefined],
      grandFatherName: [undefined],
      relationMedium: [undefined],
      husbandName: [undefined],
      fatherInLawName: [undefined],
      citizenshipNo: [undefined],
      age: [undefined],
      permanentProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipality: [undefined],
      permanentMunType: ['नगरपालिका'],
      temporaryProvince: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipality: [undefined],
      permanentWard: [undefined],
      temporaryWard: [undefined],
      temporaryMunType: ['नगरपालिका'],
    });
  }

  save() {
    console.log(this.userConfigForm.value);
    this.submitted = true;
    if (this.userConfigForm.invalid) {
      return;
    }
    this.spinner = true;
    const data = JSON.stringify(this.userConfigForm.value);
    this.customerInfoService.updateNepaliConfigData(data, this.customerInfo.id).subscribe(res => {
      this.customerInfoData = res.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
      this.spinner = false;
      this.dialogRef.close(this.customerInfoData);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
      console.log(error);
      this.spinner = false;
      this.dialogRef.close();
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  controlValidation(controlNames, addValidation) {
    controlNames.forEach(s => {
      if (addValidation) {
        this.userConfigForm.get(s).setValidators(Validators.required);
      } else {
        this.userConfigForm.get(s).clearValidators();
      }
      this.userConfigForm.get(s).updateValueAndValidity();
    });
  }

}
