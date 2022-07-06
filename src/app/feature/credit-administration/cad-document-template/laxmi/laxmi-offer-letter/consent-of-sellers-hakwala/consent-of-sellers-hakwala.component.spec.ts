import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentOfSellersHakwalaComponent } from './consent-of-sellers-hakwala.component';

describe('ConsentOfSellersHakwalaComponent', () => {
  let component: ConsentOfSellersHakwalaComponent;
  let fixture: ComponentFixture<ConsentOfSellersHakwalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentOfSellersHakwalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentOfSellersHakwalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
