import {Component, OnInit, ViewChild} from '@angular/core';
import {Inputs} from '../constants/inputs';
import {NbTabComponent, NbTabsetComponent} from '@nebular/theme';
import {Editor} from '../../../@core/utils/constants/editor';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilderService} from '../service/form-builder.service';
import {Forms} from '../model/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormType} from '../constants/formType';

@Component({
    selector: 'app-form-builder-add',
    templateUrl: './form-builder-add.component.html',
    styleUrls: ['./form-builder-add.component.scss']
})
export class FormBuilderAddComponent implements OnInit {
    TITLE_ERROR = 'Form name is Required';
    EMPTY_FORM_ERROR = 'Form Field is Required';
    EMPTY_FORM_ARRAY_ERROR = 'Form ARRAY is Required!!Either Remove or add field';


    dragElements = [];
    formFields = [];
    tempFormFields = [];
    collapseHorz = false;
    // @ts-ignore
    @ViewChild('masterTab') tabsetEl: NbTabsetComponent;

    // @ts-ignore
    @ViewChild('fieldSetting') settingTabEl: NbTabComponent;

    selectedField;
    finalFormFields = [];
    id = 1;

    formTitle = 'Input Title';
    forms: Forms = new Forms();
    isFormEmpty = false;
    editId;
    editForm = false;
    calendarType = 'AD';
    isDatePresent = false;
    FormType = FormType;
    isArraySelected = false;
    arrayId = 0;

    constructor(private toastService: ToastService,
                private route: ActivatedRoute,
                private formBuilderService: FormBuilderService,
                private router: Router,
                private spinnerService: NgxSpinnerService) {
    }

    ngOnInit() {
        this.dragElements = new Inputs().DRAG_ELEMENTS;
        this.editId = this.route.snapshot.params.id;
        if (!ObjectUtil.isEmpty(this.editId) && (this.editId !== 'add')) {
            this.getFormById(this.editId);
            this.editForm = true;
        }

    }

    removeElement(i, id) {
        if (this.formFields[i].type === FormType.FORM_ARRAY) {
            this.dragElements = new Inputs().DRAG_ELEMENTS;
        }
        this.formFields.splice(i, 1);
        if (!ObjectUtil.isEmpty(this.selectedField)) {
            if (this.selectedField.id === id) {
                this.selectedField = {};
            }
        }
        const isDateFieldPresent = this.formFields.filter(f => f.type === 'date');
        if (isDateFieldPresent.length < 1) {
            this.isDatePresent = false;
        }

    }


    onDrop(event) {
        this.isFormEmpty = false;
        const element: any = event;
        this.id = this.id + 1;
        element.id = this.id;
        this.formFields.push(element);
        this.dragElements = new Inputs().DRAG_ELEMENTS;
        if (element.type === 'date') {
            this.isDatePresent = true;
        }
        if (element.type === FormType.FORM_ARRAY) {
            this.selectedField = element;
            this.dragElements.forEach((d, index) => {
                if (d.type === FormType.FORM_ARRAY) {
                    this.dragElements.splice(index, 1);
                }
            });
        } else {
            this.selectedField = {};
            this.dragElements = new Inputs().DRAG_ELEMENTS;
        }

    }


    goToSettings(id) {
        this.selectedField = this.formFields.filter(data => id === data.id)[0];
        if (this.selectedField.type !== FormType.FORM_ARRAY) {
            this.tabsetEl.selectTab(this.settingTabEl);
            this.isArraySelected = false;
            this.dragElements = new Inputs().DRAG_ELEMENTS;
        } else {
            this.dragElements.forEach((d, index) => {
                if (d.type === FormType.FORM_ARRAY) {
                    this.dragElements.splice(index, 1);
                }
            });
            this.isArraySelected = true;
        }

        this.collapseHorz = false;
    }

    onChangeSettings(set, changedValue, index) {
        set.value = changedValue.value;

        if (set.type === 'checkBoxZone' || set.type === 'ckEditor' || set.type === 'multiple') {
            set.value = changedValue.checked;
        }

        const formFieldSelectedIndex = this.formFields.indexOf(this.selectedField);
        this.selectedField.settings[index] = set;
        this.formFields[formFieldSelectedIndex] = this.selectedField;

    }

