import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  currentIndex = 0;
  constructor() { }

  ngOnInit() {
  }

}
