import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankGuaranteeSampleComponent } from './bank-guarantee-sample.component';

describe('BankGuaranteeSampleComponent', () => {
  let component: BankGuaranteeSampleComponent;
  let fixture: ComponentFixture<BankGuaranteeSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankGuaranteeSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankGuaranteeSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
