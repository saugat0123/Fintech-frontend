import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Sector} from '../../../../modal/sector';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {SectorService} from '../SectorService';


@Component({
    selector: 'app-sector-form',
    templateUrl: './sector-form.component.html'
})

export class SectorFormComponent implements OnInit, DoCheck {

    @Input()
    model: Sector;

    task: string;
    submitted = false;
    spinner = false;

    constructor(
        private service: SectorService,
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
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Sector!'));

                this.model = new Sector();

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.activeModal.dismiss(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Sector!'));
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
