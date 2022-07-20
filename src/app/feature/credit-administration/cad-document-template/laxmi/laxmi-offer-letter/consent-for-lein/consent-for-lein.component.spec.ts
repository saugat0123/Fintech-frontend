import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentForLeinComponent } from './consent-for-lein.component';

describe('ConsentForLeinComponent', () => {
  let component: ConsentForLeinComponent;
  let fixture: ComponentFixture<ConsentForLeinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentForLeinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentForLeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
