import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-video-kyc-information',
  templateUrl: './video-kyc-information.component.html',
  styleUrls: ['./video-kyc-information.component.scss']
})
export class VideoKycInformationComponent implements OnInit {

  constructor() { }
@Input() remitCustomer;
  videoKyc: any;
  notNUll = true;

  ngOnInit() {

    if (!ObjectUtil.isEmpty(this.remitCustomer.videoKyc)) {
      this.videoKyc = JSON.parse(this.remitCustomer.videoKyc);
      this.notNUll = false;
    }
  }

}
