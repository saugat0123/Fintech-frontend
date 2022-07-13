import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDocumentViewComponent } from './security-document-view.component';

describe('SecurityDocumentViewComponent', () => {
  let component: SecurityDocumentViewComponent;
  let fixture: ComponentFixture<SecurityDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
