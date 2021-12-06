import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KisanKarjaSubsidyTemplateDataComponent } from './kisan-karja-subsidy-template-data.component';

describe('KisanKarjaSubsidyTemplateDataComponent', () => {
  let component: KisanKarjaSubsidyTemplateDataComponent;
  let fixture: ComponentFixture<KisanKarjaSubsidyTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KisanKarjaSubsidyTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KisanKarjaSubsidyTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
