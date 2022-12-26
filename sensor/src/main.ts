import axios from "axios";
import HID from "node-hid";
import {
  validate,
  isCo2,
  isTemperature,
  co2Parser,
  temperatureParser,
  co2Transformer,
  temperatureTransformer,
} from "./co2";

const VID = 1241;
const PID = 41042;

const CO2MiniDevice = new HID.HID(VID, PID);

const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN;
if (INFLUXDB_TOKEN === undefined) {
  throw new Error("INFLUXDB_TOKEN is not set");
}
const INFLUXDB_ORG = process.env.INFLUXDB_ORG;
if (INFLUXDB_ORG === undefined) {
  throw new Error("INFLUXDB_ORG is not set");
}
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET;
if (INFLUXDB_BUCKET === undefined) {
  throw new Error("INFLUXDB_BUCKET is not set");
}

const write = (message: string) => {
  axios
    .post(
      `http://localhost:8086/api/v2/write?org=${INFLUXDB_ORG}&bucket=${INFLUXDB_BUCKET}`,
      message,
      {
        headers: {
          Authorization: `Token ${INFLUXDB_TOKEN}`,
          "Content-Type": "text/plain; charset=utf-8",
        },
      }
    )
    .catch((error) => {
      console.log(error);
    });
};

CO2MiniDevice.on("data", (data) => {
  if (!validate(data)) {
    return;
  }

  if (isCo2(data)) {
    const message = co2Transformer(co2Parser(data));
    console.log(message);
    write(message);
    return;
  }

  if (isTemperature(data)) {
    const message = temperatureTransformer(temperatureParser(data));
    console.log(message);
    write(message);
    return;
  }
});
