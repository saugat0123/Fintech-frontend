import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorageUtil} from '../../utils/local-storage-util';
import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(private router: Router, private modalService: NgbModal) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
    if (LocalStorageUtil.getStorage().at) {
      const linkList = LocalStorageUtil.getStorage().menus.filter(f => f.link === state.url);
      if (linkList.length > 0) {
        return true;
      }
      this.router.navigate(['home/error']);
      return false;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
