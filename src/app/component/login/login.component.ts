import { Component, OnInit } from '@angular/core';
import { baseApi } from '../../shared-service/authentication/api-list.service';

import { Router } from '@angular/router';
import { RestApiService } from '../../shared-service/authentication/rest-api.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  spinner: boolean = false;
  public securityUrl = baseApi.tokenUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private restApiService: RestApiService



  ) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    
  });

  ngOnInit() {
  }

  loginClick(datavalue) {
    this.spinner=true;
    const data: { email: string, password: string } = datavalue.value;
    const datas = 'grant_type=password&username=' + data.email + '&password=' + data.password;
   this.http.post(this.securityUrl,datas,{headers:this.headers})
    .subscribe(
        (data:any) => {
           localStorage.setItem("at",data.access_token);
           localStorage.setItem("rt",data.refresh_token);
           localStorage.setItem("ty",data.token_type);
           localStorage.setItem("et",data.expires_in);
          
           this.router.navigate(['/home/dashboard']);
        },
        error => {
         
        
        }
    ); 

  }

}
