import {FormType} from './formType';

export class Inputs {

    formType: FormType = new FormType();
    public DRAG_ELEMENTS = [
        this.formType.INPUT_TEXT,
        this.formType.INPUT_DATE,
        this.formType.INPUT_SELECT,
        this.formType.INPUT_TEXTAREA,
        this.formType.INPUT_LINEBREAK,
        this.formType.INPUT_ADDRESS,
        this.formType.INPUT_RADIO,
        this.formType.INPUT_ARRAY
    ];
}
