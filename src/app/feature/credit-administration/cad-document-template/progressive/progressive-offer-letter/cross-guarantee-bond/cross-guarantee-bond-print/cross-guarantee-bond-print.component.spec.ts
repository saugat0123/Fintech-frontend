import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossGuaranteeBondPrintComponent } from './cross-guarantee-bond-print.component';

describe('CrossGuaranteeBondPrintComponent', () => {
  let component: CrossGuaranteeBondPrintComponent;
  let fixture: ComponentFixture<CrossGuaranteeBondPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossGuaranteeBondPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossGuaranteeBondPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
