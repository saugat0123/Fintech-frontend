import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorAdderComponent } from './guarantor-adder.component';

describe('GuarantorAdderComponent', () => {
  let component: GuarantorAdderComponent;
  let fixture: ComponentFixture<GuarantorAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
