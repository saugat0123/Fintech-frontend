import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section1-introduction',
  templateUrl: './section1-introduction.component.html',
  styleUrls: ['./section1-introduction.component.scss']
})
export class Section1IntroductionComponent implements OnInit {
  section1: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
