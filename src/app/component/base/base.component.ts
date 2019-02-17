import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';
declare var $;
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit{

 
  title: string;

  constructor(private dataService: CommonDataService) { }

  ngOnInit() {
    this.dataService.currentTitle.subscribe(message => this.title = message)
   
  }
 
}
