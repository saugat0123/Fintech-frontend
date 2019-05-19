import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Nepse} from '../../../modal/nepse';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


@Component({
    selector: 'app-add-nepse',
    templateUrl: './add-nepse.component.html',
    styleUrls: ['./add-nepse.component.css']
})
export class AddNepseComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    nepse: Nepse = new Nepse();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.nepse = this.dataService.getNepse();
        if (this.nepse.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.nepse, 'v1/nepseCompany').subscribe(result => {
                this.modalService.dismissAll(AddNepseComponent);

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Nepse Company'));

                this.nepse = new Nepse();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/nepse']));


            }, error => {

                console.log(error);
                this.modalService.dismissAll(AddNepseComponent);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Nepse Company'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/nepse']));
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddNepseComponent);
    }

}
