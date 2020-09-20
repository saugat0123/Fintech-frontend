import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';

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

  constructor(public activeModal: NgbActiveModal, ) {
  }

  ngOnInit() {
    this.unParsedData = this.data;
    this.data = JSON.parse(this.data);
  }

}
