import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    currentIndex: number;

    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData.previousList)) {
            this.currentIndex = this.cadData.previousList.length;
        }

    }

}
