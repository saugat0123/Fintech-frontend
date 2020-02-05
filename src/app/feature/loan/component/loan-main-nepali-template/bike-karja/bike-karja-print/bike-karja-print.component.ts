import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bike-karja-print',
  templateUrl: './bike-karja-print.component.html',
  styleUrls: ['./bike-karja-print.component.scss']
})
export class BikeKarjaPrintComponent implements OnInit {

  @Input() form: any;

  constructor() { }

  ngOnInit() {
  }

}
