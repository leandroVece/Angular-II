# Angular parte 2

## ¿Que es un componente?

Un componente es una pieza de software con una responsabilidad única y una estructura y funcionalidad determinada que puede ser reutilizable. De esta manera somos capaces de dividir la aplicacion de forma escalable.

Los componentes en angular que se crean de manera predetermianda son:
- El archivo .html que será el template que tu componente utilizará.
- El archivo .ts que contiene el código TypeScript y la lógica.
- El archivo .css que contiene los estilos.
- Si escogiste trabajar con un preprocesador de CSS, este archivo puede ser .scss, .sass o .less.
- El archivo .spec.ts que contiene el código de las pruebas unitarias que puedes escribir para automatizar el testing en tu componente.

Para crearlo comencemos con crear un nuevo proyecto con:

    ng new my-app

Despues de crear nuestro proyecto podemos entrar en vsc y abrir la terminal justo en la carpeda donde esta nuestro proyecto y escribir la siguiente linea de codigo.

    ng g c test-name

sin embargo, como lo profecionales que somos, crearemos nuestro componentes separados en carpetas para una mejor organizacion de trabajo. por ejemplo

    ng g c components/img

Ahora que esta creado podemos invocarlo, para ello vamos a eliminar todo el contenido de nuestros app.component.html y agregaremos la siguiente linea de codigo.

    <app-img></app-img>

De esta manera podemos encontrar que nuestros componentes se comportan como un tag comun. 

## Uso de Inputs

Comencemos con una comunicacion entre padre a hijo. Si nosotros agregacemos un titulo dentro de nuestro componente hijo para que este se reflejara en el padre el resultado seria el siguiente.

**img.components.ts**

    export class ImgComponent {
      img: string = 'Soy el hijo';
    }

**img.components.html**

    <h1>{{img}}</h1>

Al correr el programa nos damos cuenta que lo que estaba en el hijo se feflejo en el archivo app. pero y si quisiera enviar informacion del padre para que se reflejara en el hijo.

Para ello necesitamos importar el decorador Input

**img.components.ts**

      import { Component, Input } from '@angular/core';

      @Component({
        selector: 'app-img',
        templateUrl: './img.component.html',
        styleUrls: ['./img.component.scss']
      })


      export class ImgComponent {

        @Input() img: string = 'Soy el hijo';
      }

@input indica a un componente que puede recibir un valor desde el componente padre, por eso debemos agregarle el decorador @input a la propiedad que deseamos controlar como esta en el ejemplo. Luego en el padre podremos enviar el valor que queremos que ellos reciban.

**app.components.html**

    <app-img img="Soy el padre"></app-img>  

