import { Pipe, PipeTransform } from '@angular/core';
import { Heroe } from '../interfaces/heroe.interface';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(heroe: Heroe): string {

    if (!heroe.id) {
      return 'assets/no-image.png';
    } if (heroe.image.url) {
      return heroe.image.url;
    }

    return heroe.image.url;
  }

}
