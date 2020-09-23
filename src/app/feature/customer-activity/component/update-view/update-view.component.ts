import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-update-view',
  templateUrl: './update-view.component.html',
  styleUrls: ['./update-view.component.scss']
})
export class UpdateViewComponent implements OnInit {

  @Input() data: any;

  @Input() profile: CustomerInfoData;

  @Input() activity: string;

  unParsedData;

  loanUpdateData = {
    proposal: null,
    guarantor: {guarantorList: null}
  };

  constructor(private modalService: NgbModal, ) {
  }

  ngOnInit() {
    this.unParsedData = this.data;
    this.data = JSON.parse(this.data);
    if (this.unParsedData === '[]') {
      this.data = null;
    }
    if (this.activity === 'LOAN_UPDATE') {
      this.loanUpdateData = this.data;
      if (!ObjectUtil.isEmpty(this.data.guarantor)) {
        const guarantorList = this.data.guarantor;
        this.loanUpdateData.guarantor.guarantorList = guarantorList;
      }
    }

  }

  close() {
    this.modalService.dismissAll();
  }

}
