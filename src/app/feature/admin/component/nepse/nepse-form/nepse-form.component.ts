import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Nepse} from '../../../modal/nepse';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NepseService} from '../nepse.service';


@Component({
    selector: 'app-nepse-form',
    templateUrl: './nepse-form.component.html'
})
export class NepseFormComponent implements OnInit, DoCheck {

    @Input()
    model: Nepse = new Nepse();

    task: string;
    submitted = false;
    spinner = false;

    constructor(
        private service: NepseService,
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
        this.service.save(this.model).subscribe(result => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Nepse Company'));

                this.model = new Nepse();

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);
                this.activeModal.dismiss(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Nepse Company'));
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}
