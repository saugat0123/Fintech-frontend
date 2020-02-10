
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NepaliDataService {

    currentNameSubject$ = new BehaviorSubject('');
    relationSubject$ = new BehaviorSubject([]);
}
