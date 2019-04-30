import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CustomerDataService {

    constructor() {
    }

    private _totalNavsCount: number;

    get totalNavsCount(): number {
        return this._totalNavsCount;
    }

    set totalNavsCount(value: number) {
        this._totalNavsCount = value;
    }

}
