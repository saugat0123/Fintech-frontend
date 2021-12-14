import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentChecklistViewLiteComponent } from './document-checklist-view-lite.component';

describe('DocumentChecklistViewLiteComponent', () => {
  let component: DocumentChecklistViewLiteComponent;
  let fixture: ComponentFixture<DocumentChecklistViewLiteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentChecklistViewLiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentChecklistViewLiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
