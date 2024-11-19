import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'StartLessThanEnd', async: false })
export class StartLessThanEndValidator implements ValidatorConstraintInterface {
  validate(startPage: number, args: ValidationArguments) {
    const endPage = (args.object as any).endPage;
    return startPage < endPage;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `The ${validationArguments.property} must be less than endPage`;
  }
}
