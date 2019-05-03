import {AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';

@Component({
  selector: 'app-customer-eligibility-base',
  templateUrl: './customer-eligibility-base.component.html',
  styleUrls: ['./customer-eligibility-base.component.css']
})
export class CustomerEligibilityBaseComponent implements AfterViewInit , OnInit{

  constructor() {
  }

  totalPoints: number;
  points: number;
  eligibilityPoints: number;

  ngAfterViewInit() {
    this.points;
    this.totalPoints = this.totalPoints + this.points;
    console.log(this.totalPoints);
  }

  ngOnInit(): void {
    //getAnswer();
  }

}
