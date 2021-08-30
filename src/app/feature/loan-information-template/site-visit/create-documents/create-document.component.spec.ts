import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocumentsComponent } from './create-document.component';

describe('CreateDocumentsComponent', () => {
  let component: CreateDocumentsComponent;
  let fixture: ComponentFixture<CreateDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
