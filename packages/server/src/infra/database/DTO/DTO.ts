export interface DTO<objectData, ClassElement> {
  fromDatabase(data: objectData): ClassElement;
  toDatabase(data: ClassElement): objectData;
}
