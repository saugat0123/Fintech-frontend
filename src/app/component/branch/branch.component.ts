import { Component, OnInit } from '@angular/core';
import { CommonDataService } from '../../shared-service/baseservice/common-dataService';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  title = "Branch";

  constructor(
    private dataService: CommonDataService
  ) { }

  ngOnInit() {
    this.dataService.changeTitle(this.title);
  }
}