Hagamos este ejemplo un poco mas entretenido haciendo que cambie dinamicamente.Para ello agreguemos el decorador de FormModule como lo hicimos en el [primer tutorial](https://github.com/leandroVece/Angular) y luego gregaremos una varialble nueva que pueda en la clase App component que pueda almacenar los cambios que vamos a enviar

**app.components.html**

    <input type="text" [(ngModel)]="imgParent" />
    <app-img [img]="imgParent"></app-img>

**app.components.ts**

    export class AppComponent {
      title = 'store';
      imgParent = "";
    }

Luego solo queda probar los resultados.

Pero creamos unicialmente este componente para que renderizara imagenes ¿verdad? bueno hagamos las modificaciones.

    <h1>Imagen traida desde {{img}}</h1>
    <p>img works!</p>
    <img [src]="img" alt="" width="200px">

Con esto podremos enviar la url de una imagen y dinamicamente sera cargada. Si se sienten audaces ¿porque no intentar poner una condicion para mostrar una imagen por defecto mientras no tenga contenido?


## Uso de Outputs

Los outputs nos vindaran la capacidad de enviar informacion desde los hijos a los elementos padres.

Si hiciste el reto siguiendo el primer tutorial o por conocimientos propios, muy posiblemente pensaste en un simple condicional. Si ese fue el caso, tu trabajo esta bastante buen, pero podemos darle mas robustes.

**img.components.html**

    <h1>Imagen traida desde {{img}}</h1>
    <p>img works!</p>
    <img [src]="img" (error)="imgError()" alt="" width="200px">

**img.components.ts**

con la nueva funcion que agregamos capturamos si tenemos un error en la informacion que el input nos proporciona y si es asi devolvemos un valor por defecto.

    export class ImgComponent {
    ...
      imgError() {
        this.img = this.iamgeDefaut;
        console.log(this.img)
      }
    }

Pero ¿como envio esta informacion al padre? Primero tendremos que importar dos decoradores mas Outputs y EvenEmitter, luego crearemos una nuev funcion que capute el evento de la siguiente manera

**img.components.ts**

    import { Component, Input, Output, EventEmitter } from '@angular/core';

    ...

    export class ImgComponent {
      
      ...

    @Output() loaded = new EventEmitter<string>()

      ...

      imgLoaded() {
        this.loaded.emit(this.img)
      }
    }

**img.components.html**

    <img [src]="img" (load)="imgLoaded()" (error)="imgError()" alt="" width="200px">

Con esto enviaremos string a nuestro elemento padre (tambien es posible enviar otros tipos de datos y no solamente string). Y para hacer que nuestro padre escuche la vos del hijo necesitamos hacer lo siguiente:

**app.components.html**

    <app-img (loaded)="onLoaded($event)" [img]="imgParent"></app-img>

**app.components.html**

    export class AppComponent {
    ...
      onLoaded(img: string) {
        console.log(img)
      }

    }

como pueden ver, nunca he agregado la variable "img", pero como la he traido, esta me devuelve el valor de contiene esa variable

Comencemos ahora a hacer un programa un poco mas realista y complejo usaremos una store como ejemplo. Para ello comencemos creando un nuevo componente llamado Product

    ng g c components/product

ahora vamos a el archivo html de nuestro nuevo componente y creemos una estructura para estos productos.

    <img [src]="product.img" alt="">
    <h2>${{product.price}}</h2>
    <p>{{product.name}}</p>


Que datos cargar en su objecto productos se los dejare a cada uno. despues de crear nuestro objeto, una buena practica es crear una interface que va a determinar el comportamiento de nuestro objeto

Creemos una nueva carpeta llamada Models y dentro un archivo llamado product.models.ts

    export interface Product {
      id: string,
      name: string,
      price: number,
      img: string
    }

Para importar nuestra interface, es lo mismo que importar una funcion en Js solo lenemos que llamarla con la clausula import.

    import { Product } from '../../models/product.model';

Luego en el archivo TS de nuestro componente hacemos que herede de la siguiente manera

    product: Product = {
        id: '',
        name: '',
        img: '',
        price: 0
      }

Con esto deberia funcionar pero al igual que en las otras ocaciones, no estamos buscando que el hijo se encargue de la recoleccion de datos, por lo que vamos a hacer que el padre envie los datos y el hijo solo los renderice.

Entences vamos a TS de componente app y creamos un array de productos, no sin olvidarnos importar la interface.

    export class AppComponent {
      ...
     products: Product[] = [{
        id: '1',
        name: 'Samsung Galaxy A13 128GB',
        img: 'https://tienda.movistar.com.ar/media/catalog/product/cache/1d01ed3f1ecf95fcf479279f9ae509ad/a/1/a13-negro-frente_1.png',
        price: 67999,

      }, {
        id: '2',
        name: 'Motorola Moto G42',
        img: 'https://tienda.movistar.com.ar/media/catalog/product/cache/1d01ed3f1ecf95fcf479279f9ae509ad/m/o/motog42-rosa-frente_1_1.png',
        price: 76999
      }, {
        id: '3',
        name: 'Motorola Moto G32',
        img: 'https://tienda.movistar.com.ar/media/catalog/product/cache/1d01ed3f1ecf95fcf479279f9ae509ad/f/r/frente_22_1.png',
        price: 67999
      }
      ];
    }

Luego en nuestro html del mismo componente iteraremos nuestro array, le enviaremos los datos que hemos estado enviadndo y dejamos que el programa haga su magia.

    <app-product [product]="product" *ngFor="let product of products"></app-product>

## Ciclo de vida de componentes

Un componente pasa por varias etapas en su ciclo de vida. A través de hooks, puedes realizar una determinada acción cuando el componente es inicializado, cuando se dispara un evento, cuando se detecta un cambio, cuando el componente es destruido, etc.


Para hacer un super resumen se podria resumir el ciclo en:
- Constructor: Corre cuando se crea una instancia
- ngOnChanges : corre antes y durante en el render, siemrpe que detecte cambios en el Input, está para eso, para detectar los cambios.
- ngOnInit: corre antes pero tiene la condicione que solo correo una vez. Este lugar se deben correr eventos asincronos.
- ngAfcterViewInit: corre cuando los hijos de ese componentes se han renderizado.
- NgOnDestroy: Corre cuando se elimina el componente.

Los hooks de ciclo de vida de Angular, son interfaces que tienen que importarse desde @angular/core para implementarlos en la clase y así detectar los cambios en cada evento.

Para verlo mejor usemos el componente img que creamos como ejemplo y veamoslo en accion.

    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { OnInit, AfterContentInit, OnDestroy } from '@angular/core';

    @Component({
      selector: 'app-img',
      templateUrl: './img.component.html',
      styleUrls: ['./img.component.scss']
    })


    export class ImgComponent implements OnInit, AfterContentInit, OnDestroy {

      @Input() img: string = 'Soy el hijo';
      iamgeDefaut: string = "https://placeimg.com/640/480/nature"
      @Output() loaded = new EventEmitter<string>()

      constructor() {
        console.log('1. Primero sucederá esto');
      }

      ngOnInit(): void {
        console.log('2. Luego esto');
      }

      ngAfterContentInit(): void {
        console.log('3. Seguido de esto');
      }

      ngOnDestroy(): void {
        console.log('4. Finalmente esto (cuando el componente sea destruido)');
      }

      imgError() {
        this.img = this.iamgeDefaut;
        //console.log(this.img)
      }

      imgLoaded() {
        this.loaded.emit(this.img)
      }
    }

Aunque esta informacion es muy resumida, sigue siendo clave para entender el funcionamiento en Angular. Entre estos hooks ngOnDestroy() y SetInput tiene una importancia clave para el cuidado de nuestra aplicación. Su funcionalidad más importante es la liberación de espacio en memoria de variables para que no se acumule. Si esto llegara a suceder en tu aplicación, la misma podría volverse lenta y tosca a medida que toda la memoria del navegador es ocupada.


////********************////

## divicion de tareas

Teniendo esto en cuenta continuemos con el trabajo. Aunque ahora mismo nuestro componente product tiene la funcion de tomar una lista y mapear. Podemos dividir su trabajo de una manera mas eficiente.

Para ello vamos a crear un nuevo componente que se encargara de capturar la lista de productos.

    ng g c components/products

¿Porque hacer esto? cuando tenemos que modificar elementos de nuestro codigo, dividirlo para tratarlo como entidades separadas nos proporciona una gran ventanja en muchas maneras, ya sea para debugear codigo o darle estilos.

Entonces, traslademos nuestra lista de productos a nuestro nuevo archivo TS y creemos llamemos en el archivo app a nuestro nuevo componente.

**app.componente.html**

    <app-products></app-products>

**pruducts.componente.html**

    <div class="product--grid">
      <app-product [product]="product" *ngFor="let product of products"></app-product>
    </div>

>Nota: no crea que lo hacemos simplemente por hacer. normalmente el componente app tiene una gran cantidad de elementos, entre los mas comunes el header y footer por lo que mientras mas grande es la aplicacion mas relevancia toma la divicion de trabajo.


Luego podemos agregar un poco de estilo.

    .products--grid {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    // tablets
    @media screen and (min-width: 40em) and (max-width: 63.9em) {
      .products--grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 15px;
      }
    }

    // web
    @media screen and (min-width: 64em) {
      .products--grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 15px;
      }
    }

