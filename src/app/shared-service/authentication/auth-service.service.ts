import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {


    isAuthenticated() {
        const accessToken = localStorage.getItem('at');
        const rToken = localStorage.getItem('rt');
        const accessTokenTime = localStorage.getItem('ate');
        //   const bInfo = localStorage.getItem('userrole');

        if (accessToken) {
            return true;
        } else {
            return false;
        }
    }

    roleCheck() {
        const userinfo = JSON.parse(localStorage.getItem('userrole'));
        const userDepartment: string = userinfo.department;
        if (userDepartment) {
            return userDepartment;
        } else {
            return false;
        }
    }

}
