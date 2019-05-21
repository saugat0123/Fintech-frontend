import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {Segment} from '../../../../modal/segment';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
    selector: 'app-segment-form',
    templateUrl: './segment-form.component.html'
})
export class SegmentFormComponent implements OnInit, DoCheck {

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    segment: Segment = new Segment();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
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
        this.commonService.saveOrEdit(this.segment, 'v1/segment').subscribe( () => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Segment!'));

                this.segment = new Segment();

                this.activeModal.close(ModalResponse.SUCCESS);


            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Segment!'));

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}