Para el resto de los estilos lo dejo a la imaginacion de cada uno. La idea de tener tantos componente es que cada componente modifique lo que es propio de un componente. por ejemplo. Creamos un componente img. entonces ese componente deberia ser el componente que modifique las imagenes "dentro de nuestra lista productos".

Si mas adelante creo otro componente con otra imagen, El componete img no deberia modificar a mi segundo componente.

Explicado esto avancemos y creemos un menu.

    $ ng g c components/nav

**html**

    <header class="header">
      <a href="#" class="logo">CompanyLogo</a>
      <div class="header-right">
        <a href="#">Home</a>
        <a class="active" href="#">Catalogo</a>
        <a href="#">About</a>
      </div>
    </header>

**css**

    .header {
      overflow: hidden;
      background-color: #f1f1f1;
      padding: 20px 10px;

      a {
        float: left;
        color: black;
        text-align: center;
        padding: 12px;
        text-decoration: none;
        font-size: 18px;
        border-radius: 4px;

        &.logo {
          font-size: 25px;
          font-weight: bold;
        }
      }

      a:hover {
        background-color: #ddd;
        color: black;
      }

      a.active {
        background-color: dodgerblue;
        color: white;
      }

      .header-right {
        float: right;
      }
    }

    /* Header Mobile */
    @media screen and (max-width: 512px) {
      .header {
        a {
          float: none;
          display: block;
          text-align: left;
        }

        .header-right {
          float: none;
        }
      }
}

