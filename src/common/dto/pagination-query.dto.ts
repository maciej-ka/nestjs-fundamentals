import { IsOptional, IsPositive } from "class-validator";

export default class PaginationDto {
  @IsOptional()
  @IsPositive()
  readonly limit: number;

  @IsOptional()
  @IsPositive()
  readonly offset: number;
}
