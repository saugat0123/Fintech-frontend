import { Component, OnInit, DoCheck } from '@angular/core';

import {Segment} from '../../../../modal/segment';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';

declare var $;
@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.css']
})
export class SegmentComponent implements OnInit {

  constructor(
      private dataService: CommonDataService
  ) { }

  ngOnInit() {
  }
  addSegment(){
    this.dataService.setSegment(new Segment())
    $('.add-segment').modal('show');
  }
}
