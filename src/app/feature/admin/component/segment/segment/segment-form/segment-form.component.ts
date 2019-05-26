import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Segment} from '../../../../modal/segment';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {SegmentService} from '../segment.service';

@Component({
    selector: 'app-segment-form',
    templateUrl: './segment-form.component.html'
})
export class SegmentFormComponent implements OnInit, DoCheck {

    @Input()
    model: Segment = new Segment();

    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;

    constructor(
        private service: SegmentService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }
    }

    onSubmit() {
        this.submitted = true;
        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Segment!'));

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Segment!'));

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}

