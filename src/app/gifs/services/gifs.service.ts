import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  //Esto es una característica que permite que los servicios puedan estar definidos en el momento que se construye el bundle de la app
  providedIn: 'root'
})
export class GifsService {
  
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';

  //Este codigo nos lo la API con la que estamos trabajando
  private apiKey: string = 'jNxhO6SC3Lgelc4iKPensSaXCWQfsK4m';
  //Creamos una variable (la indentificamos con el simbolo '_' ) de tipo array 
  private _historial: string[]=[];
  
  //TODO: Cambiar any por su tipo correspondiente
  public resultados:Gif[] = [];
  
  //Metodo get con el mismo nombre que nos devolverá el array para que podamos acceder a él desde las otras clases, ya que la variable es private
  get historial(){
    return [...this._historial];
  }

  //Esto nos vale para que nos dibuje el historial en nuestra web
  constructor( private http: HttpClient ){

    this._historial = JSON.parse(localStorage.getItem('historial')!)||[];

    //Crear la forma de poder cargar el ultimo resultado al volver a cargar la pagina (ejercicio metodo propio)
    const ultimaBusqueda = this._historial[0];
    console.log(ultimaBusqueda);
    
    if(ultimaBusqueda){
      //Peticion no optimizada de html
      this.http.get<SearchGifsResponse>(`http://api.giphy.com/v1/gifs/search?api_key=jNxhO6SC3Lgelc4iKPensSaXCWQfsK4m&q=${ultimaBusqueda}&limit=10`)
      .subscribe( ( resp ) => {
        console.log(resp.data);
        this.resultados = resp.data;
      });
    }

    //if( localStorage.getItem('historial') ){
      //this._historial = JSON.parse( localStorage.getItem('historial')! );
    //}

  }
  
  buscarGifs( query: string ){
    
    //Con esto hacemos que todas las busquedas se guarden en minusculas para evitar repeticiones a consecuencia de la forma de escribir del usuario usando mayusculas
    query = query.trim().toLowerCase();

    //Con esto vamos a comprobar si la busqueda está incluida en el array. Si no lo está, ejecuta el codigo.
    if( !this._historial.includes(query) ){
      this._historial.unshift(query);

      //Con esto vamos a hacer que solo nos muestre los 10 primeros resultados del historial(el unshift va rellenando el array desde el primer hueco)
      this._historial = this._historial.splice(0,10);

      //Lo siguiente almacena los datos de busqueda en el local storage del navegador
      //Como de esta forma solo se pueden almacenar strings, usamos la propiedad que nos proporciona JSON para convertir el historial en string
      localStorage.setItem('historial', JSON.stringify(this._historial) );

    }

    //Optimizacion de la peticion html
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params:params})
    .subscribe( ( resp ) => {
      console.log(resp.data);
      this.resultados = resp.data;
    });
    

  }

}
