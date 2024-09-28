import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from '@nestjs/class-validator';
  import { Injectable } from '@nestjs/common';
  import { UserService } from '../user.service';
  
  @ValidatorConstraint({ async: true })
  @Injectable()
  export class IsUniqueLogin implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}
  
    async validate(login: string, args: ValidationArguments) {
      const user = await this.userService.getUser(login);
      return !user;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Login ($value) is already in use.';
    }
  }
  