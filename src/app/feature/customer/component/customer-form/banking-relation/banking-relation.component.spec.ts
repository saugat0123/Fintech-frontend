import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingRelationComponent } from './banking-relation.component';

describe('BankingRelationComponent', () => {
  let component: BankingRelationComponent;
  let fixture: ComponentFixture<BankingRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankingRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
