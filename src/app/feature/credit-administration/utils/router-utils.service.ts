import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {RouteConst} from '../model/RouteConst';

@Injectable({
  providedIn: 'root'
})
export class RouterUtilsService {

  constructor(
      private router: Router
  ) {
  }

  reloadRoute(submitUrl: string, returnUrl: string) {
    this.router.navigateByUrl(submitUrl).then(value => {
      if (value) {
        this.router.navigate([returnUrl], {
        });
      }
    });
  }

  reloadCadProfileRoute(cadDocumentId) {
    this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
      if (value) {
        this.router.navigate([RouteConst.ROUTE_OFFER_PROFILE],
            {
              queryParams: {
                cadDocumentId: cadDocumentId,
              }
            });
      }
    });
  }
}
