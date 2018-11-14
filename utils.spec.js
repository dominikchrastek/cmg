const {
  isSensorLine,
  getSensorLineData,
  getReadingValue,
  isInRangeInclusive,
  isInRangeExclusive,
  isPrecise,
  isUltraPrecise,
  isVeryPrecise
} = require("./utils");

const sensorLine = "thermometer temp-1";
const readLine = "2007-04-05T22:04 71.2";

describe("#utils", () => {
  describe("#isSensorLine", () => {
    it("works", () => {
      expect(isSensorLine(["thermometer"], sensorLine)).toBe(true);
      expect(isSensorLine(["thermometer"], readLine)).toBe(false);
      expect(isSensorLine(["weird sensor"], sensorLine)).toBe(false);
    });
  });
  describe("#getSensorLineData", () => {
    it("works", () => {
      expect(getSensorLineData(sensorLine)).toEqual(["thermometer", "temp-1"]);
    });
  });
  describe("#getReadingValue", () => {
    it("works", () => {
      expect(getReadingValue(readLine)).toBe(71.2);
    });
  });
  describe("#isInRangeInclusive", () => {
    it("works", () => {
      expect(isInRangeInclusive(10, 1, 10)).toBe(true);
      expect(isInRangeInclusive(10, 10, 10)).toBe(true);
      expect(isInRangeInclusive(10, 10, 1)).toBe(false);
      expect(isInRangeInclusive(5, 1, 10)).toBe(true);
      expect(isInRangeInclusive(15, 1, 10)).toBe(false);
      expect(isInRangeInclusive(15, 1, 10)).toBe(false);
    });
  });
  describe("#isInRangeExclusive", () => {
    it("works", () => {
      expect(isInRangeExclusive(10, 1, 10)).toBe(false);
      expect(isInRangeExclusive(10, 10, 10)).toBe(false);
      expect(isInRangeExclusive(10, 10, 1)).toBe(false);
      expect(isInRangeExclusive(5, 1, 10)).toBe(true);
      expect(isInRangeExclusive(15, 1, 10)).toBe(false);
    });
  });
  describe("#isPrecise", () => {
    it("works when mean value and deviation are ok", () => {
      expect(isPrecise(70, 0.5, 3, [71, 72, 71.9, 69, 70, 69])).toBe(true);
    });
    it("works when mean value is ok and deviation is not ok", () => {
      expect(isPrecise(70, 0.5, 3, [71, 72, 71.9, 69, 70, 65])).toBe(false);
    });
    it("works when mean value is not ok and deviation is ok", () => {
      expect(isPrecise(70, 0.5, 3, [72, 72, 72])).toBe(false);
    });
    it("works when mean value and deviation aren't ok", () => {
      expect(isPrecise(70, 0.5, 3, [72, 72, 74])).toBe(false);
    });
  });
  describe("#isUltraPrecise", () => {
    it("works when mean value and deviation are ok", () => {
      expect(isUltraPrecise(70, [70.5, 69.5, 70])).toBe(true);
    });
    it("works when mean value is not ok and deviation is ok", () => {
      expect(isUltraPrecise(70, [71, 71, 70])).toBe(false);
    });
    it("works when mean value is ok and deviation is not ok", () => {
      expect(isUltraPrecise(70, [68, 69.5, 70, 73])).toBe(false);
    });
    it("works when mean value and deviation aren't ok", () => {
      expect(isUltraPrecise(70, [69.5, 70, 73])).toBe(false);
    });
  });
  describe("#isVeryPrecise", () => {
    it("works when mean value and deviation are ok", () => {
      expect(isVeryPrecise(70, [70.5, 69.5, 70])).toBe(true);
    });
    it("works when mean value is not ok and deviation is ok", () => {
      expect(isVeryPrecise(70, [71, 71, 70])).toBe(false);
    });
    it("works when mean value is ok and deviation is not ok", () => {
      expect(isVeryPrecise(70, [65, 68, 69.5, 70, 73, 75])).toBe(false);
    });
    it("works when mean value and deviation aren't ok", () => {
      expect(isVeryPrecise(70, [69.5, 70, 73, 80])).toBe(false);
    });
  });
});
