import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-comments-summary',
    templateUrl: './comments-summary.component.html',
    styleUrls: ['./comments-summary.component.scss']
})
export class CommentsSummaryComponent implements OnInit {
    @Input() formData;
    comment: any;

    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.formData)) {
            this.comment = JSON.parse(this.formData.data);
            console.log(this.comment);
        }
    }

}
