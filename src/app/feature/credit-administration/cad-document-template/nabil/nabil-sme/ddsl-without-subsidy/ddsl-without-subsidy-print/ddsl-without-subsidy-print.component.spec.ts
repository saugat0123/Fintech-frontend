import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdslWithoutSubsidyPrintComponent } from './ddsl-without-subsidy-print.component';

describe('DdslWithoutSubsidyPrintComponent', () => {
  let component: DdslWithoutSubsidyPrintComponent;
  let fixture: ComponentFixture<DdslWithoutSubsidyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdslWithoutSubsidyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdslWithoutSubsidyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
