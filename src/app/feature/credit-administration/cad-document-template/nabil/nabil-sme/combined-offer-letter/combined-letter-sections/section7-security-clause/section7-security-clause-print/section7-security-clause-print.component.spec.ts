import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section7SecurityClausePrintComponent } from './section7-security-clause-print.component';

describe('Section7SecurityClausePrintComponent', () => {
  let component: Section7SecurityClausePrintComponent;
  let fixture: ComponentFixture<Section7SecurityClausePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section7SecurityClausePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section7SecurityClausePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
