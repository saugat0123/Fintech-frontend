import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Segment} from '../../../modal/segment';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-add-segment',
    templateUrl: './add-segment.component.html',
    styleUrls: ['./add-segment.component.css']
})
export class AddSegmentComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    segment: Segment = new Segment();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        this.segment = this.dataService.getSegment();
        if (this.segment.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.commonService.saveOrEdit(this.segment, 'v1/segment').subscribe(result => {
                this.modalService.dismissAll(AddSegmentComponent);

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Segment!'));

                this.segment = new Segment();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/segment']));


            }, error => {

                console.log(error);

                this.modalService.dismissAll(AddSegmentComponent);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Segment!'));

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/admin/segment']));

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddSegmentComponent);
    }
}

