import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateDocumentComponent } from './template-document.component';

describe('TemplateDocumentComponent', () => {
  let component: TemplateDocumentComponent;
  let fixture: ComponentFixture<TemplateDocumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
