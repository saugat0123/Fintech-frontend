import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PledgeDeedFirstPrintComponent } from './pledge-deed-first-print.component';

describe('PledgeDeedFirstPrintComponent', () => {
  let component: PledgeDeedFirstPrintComponent;
  let fixture: ComponentFixture<PledgeDeedFirstPrintComponent>;

  beforeEach(waitForAsync(() => {
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
