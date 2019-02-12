
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
import { RestApiService } from './rest-api.service';

@Injectable()
export class BasicInfoService {
   role :any;
  constructor(private http: HttpClient,
    private restApiService: RestApiService) { }

  getBasicInfo() {
    let basicInfo = this.restApiService.modifyRestUrl('v1/user/authenticated');
    return this.http.get(basicInfo.url, { headers: basicInfo.header });
     
  }


  getUsrRole() {
   let basicInfo = this.restApiService.modifyRestUrl('v1/user/role');
   return  this.http.get(basicInfo.url, { headers: basicInfo.header });
    
  }

  logout() {
    localStorage.removeItem("at");
    localStorage.clear();  
  
  }

}
