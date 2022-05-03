import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Heroe } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
  ]
})
export class BuscarComponent implements OnInit {

  termino: string = '';
  heroes: Heroe[] = [];
  heroeSeleccionado: Heroe | undefined;

  constructor( private heroesService: HeroesService ) { }

  ngOnInit(): void {
  }

  buscando(): void {
    this.heroesService.getSugerencias(this.termino)
      .subscribe(heroes => this.heroes = heroes);
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent ): void {
    if(!event.option.value) {
      this.termino = '';
      this.heroeSeleccionado = undefined;
    } else {
      const heroe: Heroe = event.option.value;
      this.termino = heroe.superhero;
  
      this.heroesService.getHeroePorId(heroe.id!)
        .subscribe(heroe => {
          this.heroeSeleccionado = heroe[0];
        });
    }
  }

}
