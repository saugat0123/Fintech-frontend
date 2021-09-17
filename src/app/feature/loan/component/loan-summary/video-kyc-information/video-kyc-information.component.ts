import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RemitCustomerService} from '../../../../admin/component/remit-customer-list/service/remit-customer.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'app-video-kyc-information',
  templateUrl: './video-kyc-information.component.html',
  styleUrls: ['./video-kyc-information.component.scss']
})
export class VideoKycInformationComponent implements OnInit , OnChanges{

  constructor(private remitService: RemitCustomerService, private model: NgbModal, private toast: NbToastrService) { }
  @Input() remitCustomer;
  @Output() remitEvent = new EventEmitter();
  videoKyc: any;
  notNUll = true;
  spinner = false;

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.notNUll = false;
    }
  }

  generate(data, i) {
    this.spinner = true;
    this.videoKyc[i].status = 'INACTIVE';
    this.videoKyc[i].recordedLink = 'http://localhost:4200';
    this.remitCustomer.videoKyc = JSON.stringify(this.videoKyc);
    this.remitService.saveRemitCustomer(this.remitCustomer).subscribe((response) => {
      this.remitCustomer = response.detail;
      response.detail.version = response.detail.version + 1;
      this.remitEvent.emit(response.detail);
      this.toast.success('Status Changed');
      this.model.dismissAll();
      this.spinner = false;
    }, (err) => {
      this.spinner = false;
    });
  }

  ngOnChanges(): void {
    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.notNUll = false;
    }
  }
}
