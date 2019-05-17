import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonEligibleRequestsComponent } from './non-eligible-requests.component';

describe('NonEligibleRequestsComponent', () => {
  let component: NonEligibleRequestsComponent;
  let fixture: ComponentFixture<NonEligibleRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonEligibleRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonEligibleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
