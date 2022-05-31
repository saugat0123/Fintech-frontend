import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastService} from '../../@core/utils';
import {Alert, AlertType} from '../../@theme/model/Alert';
import {delay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VersionCheckService {
    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

    constructor(private http: HttpClient,
                private toastService: ToastService) {
    }

    /**
     * Checks in every set frequency the version of frontend application
     * param url
     * param {number} frequency - in milliseconds, defaults to 1 minute
     */
    public initVersionCheck(url, frequency = 1000 * 60 * 1) {
        setInterval(() => {
            this.checkVersion(url);
        }, frequency);
        this.checkVersion(url);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * param url
     */
    private checkVersion(url) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime())
            .subscribe(
                (response: any) => {
                    const hash = response.hash;
                    const hashChanged = this.hasHashChanged(this.currentHash, hash);

                    // If new version, do something
                    if (hashChanged) {
                        this.toastService.show(new Alert(AlertType.WARNING,
                            'New version is released. Browser will refresh automatically in 5 seconds!'));
                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                    }
                    // store the new hash so we wouldn't trigger versionChange again
                    // only necessary in case you did not force refresh
                    this.currentHash = hash;
                },
                (err) => {
                    console.error(err, 'Could not get version');
                }
            );
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * param currentHash
     * param newHash
     * returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }
        return currentHash !== newHash;
    }
}
