import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../@core/validator/date-validator';
import {DatePipe} from '@angular/common';
import {CustomerInfoService} from '../customer/service/customer-info.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RemitCustomerService} from '../admin/component/remit-customer-list/service/remit-customer.service';
import {NbToastrService} from '@nebular/theme';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {Router} from '@angular/router';
import {VideoKycInformationComponent} from '../loan/component/loan-summary/video-kyc-information/video-kyc-information.component';

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
              private router: Router) { }
  @Input() isModal;
  @Input() showBenificiary;
  @Input() showSender;
  @Input() remitCustomer;
  senderLink = false;
  benfLink = false;
  senderForm: FormGroup;
  beneficiaryForm: FormGroup;
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
    this.videoKyc.agentEmail = JSON.parse(this.remitCustomer.agentData).email;
    this.senderForm = this.form.group({
      meetingLink: [undefined],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined],
      beneficiaryId: [undefined],
      status: ['ACTIVE'],
      id: [undefined],
      isBenf: false
    });
    this.beneficiaryForm = this.form.group({
      meetingLink: [undefined],
      date: [undefined, [Validators.required, DateValidator.isValidBefore]],
      time: [undefined],
      beneficiaryId: [undefined],
      status: ['ACTIVE'],
      id: [undefined],
      isBenf: true
    });
    if (this.remitCustomer.videoKyc !== null && !ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.videoKyc.forEach((data) => {
        if (data.status.toLowerCase() === 'active' && data.isBenf === true) {
          this.beneficiaryForm.patchValue(data);
        } else if (data.status.toLowerCase() === 'active' && data.isBenf === false) {
          this.senderForm.patchValue(data);
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
    console.log(event);
    if (!$event) {
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
      this.senderLink = true;
      this.senderForm.patchValue({
        meetingLink: JSON.parse(res.data).meeting_link
      });
    });
  }

  generateVideoKycBeneficiary($event: MouseEvent) {
    const formatedDate =  new DatePipe('en-US').transform(this.beneficiaryForm.get('date').value, 'dd/MM/yyyy');
    this.videoKycBody.meetingDate = formatedDate;
    this.videoKycBody.meetingTime = this.beneficiaryForm.get('time').value;
    this.benfLink = true;
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
      this.videoSpinner = false;
      this.remitCustomer = data.detail;
      this.videoKyc = this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.toast.success('Saved Video Kyc Details');
      this.model.dismissAll();
      if (this.isModal === true) {
        this.router.navigateByUrl('/RemitCustomerListComponent', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/home/admin/remitLoan/incoming']);
        });
      } else {
      }
    }, err => {
      this.videoSpinner = false;
      this.toast.danger('OPPS!! Something Went Wrong');
      this.model.dismissAll();
    });
  }

}
