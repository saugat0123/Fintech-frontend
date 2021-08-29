import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../@core/validator/date-validator';
import {DatePipe} from '@angular/common';
import {CustomerInfoService} from '../customer/service/customer-info.service';

@Component({
  selector: 'app-video-kyc',
  templateUrl: './video-kyc.component.html',
  styleUrls: ['./video-kyc.component.scss']
})
export class VideoKycComponent implements OnInit {

  constructor(private form: FormBuilder,
              private customerInfoService: CustomerInfoService) { }
  senderForm: FormGroup;
  beneficiaryForm: FormGroup;
  videoKycBody = {
    "agentEmail": "agent@email.com",
    "customerInfo": {
      "address": "Kathmandu Nepal",
      "email": "user@email.com",
      "metadata": "another metadata",
      "name": "Loan Remit Test",
      "phone": "",
      "title": "mr"
    },
    "existingCustomer": false,
    "metadata": "this is meta data",
    "meetingDate": "2021-08-25",
    "meetingTime": "12:20",
    "purposeId": "000000001"
  };
  hideVideoKycSender = true;
  hideVideoKycBeneficiary = true;
  ngOnInit() {
    this.senderForm = this.form.group({
      meetingLink1: [undefined],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined]
    });
    this.beneficiaryForm = this.form.group({
      meetingLink1: [undefined],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined]
    });
  }

  onVideoKycPermissionSender($event: any) {
    console.log('video kyc permission', $event);
    if ($event === 0) {
      this.hideVideoKycSender = true;
      console.log('hide', this.hideVideoKycSender);
    } else {
      this.hideVideoKycSender = false;
      console.log('show', this.hideVideoKycSender);
    }
  }

  onVideoKycPermissionBeneficiary($event: any) {
    if ($event === 0) {
      this.hideVideoKycBeneficiary = true;
    } else {
      this.hideVideoKycBeneficiary = false;
    }
  }

  generateVideoKycSender($event: MouseEvent) {
    const formatedDate =  new DatePipe('en-UK').transform(this.senderForm.get('date').value, 'dd/MM/yyyy');
    this.videoKycBody.meetingDate = formatedDate;
    this.videoKycBody.meetingTime = this.senderForm.get('time').value;
    this.customerInfoService.videoKyc(this.videoKycBody).subscribe(res => {
      console.log('video kyc response', JSON.parse(res.data).meeting_link);
      this.senderForm.patchValue({
        meetingLink1: JSON.parse(res.data).meeting_link
      });
    });
  }

  generateVideoKycBeneficiary($event: MouseEvent) {
    const formatedDate =  new DatePipe('en-US').transform(this.beneficiaryForm.get('date').value, 'dd/MM/yyyy');
    this.videoKycBody.meetingDate = formatedDate;
    this.videoKycBody.meetingTime = this.beneficiaryForm.get('time').value;
    console.log('beneficiary clicked');
    this.customerInfoService.videoKyc(this.videoKycBody).subscribe(res => {
      console.log('video kyc response', JSON.parse(res.data).meeting_link);
      this.beneficiaryForm.patchValue({
        meetingLink1: JSON.parse(res.data).meeting_link
      });
    });
  }
}
