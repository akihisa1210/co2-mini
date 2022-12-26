export const validate = (data: Uint8Array): Uint8Array | null => {
  const targetBuffer = new ArrayBuffer(1);
  const checksumBuffer = new ArrayBuffer(1);

  const targetView = new Uint8Array(targetBuffer);
  const checksumView = new Uint8Array(checksumBuffer);

  targetView[0] = data[0] + data[1] + data[2];
  checksumView[0] = data[3];

  if (targetView[0] === checksumView[0]) {
    return data;
  }
  return null;
};

export const isCo2 = (data: Uint8Array): boolean => {
  const CO2_ITEM = 0x50;
  return data[0] === CO2_ITEM;
};

export const isTemperature = (data: Uint8Array): boolean => {
  const TEMPERATURE_ITEM = 0x42;
  return data[0] === TEMPERATURE_ITEM;
};

export const co2Parser = (data: Uint8Array): number => {
  return (data[1] << 8) | data[2];
};

export const temperatureParser = (data: Uint8Array): number => {
  return Number((((data[1] << 8) | data[2]) / 16.0 - 273.1).toFixed(1));
};

export const co2Transformer = (co2: number): string => {
  return `co2-mini co2=${co2}`;
};

export const temperatureTransformer = (temperature: number): string => {
  return `co2-mini temperature=${temperature}`;
};
