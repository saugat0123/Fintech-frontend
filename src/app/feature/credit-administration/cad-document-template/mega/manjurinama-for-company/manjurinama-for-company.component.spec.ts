import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManjurinamaForCompanyComponent } from './manjurinama-for-company.component';

describe('ManjurinamaForCompanyComponent', () => {
  let component: ManjurinamaForCompanyComponent;
  let fixture: ComponentFixture<ManjurinamaForCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManjurinamaForCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManjurinamaForCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
