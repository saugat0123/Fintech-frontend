import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormType} from '../../constants/formType';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Inputs} from '../../constants/inputs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-input-array-add',
    templateUrl: './input-array-add.component.html',
    styleUrls: ['./input-array-add.component.scss']
})
export class InputArrayAddComponent implements OnInit, OnChanges {
    @Input() formFields: any;
    @Input() isArraySelected: boolean;
    FormType = FormType;
    selectedField;
    isDatePresent = false;
    calendarType = 'AD';

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.showHide();
    }

    removeElement(i, id) {
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


    goToSettings(index) {
        this.selectedField = {};
        this.selectedField = this.formFields[index];
    }

    addMoreChoice() {
        this.selectedField.settings[5].possibleValue.push({Text: 'new choice'});
        const formFieldSelectedIndex = this.formFields.indexOf(this.selectedField);
        this.formFields[formFieldSelectedIndex] = this.selectedField;
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

    editChooseOption(event, index) {
        this.selectedField.settings[5].possibleValue[index].Text = event.value;
        const formFieldSelectedIndex = this.formFields.indexOf(this.selectedField);
        this.formFields[formFieldSelectedIndex] = this.selectedField;
        console.log(this.selectedField);
    }

    removeFromChoose(index) {
        this.selectedField.settings[5].possibleValue.splice(index, 1);
    }

    showHide() {
        if (this.isArraySelected) {
            console.log('selected');
        } else {
            console.log('not');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const myElements: HTMLElement[] = this.el.nativeElement.querySelectorAll('.showHide');


        if (this.isArraySelected) {
            for (let i = 0; i < myElements.length; i++) {
                myElements[i].style.display = 'block';
            }
        } else {
            for (let i = 0; i < myElements.length; i++) {
                myElements[i].style.display = 'none';
            }
        }
    }
    moveItem(event: CdkDragDrop<FormType[]>) {
        console.log('moved', event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

}
