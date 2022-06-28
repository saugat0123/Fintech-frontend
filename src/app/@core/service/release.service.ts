import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { SwUpdate } from "@angular/service-worker";
import { interval } from "rxjs";
import { ReleaseInfoComponent } from "../release-info/release-info.component";

@Injectable({
  providedIn: "root",
})
export class ReleaseService {
  constructor(public updates: SwUpdate, private modalService: NgbModal) {
    if (this.updates.isEnabled) {
      interval(1000).subscribe(() =>
        this.updates
          .checkForUpdate()
          .then(() => console.log("checking for updates"))
      );
    }
  }

  public checkForNewRelease(): void {
    console.log("checking for new");
    this.updates.available.subscribe((event) => this.promptUser());
  }

  private promptUser(): void {
    console.log("updating to new version");
    this.updates.activateUpdate().then(() => {
      const option: NgbModalOptions = {
        backdrop: "static",
        keyboard: false,
        centered: true,
        animation: true,
      };
      this.modalService.open(ReleaseInfoComponent, option);
    });
  }
}
