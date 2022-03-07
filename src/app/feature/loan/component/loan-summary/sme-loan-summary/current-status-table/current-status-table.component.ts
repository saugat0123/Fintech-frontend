import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-status-table',
  templateUrl: './current-status-table.component.html',
  styleUrls: ['./current-status-table.component.scss']
})
export class CurrentStatusTableComponent implements OnInit {

  constructor() { }

  @Input() testObject: any;
  ngOnInit() {  }

}
