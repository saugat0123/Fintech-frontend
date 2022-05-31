import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KisanKarjaSubsidyComponent } from './kisan-karja-subsidy.component';

describe('KisanKarjaSubsidyComponent', () => {
  let component: KisanKarjaSubsidyComponent;
  let fixture: ComponentFixture<KisanKarjaSubsidyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KisanKarjaSubsidyComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KisanKarjaSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
