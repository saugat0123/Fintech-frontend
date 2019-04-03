import { Injectable } from '@angular/core';

@Injectable()
export class ApiListService {

    constructor() {
    }

}

export enum baseApi {

     tokenUrl = 'http://localhost:8086/oauth/token',
    restUrl = 'http://localhost:8086',


}
