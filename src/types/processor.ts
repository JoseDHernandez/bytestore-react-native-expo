//tipo de procesador
export type Processor = {
  brand: string;
  family: string;
  model: string;
  cores: number;
  speed: string;
};
//datos
export type ProcessorData = Processor & {
  id: string;
};
