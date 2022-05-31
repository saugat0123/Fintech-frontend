import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section10SecurityDocumentsComponent } from './section10-security-documents.component';

describe('Section10SecurityDocumentsComponent', () => {
  let component: Section10SecurityDocumentsComponent;
  let fixture: ComponentFixture<Section10SecurityDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section10SecurityDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section10SecurityDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
