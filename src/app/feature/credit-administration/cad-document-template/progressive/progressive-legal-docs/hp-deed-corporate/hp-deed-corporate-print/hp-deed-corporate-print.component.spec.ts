import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpDeedCorporatePrintComponent } from './hp-deed-corporate-print.component';

describe('HpDeedCorporatePrintComponent', () => {
  let component: HpDeedCorporatePrintComponent;
  let fixture: ComponentFixture<HpDeedCorporatePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpDeedCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpDeedCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
