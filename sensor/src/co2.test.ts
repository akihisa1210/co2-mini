import { describe, expect, it } from "vitest";
import {
  validate,
  isCo2,
  isTemperature,
  co2Parser,
  temperatureParser,
  co2Transformer,
  temperatureTransformer,
} from "./co2";

describe("Validator", () => {
  it("returns data if it is valid", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x01;
    view[1] = 0x02;
    view[2] = 0x03;
    view[3] = 0x06;
    expect(validate(view)).toEqual(view);
  });

  it("checks only the low byte", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0xff;
    view[1] = 0xff;
    view[2] = 0xff;
    view[3] = 0xfd; // 0xff + 0xff + 0xff is 0x2fD. Its low byte is 0xfd.
    expect(validate(view)).toEqual(view);
  });

  it("returns null if it is invalid", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x01;
    view[1] = 0x02;
    view[2] = 0x03;
    view[3] = 0x07;
    expect(validate(view)).toEqual(null);
  });
});

describe("Filter", () => {
  it("checks the data is for CO2", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x50; // CO2_ITEM
    expect(isCo2(view)).toEqual(true);
  });

  it("checks the data is not for CO2", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x42; // TEMPERATURE_ITEM
    expect(isCo2(view)).toEqual(false);
  });

  it("checks the data is for temperature", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x42; // TEMPERATURE_ITEM
    expect(isTemperature(view)).toEqual(true);
  });

  it("checks the data is not for temperature", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[0] = 0x50; // CO2_ITEM
    expect(isTemperature(view)).toEqual(false);
  });
});

describe("Parser", () => {
  it("parses CO2 data", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[1] = 0x04;
    view[2] = 0x0e;
    expect(co2Parser(view)).toEqual(1038); // using actual data
  });

  it("parses temperature data", () => {
    const buffer = new ArrayBuffer(8);
    const view = new Uint8Array(buffer);
    view[1] = 0x12;
    view[2] = 0xc1;
    expect(temperatureParser(view)).toEqual(27.0); // using actual data
  });
});

describe("Transformer", () => {
  it("generates CO2 message", () => {
    expect(co2Transformer(1000)).toEqual("co2-mini co2=1000");
  });

  it("generates temprature message", () => {
    expect(temperatureTransformer(27.0)).toEqual("co2-mini temperature=27");
  });
});
