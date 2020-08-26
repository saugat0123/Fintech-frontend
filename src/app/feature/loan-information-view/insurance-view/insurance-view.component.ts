import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-insurance-view',
  templateUrl: './insurance-view.component.html',
  styleUrls: ['./insurance-view.component.scss']
})
export class InsuranceViewComponent implements OnInit {
  @Input() insurance;

  constructor() {
  }

  ngOnInit() {
    console.log(this.insurance);
  }

}
