import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../@core/validator/date-validator';
import {DatePipe} from '@angular/common';
import {CustomerInfoService} from '../customer/service/customer-info.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RemitCustomerService} from '../admin/component/remit-customer-list/service/remit-customer.service';
import {NbToastrService} from '@nebular/theme';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-video-kyc',
  templateUrl: './video-kyc.component.html',
  styleUrls: ['./video-kyc.component.scss']
})
export class VideoKycComponent implements OnInit {

  constructor(private form: FormBuilder,
              private customerInfoService: CustomerInfoService,
              private model: NgbModal,
              private remitService: RemitCustomerService,
              private toast: NbToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }
  @Input() isModal;
  @Input() showBenificiary;
  @Input() showSender;
  @Input() remitCustomer;
  senderLink = true;
  benfLink = true;
  senderForm: FormGroup;
  beneficiaryForm: FormGroup;
  senderDetails: any;
  benfDetails: any;
  agentDetails: any;
  videoKyc: any;
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
  videoSpinner = false;
  breakException: any;
  ngOnInit() {
    console.log('this is remit loan', this.remitCustomer);
    this.buildSenderForm();
    this.buildBenfFrom();
    this.checkActiveLink();
    this.agentDetails = JSON.parse(this.remitCustomer.agentData);
  }
  buildBenfFrom() {
    this.beneficiaryForm = this.form.group({
      meetingLink: [undefined, Validators.required],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined],
      beneficiaryId: [undefined],
      status: ['ACTIVE'],
      id: [undefined],
      isBenf: true,
      recordedLink: [undefined]
    });
  }
  buildSenderForm() {
    this.senderForm = this.form.group({
      meetingLink: [undefined, Validators.required],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined],
      beneficiaryId: [undefined],
      status: ['ACTIVE'],
      id: [undefined],
      isBenf: false,
      recordedLink: [undefined]
    });
  }
checkActiveLink() {
  if (this.remitCustomer.videoKyc !== null && !ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
    this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
    this.videoKyc.forEach((data) => {
      if (data.status.toLowerCase() === 'active' && data.isBenf === true) {
        this.beneficiaryForm.patchValue(data);
        this.benfLink = false;
      } else if (data.status.toLowerCase() === 'active' && data.isBenf === false) {
        this.senderForm.patchValue(data);
        this.senderLink = false;
      } else {
        this.senderLink = true;
        this.benfLink = true;
      }
    });
  }
}
  onVideoKycPermissionSender($event: any) {
    if (!$event) {
      this.hideVideoKycSender = true;
    } else {
      this.hideVideoKycSender = false;
    }
  }

  onVideoKycPermissionBeneficiary($event: any) {
    if (!$event) {
      this.hideVideoKycBeneficiary = true;
    } else {
      this.hideVideoKycBeneficiary = false;
    }
  }

  generateVideoKycSender($event: MouseEvent) {
    if (ObjectUtil.isEmpty(this.senderForm.get('date').value) || ObjectUtil.isEmpty(this.senderForm.get('time').value)) {
      this.toast.warning('Fields Are Missing');
      return;
    }
    this.videoKycBody.agentEmail = this.agentDetails.email;
    this.senderDetails = JSON.parse(this.remitCustomer.senderData);
    console.log('this is sender', this.senderDetails);
    const formatedDate =  new DatePipe('en-UK').transform(this.senderForm.get('date').value, 'dd/MM/yyyy');
    this.videoKycBody.meetingDate = formatedDate;
    this.videoKycBody.meetingTime = this.senderForm.get('time').value;
    this.customerInfoService.videoKyc(this.videoKycBody).subscribe(res => {
      this.senderForm.patchValue({
        meetingLink: JSON.parse(res.data).meeting_link
      });
    });
  }

  generateVideoKycBeneficiary($event: MouseEvent) {
    if (ObjectUtil.isEmpty(this.beneficiaryForm.get('date').value) || ObjectUtil.isEmpty(this.beneficiaryForm.get('time').value)) {
      this.toast.warning('Fields Are Missing');
      return;
    }
    this.benfDetails = JSON.parse(this.remitCustomer.beneficiaryData);
    console.log('this is benf', this.benfDetails);
    this.videoKycBody.agentEmail = this.agentDetails.email;
    const formatedDate =  new DatePipe('en-US').transform(this.beneficiaryForm.get('date').value, 'dd/MM/yyyy');
    this.videoKycBody.meetingDate = formatedDate;
    this.videoKycBody.meetingTime = this.beneficiaryForm.get('time').value;
    this.customerInfoService.videoKyc(this.videoKycBody).subscribe(res => {
      this.beneficiaryForm.patchValue({
        meetingLink: JSON.parse(res.data).meeting_link
      });
    });
  }

  close() {
    this.model.dismissAll();
  }

  save(form: FormGroup) {
    if (ObjectUtil.isEmpty(form.get('meetingLink').value)) {
      this.toast.warning('Generate Meeting Link');
      return;
    }
    this.videoSpinner = true;
    let str = form.get('meetingLink').value;
    str = str.slice(50, str.length);
    form.patchValue({
      beneficiaryId: this.remitCustomer.beneficiaryId,
      id: str
    });
    if (this.videoKyc !== null  && !ObjectUtil.isEmpty(this.videoKyc)) {
      try {
        this.videoKyc.forEach((data, i) => {
          if (data.status.toLowerCase() === 'active' && data.isBenf === form.get('isBenf').value) {
            this.videoKyc[i] = form.value;
            throw this.breakException;
          } else {
            if (i === this.videoKyc.length - 1) {
              this.videoKyc.push(form.value);
            }
          }});
      } catch (ex) {
        if (ex !== this.breakException) {
          throw ex;
        }
      }
    } else {
       this.videoKyc = [form.value];
    }
    this.remitCustomer.videoKyc = JSON.stringify(this.videoKyc);
    this.remitService.saveRemitCustomer(this.remitCustomer).subscribe((data) => {
      if (form.get('isBenf').value === true) {
        this.benfLink = false;
      } else if (form.get('isBenf').value === false) {
        this.senderLink = false;
      }
      this.videoSpinner = false;
      data.detail.version = data.detail.version + 1;
      this.remitCustomer = data.detail;
      this.videoKyc = this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.toast.success('Saved Video Kyc Details');
      this.model.dismissAll();
      if (this.isModal === true) {
        this.router.navigateByUrl('/RemitCustomerListComponent', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/home/admin/remitLoan/incoming']);
        });
      } else {
          // this.router.navigate(['/home/admin/catalogue']);
      }
    }, err => {
      this.videoSpinner = false;
      this.toast.danger('OPPS!! Something Went Wrong');
      this.model.dismissAll();
    });
  }
  getEvent(data) {
    this.remitCustomer = data;
    this.checkActiveLink();
    this.buildSenderForm();
    this.buildBenfFrom();
  }
}
