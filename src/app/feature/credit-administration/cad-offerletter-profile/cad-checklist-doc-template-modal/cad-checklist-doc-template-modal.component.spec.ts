import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CadChecklistDocTemplateModalComponent } from './cad-checklist-doc-template-modal.component';

describe('CadChecklistDocTemplateModalComponent', () => {
  let component: CadChecklistDocTemplateModalComponent;
  let fixture: ComponentFixture<CadChecklistDocTemplateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadChecklistDocTemplateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadChecklistDocTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