    collapseSetting() {
        if (this.collapseHorz) {
            this.collapseHorz = false;
        } else {
            this.collapseHorz = true;
        }
    }

    onSubmit() {
        if (ObjectUtil.isEmpty(this.formTitle)) {
            this.toastService.show(new Alert(AlertType.ERROR, this.TITLE_ERROR));
            return;
        }

        if (this.formFields.length < 1) {
            this.isFormEmpty = true;
            this.toastService.show(new Alert(AlertType.ERROR, this.EMPTY_FORM_ERROR));
            return;
        } else {
            this.isFormEmpty = false;
        }
        let isArrayEmpty = false;
        const getFormArrayFields = this.formFields.filter(f => f.type === FormType.FORM_ARRAY);
        getFormArrayFields.forEach(f => {
            this.selectedField = f;
            if (f.type === FormType.FORM_ARRAY) {
                const arrayField = f.fields;
                if (ObjectUtil.isEmpty(arrayField)) {
                    isArrayEmpty = true;
                }
                if (arrayField.length < 1) {
                    isArrayEmpty = true;
                }
            }
        });
        if (isArrayEmpty) {
            this.toastService.show(new Alert(AlertType.ERROR, this.EMPTY_FORM_ARRAY_ERROR));
            return;
        }
        this.forms.title = this.formTitle;
        this.forms.config = JSON.stringify(this.formFields);
        this.spinnerService.show();
        this.formBuilderService.save(this.forms).subscribe((res: any) => {
            this.spinnerService.hide();
            this.forms = res.detail;
            this.formFields = JSON.parse(res.detail.config);
            this.formTitle = res.detail.title;
            let msg = 'SUCCESSFULLY ADDED FORM ' + this.formTitle;
            if (this.editForm) {
                msg = 'SUCCESSFULLY Updated FORM ' + this.formTitle;
            }
            this.toastService.show(new Alert(AlertType.SUCCESS, msg));
            this.router.navigate(['/home/template/list']);
        }, error => {
            this.spinnerService.hide();
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

    addMoreChoice() {
        this.selectedField.settings[5].possibleValue.push({Text: 'new choice'});
        const formFieldSelectedIndex = this.formFields.indexOf(this.selectedField);
        this.formFields[formFieldSelectedIndex] = this.selectedField;
    }

    editChooseOption(event, index) {
        this.selectedField.settings[5].possibleValue[index].Text = event.value;
        const formFieldSelectedIndex = this.formFields.indexOf(this.selectedField);
        this.formFields[formFieldSelectedIndex] = this.selectedField;
    }

    removeFromChoose(index) {
        this.selectedField.settings[5].possibleValue.splice(index, 1);
    }

    // for edit
    getFormById(id) {
        this.formBuilderService.detail(id).subscribe((res: any) => {
            this.forms = res.detail;
            this.formFields = JSON.parse(res.detail.config);
            this.formTitle = res.detail.title;
            this.formFields.forEach(form => {
                if (!ObjectUtil.isEmpty(form.id)) {
                    this.id = form.id;
                }

            });
        });
    }


    eventEmitDoubleClick(event) {
        if (!ObjectUtil.isEmpty(event) && (!ObjectUtil.isEmpty(this.selectedField))) {
            if (this.selectedField.type === FormType.FORM_ARRAY) {
                const element: any = event;
                this.arrayId = this.arrayId + 1;
                if (this.selectedField.fields.length > 0) {
                    this.arrayId = parseInt(this.selectedField.fields[this.selectedField.fields.length - 1].id, 10) + 1;
                }
                element.id = this.arrayId;
                this.selectedField.fields.push(element);
                this.dragElements = new Inputs().DRAG_ELEMENTS;
                this.dragElements.forEach((d, index) => {
                    if (d.type === FormType.FORM_ARRAY) {
                        this.dragElements.splice(index, 1);
                    }
                });
                if (element.type === 'date') {
                    this.isDatePresent = true;
                }

            }
        }

    }
}
