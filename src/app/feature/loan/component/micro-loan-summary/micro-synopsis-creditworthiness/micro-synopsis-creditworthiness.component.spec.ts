import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroSynopsisCreditworthinessComponent } from './micro-synopsis-creditworthiness.component';

describe('MicroSynopsisCreditworthinessComponent', () => {
  let component: MicroSynopsisCreditworthinessComponent;
  let fixture: ComponentFixture<MicroSynopsisCreditworthinessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroSynopsisCreditworthinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroSynopsisCreditworthinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
