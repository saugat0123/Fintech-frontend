import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-micro-common-detail',
  templateUrl: './micro-common-detail.component.html',
  styleUrls: ['./micro-common-detail.component.scss']
})
export class MicroCommonDetailComponent implements OnInit {
  @Input() microDetail;

  constructor() { }

  ngOnInit() {
  }

}
