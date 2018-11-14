const R = require("ramda");

const {
  isSensorLine,
  getSensorLineData,
  getReadingValue,
  isInRangeInclusive,
  isUltraPrecise,
  isVeryPrecise
} = require("./utils");

const SENSOR_THERMOMETER = "thermometer";
const SENSOR_HUMIDITY = "humidity";
const THERMOMETER_BRAND_1 = "ultra precise";
const THERMOMETER_BRAND_2 = "very precise";
const THERMOMETER_BRAND_3 = "precise";
const HUMIDITY_STATE_1 = "keep";
const HUMIDITY_STATE_2 = "discard";
const SENSOR_TYPES = [SENSOR_THERMOMETER, SENSOR_HUMIDITY];
const HUMIDITY_ACCEPTANCE_PERCENTAGE = 1;

function reduceWithCurrentName(acc, line) {
  if (isSensorLine(SENSOR_TYPES, line)) {
    const [type, name] = getSensorLineData(line);
    acc[name] = {
      type: type,
      data: []
    };
    acc.currentName = name;
    return acc;
  }

  acc[acc.currentName].data.push(line);
  return acc;
}

const transformData = R.compose(
  R.omit(["currentName"]),
  R.reduce(reduceWithCurrentName, {}),
  R.tail
);

function checkHumidityValues(humidity, humidityAcceptance, data) {
  return data
    .map(getReadingValue)
    .some(
      value =>
        !isInRangeInclusive(
          value,
          humidity - humidityAcceptance,
          humidity + humidityAcceptance
        )
    )
    ? HUMIDITY_STATE_2
    : HUMIDITY_STATE_1;
}

function checkThermometerValues(degrees, data) {
  const values = data.map(getReadingValue);
  if (isUltraPrecise(degrees, values)) {
    return THERMOMETER_BRAND_1;
  }
  if (isVeryPrecise(degrees, values)) {
    return THERMOMETER_BRAND_2;
  }
  return THERMOMETER_BRAND_3;
}

function calculateStuff(degrees, humidity, humidityAcceptance, data) {
  return R.keys(data).reduce((acc, key) => {
    const sensor = data[key];
    if (sensor.type === "humidity") {
      const value = checkHumidityValues(
        humidity,
        humidityAcceptance,
        sensor.data
      );
      return R.assoc(key, value, acc);
    }
    if (sensor.type === "thermometer") {
      const value = checkThermometerValues(degrees, sensor.data);
      return R.assoc(key, value, acc);
    }
    return acc;
  }, {});
}

module.exports = function evaluateLogFile(fileContents) {
  const lines = fileContents.split(/\r?\n/);
  const firstLine = R.head(lines).split(" ");
  const degrees = Number(firstLine[1]);
  const humidity = Number(firstLine[2]);
  const humidityAcceptance = (humidity / 100) * HUMIDITY_ACCEPTANCE_PERCENTAGE;

  const data = transformData(lines);
  return calculateStuff(degrees, humidity, humidityAcceptance, data);
};
