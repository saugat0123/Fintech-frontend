import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Nepse} from '../../../modal/nepse';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NepseService} from '../nepse.service';
import {NepsePriceInfo} from "../../../modal/NepsePriceInfo";
import {FormBuilder, FormGroup} from "@angular/forms";


@Component({
    selector: 'app-nepse-form',
    templateUrl: './nepse-form.component.html'
})
export class NepseFormComponent implements OnInit, DoCheck {
    form: FormGroup;
    @Input()
    model: Nepse = new Nepse();
    price: NepsePriceInfo = new NepsePriceInfo();
    calendarType = 'AD';
    task: string;
    submitted = false;
    spinner = false;

    constructor(
        public fb: FormBuilder,
        private nepseService: NepseService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
    ) {
        this.form = this.fb.group({
            avgPrice: [''],
            sharePrice: ['']
        })
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
        this.nepseService.save(this.model).subscribe(result => {

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

    excelUpload(event) {
        const excelFile = <File>event.files[0];
        const formdata: FormData = new FormData();
        formdata.append('excelFile', excelFile);
        formdata.append('type', 'nepseFile');
        formdata.append('sharePrice', this.form.get('sharePrice').value);
        formdata.append('avgPrice', this.form.get('avgPrice').value);
        console.log(formdata);
        this.nepseService.uploadNepseFile(formdata).subscribe(result => {
            this.activeModal.close(ModalResponse.SUCCESS);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'sucessfully saved'));
        }, error => {
            this.activeModal.dismiss(error);
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    onSub() {
        console.log(this.form.value)
    }
}
