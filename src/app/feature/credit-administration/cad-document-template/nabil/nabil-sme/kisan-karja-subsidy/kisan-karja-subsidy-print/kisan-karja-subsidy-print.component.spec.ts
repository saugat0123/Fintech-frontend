import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KisanKarjaSubsidyPrintComponent } from './kisan-karja-subsidy-print.component';

describe('KisanKarjaSubsidyPrintComponent', () => {
  let component: KisanKarjaSubsidyPrintComponent;
  let fixture: ComponentFixture<KisanKarjaSubsidyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KisanKarjaSubsidyPrintComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KisanKarjaSubsidyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
