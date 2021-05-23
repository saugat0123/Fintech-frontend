import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeDeedFirstPrintComponent } from './pledge-deed-first-print.component';

describe('PledgeDeedFirstPrintComponent', () => {
  let component: PledgeDeedFirstPrintComponent;
  let fixture: ComponentFixture<PledgeDeedFirstPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PledgeDeedFirstPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgeDeedFirstPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
