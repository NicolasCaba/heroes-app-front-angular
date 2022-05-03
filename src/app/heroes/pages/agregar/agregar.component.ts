import { Component, OnInit, Pipe } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';
import { StorageCretedResponse } from '../../interfaces/storage-created-response.interface';
import { Storage } from '../../interfaces/storage.interface';
import { HeroeCretedResponse } from '../../interfaces/heroe-created-response.interface';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img {
      width: 100%;
      border-radius: 5px;
    }
    `
  ]
})
export class AgregarComponent implements OnInit {

  heroe: Heroe = {
    superhero: '',
    publisher: Publisher.DCComics,
    alter_ego: '',
    first_appearance: '',
    characters: '',
    image_id: '',
    image: {
      url: '',
      filename: ''
    }
  }

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marverl - Comics'
    }
  ];

  archivoImagen!: File;
  imagen!: Storage;
  disabledGuardar: boolean = true;
  hiddenEliminar: boolean = true;

  constructor(private heroesService: HeroesService, 
              private activatedRoute: ActivatedRoute, 
              private router: Router,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')) { return; }

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroePorId(id))
      )
      .subscribe((heroe) => {
        this.heroe = heroe[0];
        this.disabledGuardar = false;
      });

  }

  archivo(event: any): void {
    this.archivoImagen = event.target.files[0];
    this.disabledGuardar = false;
  }


  guardar(): void {
    // Validaciones
    if (this.heroe.superhero.trim() === '') {
      return;
    } else if (this.heroe.alter_ego.trim() === '') {
      return;
    } else if (this.heroe.first_appearance.trim() === '') {
      return;
    } else if (this.heroe.alter_ego.trim() === '') {
      return;
    } else if (this.heroe.characters.trim() === '') {
      return;
    }

    if (this.heroe._id) {
      // Editar heroe
      // Creacion de id
      const idPrefix: string[] = this.heroe.publisher.split(' ');
      const idEnd: string[] = this.heroe.superhero.split(' ');
      let id: string = `${idPrefix[0].toLocaleLowerCase()}-${idEnd[0].toLocaleLowerCase()}`;
      this.heroe.id = id;

      const formHeroe = {
        id: id,
        superhero: this.heroe.superhero,
        publisher: this.heroe.publisher,
        alter_ego: this.heroe.alter_ego,
        first_appearance: this.heroe.first_appearance,
        characters: this.heroe.characters,
        image_id: ''
      }

      if (this.archivoImagen) {
        /**
         * Update heroe si hay imagen
         */
        // FormData
        const formArchivo: FormData = new FormData();
        formArchivo.append('file', this.archivoImagen);

        this.heroesService.agregarStorage(formArchivo)
          .pipe(
            switchMap((response) => {
              formHeroe.image_id = response.response._id!;
              return this.heroesService.actualizarHeroe(this.heroe, formHeroe)
            })
          )
          .subscribe((response) => {
            this.router.navigate(['/heroes/editar', formHeroe.id]);
            this.mostrarSnack('Registro actualizado');
          });
      } else {
        /**
         * Update heroe si NO hay imagen
         */
        formHeroe.image_id = this.heroe.image_id;
        this.heroesService.actualizarHeroe(this.heroe, formHeroe)
          .subscribe(response => {
            this.router.navigate(['/heroes/editar', formHeroe.id]);
            this.mostrarSnack('Registro actualizado');
          });
      }

    } else {
      // Creacion de heroe
      // Creacion de id
      const idPrefix: string[] = this.heroe.publisher.split(' ');
      const idEnd: string[] = this.heroe.superhero.split(' ');
      let id: string = `${idPrefix[0].toLocaleLowerCase()}-${idEnd[0].toLocaleLowerCase()}`;

      // FormData
      const formArchivo: FormData = new FormData();
      formArchivo.append('file', this.archivoImagen);

      // POST to api
      this.heroesService.agregarStorage(formArchivo)
        .pipe(
          switchMap((response) => {
            const formHeroe = {
              id: id,
              superhero: this.heroe.superhero,
              publisher: this.heroe.publisher,
              alter_ego: this.heroe.alter_ego,
              first_appearance: this.heroe.first_appearance,
              characters: this.heroe.characters,
              image_id: response.response._id
            }
            return this.heroesService.agregarHeroe(formHeroe);
          })
        )
        .subscribe((response: HeroeCretedResponse) => {
          this.router.navigate(['/heroes/editar', response.response.id]);
          this.mostrarSnack('Regristro creado');
        });
    }
  }

  /**
   * Eliminar heroe
   */
  eliminar(): void {

    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: { ...this.heroe }
    });

    dialog.afterClosed()
      .subscribe(result => {
        
        if (result) {
          this.heroesService.eliminarHeroe(this.heroe._id!)
            .pipe(
              switchMap((response) => this.heroesService.eliminarStorage(response.response.image_id)
              )
            )
            .subscribe((response) => {
              this.router.navigate(['/heroes']);
            });
        }
        
      });


  }

  mostrarSnack (mensaje: string): void {

    this.snackBar.open(mensaje, 'ok!', {
      duration: 2500
    });

  }

}
