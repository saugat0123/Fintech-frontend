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
  @Input() showSender;
  @Input() showBenf;
  @Input() senderDetails;
  @Input() benfDetails;
  videoKyc: any;
  notNUll = true;
  spinner = false;
  count = 0;

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.videoKyc.map(el => el.isBenf);
      this.notNUll = false;
    }
  }

  generate(data) {
    this.spinner = true;
    this.videoKyc.forEach((d, i) => {
      if (d.id === data.id) {
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
    });
  }

  ngOnChanges(): void {
    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.notNUll = false;
    }
  }
}
