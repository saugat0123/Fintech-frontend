import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-manjurinama-letter-print',
  templateUrl: './manjurinama-letter-print.component.html',
  styleUrls: ['./manjurinama-letter-print.component.scss']
})
export class ManjurinamaLetterPrintComponent implements OnInit {
  @Input()
  Letter: any;

  constructor() { }

  ngOnInit() {
  }

}
