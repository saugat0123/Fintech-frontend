import {ElementRef, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollNavigationService {

  constructor() { }

  public scrollNavigateTo(elementRef: ElementRef): void {
    elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
  }
}
