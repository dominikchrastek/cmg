const R = require("ramda");

function isSensorLine(types, line) {
  return types.some(R.equals(R.head(line.split(" "))));
}

function getSensorLineData(line) {
  return line.split(" ");
}

function getReadingValue(line) {
  return Number(R.last(line.split(" ")));
}

function isInRangeInclusive(value, bottom, top) {
  return value >= bottom && value <= top;
}
function isInRangeExclusive(value, bottom, top) {
  return value > bottom && value < top;
}

function isPrecise(degrees, meanDeviation, deviation, data) {
  const allInRange = data.every(value =>
    isInRangeExclusive(value, degrees - deviation, degrees + deviation)
  );

  const meanValue = isInRangeInclusive(
    R.sum(data) / data.length,
    degrees - meanDeviation,
    degrees + meanDeviation
  );
  return allInRange && meanValue;
}

function isUltraPrecise(degrees, data) {
  return isPrecise(degrees, 0.5, 3, data);
}

function isVeryPrecise(degrees, data) {
  return isPrecise(degrees, 0.5, 5, data);
}

module.exports = {
  isSensorLine,
  getSensorLineData,
  getReadingValue,
  isInRangeInclusive,
  isInRangeExclusive,
  isPrecise,
  isUltraPrecise,
  isVeryPrecise
};
