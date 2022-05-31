import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section9OtherClausePrintComponent } from './section9-other-clause-print.component';

describe('Section9OtherClausePrintComponent', () => {
  let component: Section9OtherClausePrintComponent;
  let fixture: ComponentFixture<Section9OtherClausePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section9OtherClausePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section9OtherClausePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
