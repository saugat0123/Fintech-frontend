import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDocumentComponent } from './security-document.component';

describe('SecurityDocumentComponent', () => {
  let component: SecurityDocumentComponent;
  let fixture: ComponentFixture<SecurityDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
