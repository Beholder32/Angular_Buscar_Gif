import { Component } from '@angular/core';
import { GifsService } from '../../gifs/services/gifs.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  //Con estos metodos accedemos a la informacion almacenada en el servicio, 
  //que al estar en 'root' podemos llegar a él desde cualquier clase y componente. Se invoca creando primero un constructor y luego un get
  
  constructor( private GifsService: GifsService){}

  get historial (){
    return this.GifsService.historial;
  }
  

  recuperarImg(parametro:string){
    console.log(parametro);
    this.GifsService.buscarGifs(parametro);
  }

}
