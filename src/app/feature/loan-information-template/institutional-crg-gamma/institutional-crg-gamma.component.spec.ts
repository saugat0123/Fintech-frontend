import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionalCrgGammaComponent } from './institutional-crg-gamma.component';

describe('InstitutionalCrgGammaComponent', () => {
  let component: InstitutionalCrgGammaComponent;
  let fixture: ComponentFixture<InstitutionalCrgGammaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionalCrgGammaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionalCrgGammaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