** app.component.html**

    <app-nav></app-nav>
    <app-products></app-products>

Con esto vamos entendiendo podemos entender un poco mas la division del trabajo. dicho todo esto, te dejo el reto. Crea un nuevo componente que tendra un estilo diferente y solo se mostrara para versiones moviles o crea el estilo y la logica para que el diseño cambie con el tamaño de la pantalla.

Con lo aprendido, agreguemos la opcion de agregar carrito a nuestra Aplicacion. para ello vamos a tener que enviar informacion desde el Elemento hijo (product) a nuestro elemento padre (products)


    import { Component, Input, Output, EventEmitter } from '@angular/core';
    import { Product } from '../../models/product.model';

    export class ProductComponent {
      ...
      @Output() addedPrrduct = new EventEmitter<Product>()

      addTocart() {
        this.addedPrrduct.emit(this.product)
      }
    }

**html**

    <button (click)="addTocart()">Add cart</button>

Ahora que enviamos informacion, tenemos que crear la funcion de escucha en nuestro componente padre.

    <div class="products--grid">
      <app-product [product]="product" *ngFor="let product of products"
        (addedProduct)="onAddToShoppingCart($event)"></app-product>
    </div>

**TS**

    export class ProductsComponent {
      ...
      onAddToShoppingCart(product: Product) {
          console.log(product)
        }
    }

Ahora que recibimos y comprobamos que recibimos los botones podemos capturarlo en un nuevo array y guardarlo para su posterios uso.
**TS**

    export class ProductsComponent {
       myShoppingCart: Product[] = []
      ...
      onAddToShoppingCart(product: Product) {
          this.myShoppingCart.push(product);
          console.log(this.myShoppingCart)
        }
    }

Todo hasta ahora es muy facil ¿verdad? con esto te dejo otro reto el cual seria hacer andar esta nueva estructura.

    <p>Cantidad de productos comprados: {{myShoppingCart.length}}</p>
    <p>Valor todal de la compra: ${{total}}</p>
    <div class="products--grid">
      <app-product [product]="product" *ngFor="let product of products"
        (addedProduct)="onAddToShoppingCart($event)"></app-product>
    </div>

## Servicios

Un servicio es la forma que utiliza Angular para modular una aplicación y crear código reutilizable. Con el CLI de Angular, crea un servicio fácilmente con el comando ng generate service test-name o en su manera corta

     ng g s test-name.

Dicho comando creará dos archivos:
- test-name.service.ts
- test-name.service.spec.ts

Ahora que lograste completar el reto, podemos migrar la logica del componente a nuestro servicios para dejar que todo lo relacionado a la logica sea opcupado de por nuestros servicios y solo dejar el renderizados a nuestros componentes.

Para ello vamos a ir a nuestro archivo Ts de nuestro servicio e inportaremos el objeto que trabajaremos.

    import { Injectable } from '@angular/core';
    import { Product } from '../models/product.model';

    @Injectable({
      providedIn: 'root'
    })
    export class StoreService {
      myShoppingCart: Product[] = []
      constructor() { }

      addProduct(product: Product) {
       ...
      }

      getTotal() {
        ...
      }
    }

Ahora solo necesitamos inyectar este servicio nuevo en nuestro componente padre Products. para ello importaremos el servicios, crearemos un constructor en el caso de no tenerlo y lo agregaremos.

