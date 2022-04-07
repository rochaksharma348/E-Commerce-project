import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  categoryName: string;
  searchMode: boolean = false;
  previousSearchKeyword: string;

  //properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService, private cartService: CartService,
               private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousSearchKeyword != searchKeyword) {
      this.thePageNumber = 1;
    }

    this.previousSearchKeyword = searchKeyword;

    this.productService.getSearchProductsPaginate(this.thePageNumber - 1,
                                                  this.thePageSize, searchKeyword).
                                                  subscribe(this.processResults());
  }

  handleListProducts() {
    //check if id param is present or not
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.categoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.categoryName = "Books";
    }

    //check if we have different categoryId than previous
    //
    //NOTE: angular will reuse a component if it is currently being viewd (it will not create new component)
    //if we have different category then we will set the page number to 1

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`current category id: ${this.currentCategoryId}, current page no: ${this.thePageNumber}`);

    this.productService.getProductsListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).
    subscribe(this.processResults());
  }

  processResults() {
    return (data : any) => {
      this.products = data._embedded.products,
      this.thePageNumber = data.page.number + 1,
      this.thePageSize = data.page.size,
      this.theTotalElements = data.page.totalElements
    }
  }

  changePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem: CartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
