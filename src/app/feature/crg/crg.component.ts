import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-crg',
  templateUrl: './crg.component.html',
  styleUrls: ['./crg.component.scss']
})
export class CrgComponent implements OnInit {
  crgForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
