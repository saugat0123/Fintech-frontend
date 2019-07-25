import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanSummaryService {

  private readMoreMsg = new BehaviorSubject<string>('default');

  message = this.readMoreMsg.asObservable();

  constructor() { }
}
