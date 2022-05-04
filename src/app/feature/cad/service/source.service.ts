import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SourceService {
  static API = 'v1/credit';

  constructor(private http: HttpClient) { }


}
