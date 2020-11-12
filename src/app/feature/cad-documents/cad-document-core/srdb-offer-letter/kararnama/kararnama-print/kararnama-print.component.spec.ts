import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KararnamaPrintComponent } from './kararnama-print.component';

describe('KararnamaPrintComponent', () => {
  let component: KararnamaPrintComponent;
  let fixture: ComponentFixture<KararnamaPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KararnamaPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KararnamaPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
