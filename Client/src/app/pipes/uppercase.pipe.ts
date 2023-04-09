import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase'
})
export class UppercasePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toUpperCase();
  }
}
