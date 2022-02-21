import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPaperChecklistComponent } from './product-paper-checklist.component';

describe('ProductPaperChecklistComponent', () => {
  let component: ProductPaperChecklistComponent;
  let fixture: ComponentFixture<ProductPaperChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPaperChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPaperChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
