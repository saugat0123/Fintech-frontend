import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-readmore-model',
  templateUrl: './readmore-model.component.html',
  styleUrls: ['./readmore-model.component.scss']
})
export class ReadmoreModelComponent implements OnInit {

  @Input()
  comments: any;
  amounts: any;

  constructor() {
  }

  ngOnInit() {
  }

}
