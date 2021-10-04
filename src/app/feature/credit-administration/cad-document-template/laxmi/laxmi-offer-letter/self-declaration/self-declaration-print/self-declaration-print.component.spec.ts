import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfDeclarationPrintComponent } from './self-declaration-print.component';

describe('SelfDeclarationPrintComponent', () => {
  let component: SelfDeclarationPrintComponent;
  let fixture: ComponentFixture<SelfDeclarationPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfDeclarationPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfDeclarationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
