import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ReleaseInfoComponent } from "../../@core/release-info/release-info.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: "root",
})
export class VersionCheckService {
  reminder = false;
  frequency: number;
  interval;
  // this will be replaced by actual hash post-build.js
  private currentHash = "{{POST_BUILD_ENTERS_HASH_HERE}}";

  constructor(private http: HttpClient, private modal: NgbModal) {}

  /**
   * Checks in every set frequency the version of frontend application
   * param url
   * param {number} frequency - in milliseconds, defaults to 1 minute
   */
  public initVersionCheck(url) {
    const initialTimer = 1000 * 60 * 1;
    this.intervals(url, initialTimer);
    this.checkVersion(url);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * param url
   */
  private checkVersion(url) {
    // timestamp these requests to invalidate caches
    this.http.get(url).subscribe(
      (response: any) => {
        const hash = response.hash;
        const hashChanged = this.hasHashChanged(this.currentHash, hash);
        // If new version, do something
        if (hashChanged) {
          this.openForm(url);
        }
        // after clicking 'remind me later'
        if (this.reminder) {
          this.openForm(url);
        }
        // store the new hash so we wouldn't trigger versionChange again
        // only necessary in case you did not force refresh
        this.currentHash = hash;
      },
      (err) => {
        console.error(err, "Could not get version");
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
    if (!currentHash || currentHash === "{{POST_BUILD_ENTERS_HASH_HERE}}") {
      return false;
    }
    return currentHash !== newHash;
  }

  public openForm(url) {
    const options: NgbModalOptions = {
      backdrop: "static",
      keyboard: false,
    };

    const releaseComponent = this.modal.open(ReleaseInfoComponent, options);
    this.reminder = false;
    releaseComponent.componentInstance.emitService.subscribe((emmitedValue) => {
      this.reminder = emmitedValue;
      if (emmitedValue) {
        const timer = 1000 * 60 * 10;
        clearInterval(this.interval);
        this.intervals(url, timer);
      } else {
        const timer = 1000 * 60 * 1;
        clearInterval(this.interval);
        this.intervals(url, timer);
      }
    });
    releaseComponent.result.then(
      (data) => {},
      (reason) => {}
    );
  }

  public intervals(url, initialTimer) {
    this.interval = setInterval(() => {
      this.checkVersion(url);
    }, initialTimer);
  }
}
