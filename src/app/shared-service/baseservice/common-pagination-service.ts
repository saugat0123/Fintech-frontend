import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pageable } from './common-pageable';

@Injectable({
  providedIn: 'root'
})
export class CommonPageService {
    pageable : Pageable = new Pageable();

  constructor() {
}

getPageable(response): Pageable{
    this.pageable.first = response.first;
    this.pageable.last = response.last;
    this.pageable.number = response.number;
    this.pageable.numberOfElements = response.numberOfElements;
    this.pageable.totalPages = response.totalPages;
    this.pageable.size = response.size;
    this.pageable.totalElements = response.totalElements;
    if(this.pageable.numberOfElements < 10){
      this.pageable.numberOfElements=10;
    }
    this.pageable.number = response.number+1;
 
    return this.pageable;

}

}
