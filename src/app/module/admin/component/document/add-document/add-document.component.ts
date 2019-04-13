import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Document} from '../../../modal/document';

declare var $;


@Component({
    selector: 'app-add-document',
    templateUrl: './add-document.component.html',
    styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    document: Document = new Document();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        this.document = this.dataService.getDocument();
        if (this.document.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.commonService.saveOrEdit(this.document, 'v1/document').subscribe(result => {

                $('.add-document').modal('hide');
                if (this.document.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED DOCUMENT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED DOCUMENT';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.document = new Document();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/document']));
                this.dataService.alertmsg();


            }, error => {

                $('.add-document').modal('hide');

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/document']));
                this.dataService.alertmsg();

            }
        );
    }

}

