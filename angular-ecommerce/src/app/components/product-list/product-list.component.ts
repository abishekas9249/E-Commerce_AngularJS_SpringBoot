import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId:number=1;
  currentCategoryName!: string;
  searchMode:boolean=false;
  thePreviousKeyword:string='';

  //Pagination 
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;

  constructor(private productService:ProductService,private route:ActivatedRoute,private cartService:CartService){}

  ngOnInit(){
    this.route.paramMap.subscribe(()=>{this.listProducts();
    });
  }

  listProducts(){
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;
    if(theKeyword!=this.thePreviousKeyword){
      this.thePageNumber=1;
    }
    this.thePreviousKeyword=theKeyword;
    this.productService.searchProductsPaginate(this.thePageNumber-1,this.thePageSize,theKeyword).subscribe(this.processResult());
  }
  
  processResult(){
    return (data:any)=>{
      this.products=data._embedded.products;
      this.thePageNumber=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements=data.page.totalElements;
    }
  }

  updatePageSize(theSize:string){
    this.thePageSize=+theSize;
    this.thePageNumber=1;
    this.listProducts();
  }

  handleListProducts(){
    //check "id"  parameter is available
    const hasCategoryId:boolean=this.route.snapshot.paramMap.has("id");
    if(hasCategoryId){
      //get the "id" parameter string and convert the string to number using the "+" symbol.
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      this.currentCategoryName= this.route.snapshot.paramMap.get("name")!;
    }
    else{
      this.currentCategoryId=1;
      this.currentCategoryName="Books";
    }

    if(this.previousCategoryId!=this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId=this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber-1,this.thePageSize,this.currentCategoryId).subscribe(this.processResult());
  }

  addToCart(product: Product) {
    console.log(`Adding to Cart :  ${ product.name}, ${product.unitPrice.toFixed(2)}`)
    const theCartItem=new CartItem(product);
    this.cartService.addToCart(theCartItem);  
  }
}
