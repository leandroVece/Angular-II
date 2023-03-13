import { Component } from '@angular/core';
import { Product } from '../../models/product.model';
import { StoreService } from '../../services/store.service'
import { ProductsService } from '../../services/products.service'



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  myShoppingCart: Product[] = []
  products: Product[] = [];
  total = 0

  constructor(
    private storeService: StoreService,
    private producServices: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart()
  }

  ngOnInit(): void {
    this.producServices.getAllProduct().subscribe(
      data => this.products = data
    )
  }

  onAddToShoppingCart(product: Product) {
    //this.myShoppingCart.push(product);
    this.storeService.addProduct(product)
    this.total = this.storeService.getTotal();
  }
}
