import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from "../../../../../shared-service/baseservice/common-baseservice";
import {CommonDataService} from "../../../../../shared-service/baseservice/common-dataService";
import {Router} from "@angular/router";
import {Memotype} from "../../../model/memotype";

declare var $;

@Component({
    selector: 'app-add-memo-type',
    templateUrl: './add-memo-type.component.html',
    styleUrls: ['./add-memo-type.component.css']
})
export class AddMemoTypeComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    memoType: Memotype = new Memotype();
    globalMsg;

    constructor(
        private commonService: CommonService,
        private dataService: CommonDataService,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.memoType = this.dataService.getMemoType();
        if (this.memoType.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.memoType, 'v1/memos/types').subscribe(result => {
                $('.add-memotype').modal('hide');
                if (this.memoType.id == null) {
                    this.globalMsg = "SUCCESSFULLY ADDED MEMO TYPE";
                } else {
                    this.globalMsg = "SUCCESSFULLY EDITED MEMO TYPE";
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.memoType = new Memotype();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(["home/memotype"]));
                $(".alert-custom").slideDown();


            }, error => {

                $('.add-memotype').modal('hide');

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(["home/memotype"]));
                $(".alert-custom").slideDown();

            }
        );
    }

}
