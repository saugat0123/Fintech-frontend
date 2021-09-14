import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RemitCustomerService} from '../../../../admin/component/remit-customer-list/service/remit-customer.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'app-video-kyc-information',
  templateUrl: './video-kyc-information.component.html',
  styleUrls: ['./video-kyc-information.component.scss']
})
export class VideoKycInformationComponent implements OnInit {

  constructor(private remitService: RemitCustomerService, private model: NgbModal, private toast: NbToastrService) { }
@Input() remitCustomer;
  videoKyc: any;
  notNUll = true;

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.notNUll = false;
    }
  }

  generate(data, i) {
    this.videoKyc[i].status = 'InActive';
    this.remitCustomer.videoKyc = this.videoKyc;
    // this.remitService.saveRemitCustomer(this.remitCustomer).subscribe((response) => {
    //   this.toast.success('Status Changed');
    //   this.model.dismissAll();
    // });
  }
}
