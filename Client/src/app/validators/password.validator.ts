import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

export class PasswordValidator {
  public static strong(): ValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const hasNumber = /\d/.test(control.value);
      const hasUpper = /[A-Z]/.test(control.value);
      const hasLower = /[a-z]/.test(control.value);

      const valid = hasNumber && hasUpper && hasLower && control.value.length >= 6;

      if (!valid) return of({ 'strong': true });
      return of(null);
    };
  }
}