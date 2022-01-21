import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityApprovedFormComponent } from './security-approved-form.component';

describe('SecurityApprovedFormComponent', () => {
  let component: SecurityApprovedFormComponent;
  let fixture: ComponentFixture<SecurityApprovedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityApprovedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityApprovedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
