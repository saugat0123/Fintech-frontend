import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Company} from '../../../modal/company';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CompanyService} from '../company.service';


@Component({
    selector: 'app-company-form',
    templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit, DoCheck {

    @Input()
    company: Company;

    task: string;
    submitted = false;
    spinner = false;

    constructor(
        private service: CompanyService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
    }

    ngDoCheck(): void {
        if (this.company.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }
    }

    onSubmit() {
        this.submitted = true;

        this.service.save(this.company).subscribe(() => {
            if (this.company.id == null){
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Company Information'));
                this.company = new Company();
                this.activeModal.close(ModalResponse.SUCCESS);
            } else {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Company Information'));
                this.company = new Company();
                this.activeModal.close(ModalResponse.SUCCESS);
            }
            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Company Information'));

                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}
