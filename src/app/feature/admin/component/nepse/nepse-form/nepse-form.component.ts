import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Nepse} from '../../../modal/nepse';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NepseService} from '../nepse.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-nepse-form',
    templateUrl: './nepse-form.component.html'
})
export class NepseFormComponent implements OnInit, DoCheck {

    @Input()
    model: Nepse = new Nepse();
    calendarType = 'AD';
    task: string;
    submitted = false;
    spinner = false;
    nepsePriceInfoForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        private nepseService: NepseService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
    ) {
    }

    ngOnInit() {
        this.nepsePriceInfoForm = this.fb.group({
            sharePriceDate: [undefined, Validators.required],
            avgDaysForPrice: [undefined, [Validators.required]]
        });
    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }
    }

    get nepsePriceForm() {
        return this.nepsePriceInfoForm.controls;
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
        if (this.nepsePriceInfoForm.invalid || ObjectUtil.isEmpty(excelFile)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Provide all Upload Detail First !'));
            return;
        }
        console.log(excelFile);
        const formdata: FormData = new FormData();
        formdata.append('excelFile', excelFile);
        formdata.append('type', 'nepseFile');
        formdata.append('nepsePriceInfo', JSON.stringify(this.nepsePriceInfoForm.value));
        this.nepseService.uploadNepseFile(formdata).subscribe(result => {
            this.activeModal.close(ModalResponse.SUCCESS);
            this.toastService.show(new Alert(AlertType.SUCCESS, 'sucessfully saved'));
        }, error => {
            this.activeModal.dismiss(error);
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }
}
