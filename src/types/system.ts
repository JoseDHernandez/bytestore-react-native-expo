//sistema
export type OperatingSystem = {
  system: string;
  distribution: string;
};
//respuesta del servidor
export type OperatingSystemData = OperatingSystem & {
  id: string;
};
