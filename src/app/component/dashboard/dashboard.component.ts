import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = "Dashboard";

  constructor(
    private dataService: CommonDataService
  ) { }

  ngOnInit() {
   
    this.dataService.changeTitle(this.title);
  }

}
