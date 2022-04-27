import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleBankingComponent } from './multiple-banking.component';

describe('MultipleBankingComponent', () => {
  let component: MultipleBankingComponent;
  let fixture: ComponentFixture<MultipleBankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleBankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
