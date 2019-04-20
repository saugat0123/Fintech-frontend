import {Component, DoCheck, OnInit} from '@angular/core';
import {MemoService} from "../../../memo.service";
import {CommonDataService} from "../../../../../shared-service/baseservice/common-dataService";
import {Router} from "@angular/router";
import {MemoType} from "../../../model/memoType";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

declare var $;

@Component({
    selector: 'app-add-memo-type',
    templateUrl: './add-memo-type.component.html',
    styleUrls: ['./add-memo-type.component.css']
})
export class AddMemoTypeComponent implements OnInit, DoCheck {

    task: string;
    memoType: MemoType = new MemoType();
    globalMsg;
    addMemoTypeForm: FormGroup;

    constructor(
        private memoService: MemoService,
        private dataService: CommonDataService,
        private router: Router,
        private activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) {
    }


    ngOnInit() {
        this.addMemoTypeForm = this.formBuilder.group(
            {
                id: [this.dataService.getMemoType().id == null ? '' : this.dataService.getMemoType().id, Validators.required],
                name: [this.dataService.getMemoType().name == null ? '' : this.dataService.getMemoType().name, Validators.required],
                status: [this.dataService.getMemoType().status == null ? 'ACTIVE' : this.dataService.getMemoType().status, Validators.required]
            }
        );
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
        if (this.task === "Add") {

            this.memoService.save('v1/memos/types', this.addMemoTypeForm.value).subscribe(result => {
                    this.activeModal.close("Added");
                    this.globalMsg = "SUCCESSFULLY ADDED MEMO TYPE";
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('true');
                    this.memoType = new MemoType();
                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(["home/memo/type"]));
                    $(".alert-custom").slideDown();

                }, error => {

                    this.activeModal.close();

                    this.globalMsg = error.error.message;
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('false');

                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(["home/memo/type"]));
                    $(".alert-custom").slideDown();

                }
            );
        } else if (this.task === "Edit") {

            this.memoType.name = this.addMemoTypeForm.get('name').value;
            this.memoType.status = this.addMemoTypeForm.get('status').value;

            this.memoService.edit('v1/memos/types', this.memoType, this.memoType.id).subscribe(result => {
                    this.activeModal.close("Edited");
                    this.globalMsg = "SUCCESSFULLY EDITED MEMO TYPE";

                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('true');
                    this.memoType = new MemoType();
                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(["home/memo/type"]));
                    $(".alert-custom").slideDown();


                }, error => {

                    this.activeModal.close();

                    this.globalMsg = error.error.message;
                    this.dataService.getGlobalMsg(this.globalMsg);
                    this.dataService.getAlertMsg('false');

                    this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                        this.router.navigate(["home/memo/type"]));
                    $(".alert-custom").slideDown();

                }
            );
        }
    }

}
