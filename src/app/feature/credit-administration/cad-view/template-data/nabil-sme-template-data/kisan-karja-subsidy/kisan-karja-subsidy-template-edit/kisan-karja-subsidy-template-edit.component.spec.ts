import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KisanKarjaSubsidyTemplateEditComponent } from './kisan-karja-subsidy-template-edit.component';

describe('KisanKarjaSubsidyTemplateEditComponent', () => {
  let component: KisanKarjaSubsidyTemplateEditComponent;
  let fixture: ComponentFixture<KisanKarjaSubsidyTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KisanKarjaSubsidyTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KisanKarjaSubsidyTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
