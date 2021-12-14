import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SitevisitViewComponent } from './site-visit-view.component';

describe('SitevisitViewComponent', () => {
  let component: SitevisitViewComponent;
  let fixture: ComponentFixture<SitevisitViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SitevisitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
