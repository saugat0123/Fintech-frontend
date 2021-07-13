import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GuaranteeBondPersonalPrintComponent} from './guarantee-bond-personal-print.component';

describe('GuaranteeBondPersonalPrintComponent', () => {
  let component: GuaranteeBondPersonalPrintComponent;
  let fixture: ComponentFixture<GuaranteeBondPersonalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuaranteeBondPersonalPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeBondPersonalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
