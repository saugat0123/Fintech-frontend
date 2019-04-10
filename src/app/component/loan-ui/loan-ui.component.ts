import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonService } from '../../shared-service/baseservice/common-baseservice';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
import { CommonPageService } from '../../shared-service/baseservice/common-pagination-service';

@Component({
  selector: 'app-loan-ui',
  templateUrl: './loan-ui.component.html',
  styleUrls: ['./loan-ui.component.css']
})
export class LoanUiComponent implements OnInit, DoCheck {

  constructor(
  ) { }

  ngDoCheck(): void {


  }

  ngOnInit() {

  }

}
