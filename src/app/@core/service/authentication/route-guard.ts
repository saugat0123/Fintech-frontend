import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorageUtil} from '../../utils/local-storage-util';
import {Injectable} from '@angular/core';
import {ObjectUtil} from '../../utils/ObjectUtil';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
    if (LocalStorageUtil.getStorage().at) {
      const mapLink = [];
      if (!ObjectUtil.isEmpty(LocalStorageUtil.getStorage().menus)) {
        LocalStorageUtil.getStorage().menus.forEach(f => {
          mapLink.push(f.link);
          if (!ObjectUtil.isEmpty(f.children)) {
            if (f.children.length > 0) {
              f.children.forEach(c => {
                mapLink.push(c.link);
              });
            }
          }
        });
        let url = state.url;
        if (state.url.toString().includes('?')) {
          url = state.url.split('?')[0];
        }
        const linkList = mapLink.filter(f => f === url);
        if (linkList.length > 0) {
          return true;
        }
        this.router.navigate(['home/error']);
        return false;
      } else {
        window.location.reload();
      }
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
