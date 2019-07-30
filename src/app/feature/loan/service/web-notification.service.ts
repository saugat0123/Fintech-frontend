import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {

  private notificationSource = new BehaviorSubject<any>(0);
  currentNotification = this.notificationSource.asObservable();

  private notificationMessage = new BehaviorSubject<any>('null');
  currentNotificationMessage = this.notificationMessage.asObservable();

  constructor() { }

  changeNotification(notification: any) {
    this.notificationSource.next(notification);
  }
  setNotificationMessage(message: any) {
    this.notificationMessage.next(message);
  }
}
