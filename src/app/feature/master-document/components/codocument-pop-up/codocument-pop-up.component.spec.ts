import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodocumentPopUpComponent } from './codocument-pop-up.component';

describe('CodocumentPopUpComponent', () => {
  let component: CodocumentPopUpComponent;
  let fixture: ComponentFixture<CodocumentPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodocumentPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodocumentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
