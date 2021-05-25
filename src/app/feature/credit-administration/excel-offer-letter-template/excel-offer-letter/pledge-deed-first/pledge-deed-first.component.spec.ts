import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeDeedFirstComponent } from './pledge-deed-first.component';

describe('PledgeDeedFirstComponent', () => {
  let component: PledgeDeedFirstComponent;
  let fixture: ComponentFixture<PledgeDeedFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PledgeDeedFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgeDeedFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
