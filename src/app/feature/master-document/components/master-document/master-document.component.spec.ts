import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDocumentComponent } from './master-document.component';

describe('MasterDocumentComponent', () => {
  let component: MasterDocumentComponent;
  let fixture: ComponentFixture<MasterDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
