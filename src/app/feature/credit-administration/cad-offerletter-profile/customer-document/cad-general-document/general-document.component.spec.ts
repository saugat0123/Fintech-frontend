import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDocumentComponent } from './general-document.component';

describe('GeneralDocumentComponent', () => {
  let component: GeneralDocumentComponent;
  let fixture: ComponentFixture<GeneralDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
