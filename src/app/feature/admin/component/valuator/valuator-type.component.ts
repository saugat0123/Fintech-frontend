import {Component, DoCheck, ElementRef, Input, OnInit} from '@angular/core';
// @ts-ignore
import {Valuator} from '../../../modal/valuator';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
// @ts-ignore
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
// @ts-ignore
import {ModalResponse, ToastService} from '../../../../../@core/utils';
// @ts-ignore
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
// @ts-ignore
import {ValuatorService} from '../valuator.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
// @ts-ignore
import {ValuatingField} from '../../../modal/valuatingField';


@Component({
    selector: 'app-valuator-form',
    templateUrl: './add-valuator.component.html'
})
export class ValuatorFormComponent implements OnInit, DoCheck {

    @Input()
    model: Valuator = new Valuator();
    placeHolderValuatingType = 'Select Valuating Type';
    formLabel: string;
    submitted = false;
    spinner = false;
    globalMsg: string;

    valuatorForm: FormGroup;
    valuatingFieldEnum = ValuatingField;


    constructor(
        private service: ValuatorService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private el: ElementRef,
    ) {

    }

    ngOnInit() {
        this.spinner = true;
        this.buildForm();

        // this.branchService.getAll().subscribe((response: any) => {
        //     this.branchList = response.detail;
        //     if (!ObjectUtil.isEmpty(this.model) && !ObjectUtil.isEmpty(this.model.branch)) {
        //         this.valuatorForm.get('branch').patchValue(this.model.branch);
        //         this.placeHolderValuatingType = '';
        //     }
        //     this.spinner = false;
        // }, error => {
        //     this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load!'));
        //     console.log(error);
        //     this.spinner = false;
        // });
    }

    buildForm() {
        this.valuatorForm = this.formBuilder.group({


            valuatingField: [(ObjectUtil.isEmpty(this.model)
                || ObjectUtil.isEmpty(this.model.valuatingField)) ? undefined :
                this.model.valuatingField, [Validators.required]],

        });
    }

    get valuatorFormControl() {
        return this.valuatorForm.controls;
    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.formLabel = 'Add';
        } else {
            this.formLabel = 'Edit';
        }
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }


    public validateMinMax(): boolean {
        return this.valuatorForm.value.maxAmount > this.valuatorForm.value.minAmount;
    }

    addCustomValuatingField(tag: string) {
        return tag;
    }

    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }


    onSubmit() {
        this.submitted = true;
        if (this.valuatorForm.invalid) {
            this.scrollToFirstInvalidControl();
            return;
        }
        if (!this.validateMinMax()) {
            this.valuatorForm.get('maxAmount').setErrors({'invalid': true});
            return;
        } else {
            this.valuatorForm.get('maxAmount').setErrors(null);
        }
        this.spinner = true;
        this.model = this.valuatorForm.value;
        this.service.save(this.model).subscribe(() => {
                if (this.model.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Valuator!'));
                    this.model = new Valuator();
                    this.activeModal.close(ModalResponse.SUCCESS);
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Valuator'));
                    this.model = new Valuator();
                    this.activeModal.close(ModalResponse.SUCCESS);
                }
            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Valuator!'));
                this.activeModal.dismiss(error);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ValuatorFormComponent);
    }



}
