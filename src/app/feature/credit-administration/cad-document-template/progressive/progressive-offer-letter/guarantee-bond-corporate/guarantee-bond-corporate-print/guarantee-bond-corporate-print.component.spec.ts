import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeBondCorporatePrintComponent } from './guarantee-bond-corporate-print.component';

describe('GuaranteeBondCorporatePrintComponent', () => {
  let component: GuaranteeBondCorporatePrintComponent;
  let fixture: ComponentFixture<GuaranteeBondCorporatePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeBondCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeBondCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
