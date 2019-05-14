import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleRequestsComponent } from './eligible-requests.component';

describe('EligibleRequestsComponent', () => {
  let component: EligibleRequestsComponent;
  let fixture: ComponentFixture<EligibleRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibleRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
