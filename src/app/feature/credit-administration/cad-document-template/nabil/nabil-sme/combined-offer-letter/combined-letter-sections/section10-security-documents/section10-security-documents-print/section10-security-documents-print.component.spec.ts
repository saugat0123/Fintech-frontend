import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section10SecurityDocumentsPrintComponent } from './section10-security-documents-print.component';

describe('Section10SecurityDocumentsPrintComponent', () => {
  let component: Section10SecurityDocumentsPrintComponent;
  let fixture: ComponentFixture<Section10SecurityDocumentsPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section10SecurityDocumentsPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section10SecurityDocumentsPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
