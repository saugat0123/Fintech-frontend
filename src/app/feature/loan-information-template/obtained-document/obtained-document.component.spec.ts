import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtainedDocumentComponent } from './obtained-document.component';

describe('ObtainedDocumentComponent', () => {
  let component: ObtainedDocumentComponent;
  let fixture: ComponentFixture<ObtainedDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObtainedDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObtainedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
