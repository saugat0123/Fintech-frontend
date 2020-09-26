import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../../../../../@core/validator/date-validator';
import {District} from '../../../../../admin/modal/district';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Customer} from '../../../../../admin/modal/customer';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerService} from '../../../../service/customer.service';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.scss']
})
export class KycFormComponent implements OnInit {
  customer: Customer;

  submitted = false;
  spinner = false;

  kycInfo: FormGroup;
  allDistrict: Array<District> = Array<District>();

  constructor(
              private formBuilder: FormBuilder,
              private customerService: CustomerService,
              private toastService: ToastService,
              private commonLocation: AddressService,
              protected dialogRef: NbDialogRef<KycFormComponent>) {
  }


  ngOnInit() {

    this.buildForm();
    this.getAllDistrict();
    if (!ObjectUtil.isEmpty(this.customer.customerRelatives)) {
      this.setRelatives(this.customer.customerRelatives);
    } else {
      this.createRelativesArray();
    }
  }

  onClose() {
   this.dialogRef.close();
  }

  buildForm() {
    this.kycInfo = this.formBuilder.group({
      customerRelatives: this.formBuilder.array([])
    });

  }

  addKyc() {
    (this.kycInfo.get('customerRelatives') as FormArray).push(
        this.formBuilder.group({
          customerRelation: [undefined, Validators.required],
          customerRelativeName: [undefined, Validators.compose([Validators.required])],
          citizenshipNumber: [undefined],
          citizenshipIssuedPlace: [undefined],
          citizenshipIssuedDate: [undefined, Validators.compose([DateValidator.isValidBefore])],
        })
    );
  }

  removeRelatives(i) {
    (this.kycInfo.get('customerRelatives') as FormArray).removeAt(i);
  }

    createRelativesArray() {
      const relation = ['Grand Father', 'Father'];
      relation.forEach((customerRelation) => {
        (this.kycInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
          customerRelation: [{value: customerRelation, disabled: true} , Validators.required],
          customerRelativeName: [undefined , Validators.required],
          citizenshipNumber: [undefined],
          citizenshipIssuedPlace: [undefined],
          citizenshipIssuedDate: [undefined, Validators.compose([DateValidator.isValidBefore])]
        }));
      });
    }

  setRelatives(currentData) {
    const relativesData = (this.kycInfo.get('customerRelatives') as FormArray);
    currentData.forEach((singleRelatives, index) => {
      console.log(singleRelatives);
      const customerRelative = singleRelatives.customerRelation;
      // Increase index number with increase in static relatives---
      relativesData.push(this.formBuilder.group({
        customerRelation: (index > 1) ? [(customerRelative)] :
            [({value: customerRelative, disabled: true}), Validators.required],
        customerRelativeName: [singleRelatives.customerRelativeName , Validators.required],
        citizenshipNumber: [singleRelatives.citizenshipNumber],
        citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
        citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
            undefined : new Date(singleRelatives.citizenshipIssuedDate) , DateValidator.isValidBefore],
        id: [ObjectUtil.setUndefinedIfNull(singleRelatives.id)],
        version: [ObjectUtil.setUndefinedIfNull(singleRelatives.version)],
      }));
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.kycInfo.invalid) {
      return;
    }
    this.spinner = true;
    const rawFromValue = this.kycInfo.getRawValue();
    this.customer.customerRelatives = rawFromValue.customerRelatives;
    this.customerService.save( this.customer).subscribe(response => {
      this.customer = response.detail;
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
      this.dialogRef.close(ModalResponse.SUCCESS);
    } , res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, res.error.message));
      this.dialogRef.close();
    });
  }

  private getAllDistrict() {
    this.commonLocation.getAllDistrict().subscribe((response: any) => {
      this.allDistrict = response.detail;
    });
  }
}
