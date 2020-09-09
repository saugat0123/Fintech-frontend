import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorDetailsComponent } from './guarantor-details.component';

describe('GuarantorDetailsComponent', () => {
  let component: GuarantorDetailsComponent;
  let fixture: ComponentFixture<GuarantorDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