**TS**

    export class ProductsComponent {
      ...

      constructor(private storeService: StoreService) { }

      onAddToShoppingCart(product: Product) {
        this.storeService.addProduct(product)
        this.total = this.storeService.getTotal();
      }
    }

Ahora para agragarle una capa de robustes extra a nuestro programa crearemos un metodo getter para aceder a nuestro servicio.

**TS**

    export class StoreService {
      private myShoppingCart: Product[] = []
      ...
      getShoppingCart() {
        return this.myShoppingCart
      }
    }

**TS products**

    export class ProductsComponent {

      myShoppingCart: Product[] = []
      total = 0

      constructor(private storeService: StoreService) {
        this.myShoppingCart = this.storeService.getShoppingCart()
      }

      ...
    }

## Inyeccion de dependencia

Inyección de Dependencias (Dependency Injection o DI) es un patrón de diseño en el que una clase requiere instancias de una o más clases y en vez de generarlas dentro de su propio constructor, las recibe ya instanciadas por un mecanismo externo.

Imagínate que tienes el siguiente panorama:
Un Servicio A que emplea el Servicio B y este a su vez utiliza el Servicio C.

Si tuvieses que instanciar el Servicio A, primero deberías instanciar el C para poder continuar con el B y luego sí hacerlo con el A. Se vuelve confuso y poco escalable si en algún momento también tienes que instanciar el Servicio D o E.

La inyección de dependencias soluciona las dependencias de una clase por nosotros.

Cuando instanciamos en el constructor el servicio A, Angular por detrás genera automáticamente la instancia del servicio B y C sin que nosotros nos tengamos que preocupar por estos.

    // services/test-name.service.ts
    import { Injectable } from '@angular/core';
    @Injectable({
      providedIn: 'root'
    })
    export class TestNameService {
      constructor() { }
    }

Este le proporcionó a la clase el decorador @Injectable({ ... }) con el valor providedIn: 'root' que determina el scope del servicio, o sea, determina que el mismo estará disponible en toda el módulo de tu aplicación por default.

La inyección de dependencias no es el único patrón de diseño que Angular usa con sus servicios. También hace uso del patrón Singleton para crear una instancia única de cada servicio.

Si tienes un servicio que se utiliza en N cantidad de componentes (u otros servicios), todos estarán utilizando la misma instancia del servicio y compartiendo el valor de sus variables y todo su estado.

Solo hay que tener en cuidado de las dependencias circulares. Cuando un servicio importa a otro y este al anterior. Angular no sabrá si vino primero el huevo o la gallina y tendrás un error al momento de compilar tu aplicación.


## Obteniendo datos de una API

Para obtener datos por medios de una api Angula tiene un modulo mas que sirve para hacer peticiones llamada modulo http. Para comenzar Crearemos nuestro servicio con la siguiente linea de comando.

    ng s services/products

Luego de crear el servicio tendremos que importar el modulo HttpClientModule en nuestro app.module.ts

    import { HttpClientModule } from '@angular/common/http';

    @NgModule({
      declarations: [
        // ..
      ],
      imports: [
        // ...
        HttpClientModule
      ],
      providers: [],
      bootstrap: [ /* .. */ ]
    })
    export class AppModule { }

En el nuevo servicio que creamos importaremos el metodo httpcliente

    import { HttpClient } from '@angular/common/http';

    @Injectable({
      providedIn: 'root'
    })
    export class ApiService {

      constructor(
        private http: HttpClient,
      ) { }
      
      getProducts() {
        return this.http.get<Product[]>(`https://example.com/api/productos`);
      }
    }

Como TS es un lenguaje fuertemente tipado, necesitamos decirle que tipo de objeto recibiremos. a su vez la informacio que ofrece la api tiene que coincidir con nuestro objeto.

    export interface Product {
      id: string,
      title: string,
      price: number,
      image: string,
      description: string,
      category: string
    }

Luego de hacer el resto de los cambios podemos ir a nuestro componente products y llamar la funcion para obtener los valores de la api.


    import { ProductsService } from '../../services/products.service'
    ...

    export class ProductsComponent {
      ...
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

    }

Como ya planteamos el metodo ngOnInit() es el lugar apropiado para los llamados asincrónicos. Si plateaste todos los cambios deberias correr correctamente.
