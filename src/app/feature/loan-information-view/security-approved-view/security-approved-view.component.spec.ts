import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityApprovedViewComponent } from './security-approved-view.component';

describe('SecurityApprovedViewComponent', () => {
  let component: SecurityApprovedViewComponent;
  let fixture: ComponentFixture<SecurityApprovedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityApprovedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityApprovedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
