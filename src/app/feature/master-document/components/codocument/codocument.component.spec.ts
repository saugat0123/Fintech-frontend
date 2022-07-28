import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodocumentComponent } from './codocument.component';

describe('CodocumentComponent', () => {
  let component: CodocumentComponent;
  let fixture: ComponentFixture<CodocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
