import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitViewComponent } from './site-visit-view.component';

describe('SitevisitViewComponent', () => {
  let component: SitevisitViewComponent;
  let fixture: ComponentFixture<SitevisitViewComponent>;

  beforeEach(async(() => {
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
