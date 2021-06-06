import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeBondPersonalComponent } from './guarantee-bond-personal.component';

describe('GuaranteeBondPersonalComponent', () => {
  let component: GuaranteeBondPersonalComponent;
  let fixture: ComponentFixture<GuaranteeBondPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaranteeBondPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaranteeBondPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
