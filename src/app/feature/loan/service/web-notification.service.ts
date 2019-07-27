import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {

  private notificationSource = new BehaviorSubject<any>(0);
  currentNotification = this.notificationSource.asObservable();

  constructor() { }

  changeNotification(notification: any) {
    this.notificationSource.next(notification);
  }
  setNotificationMessage(message: any) {
    this.notificationSource.next(message);
  }
}
