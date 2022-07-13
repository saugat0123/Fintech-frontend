import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroSynopsisCreditworthinessComponent } from './micro-synopsis-creditworthiness.component';

describe('MicroSynopsisCreditworthinessComponent', () => {
  let component: MicroSynopsisCreditworthinessComponent;
  let fixture: ComponentFixture<MicroSynopsisCreditworthinessComponent>;

  beforeEach(async(() => {
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
