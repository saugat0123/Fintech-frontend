import {Component, OnInit} from '@angular/core';
import {Nepse} from '../../../../../modal/nepse';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';


declare var $;
const UploadURL = 'http://localhost:8086/v1/nepseCompany/bulk';

@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    nepse: Nepse = new Nepse();


    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService
    ) {
    }


    ngOnInit() {


    }


}
