export class Violation {
    private _field;
    private _message;
    private _rejectedValue;


    constructor(field, message, rejectedValue) {
        this._field = field;
        this._message = message;
        this._rejectedValue = rejectedValue;
    }

    get field() {
        return this._field;
    }

    set field(value) {
        this._field = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get rejectedValue() {
        return this._rejectedValue;
    }

    set rejectedValue(value) {
        this._rejectedValue = value;
    }
}
