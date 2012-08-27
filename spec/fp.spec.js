if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../lib/fp.js"], function(FP) {

describe("Constructors", function() {
	it("should support construction by value and scale", function() {
		var fp = new FP.Decimal(1,2);
		expect(fp.value()).toBe(1);
		expect(fp.scale()).toBe(2);
	});
	it("should support construction from a string", function() {
		var fp = new FP.Decimal("0.01");
		expect(fp.value()).toBe(1);
		expect(fp.scale()).toBe(2);
	});
	it("should support construction from a float", function() {
		var fp = new FP.Decimal(0.01);
		expect(fp.value()).toBe(1);
		expect(fp.scale()).toBe(2);
	});
	it("should convert trailing zeros on integers to positive scale", function() {
		var fp = new FP.Decimal(100);
		expect(fp.value()).toBe(100);
		expect(fp.scale()).toBe(0);

		var fp = new FP.Decimal(1230);
		expect(fp.value()).toBe(1230);
		expect(fp.scale()).toBe(0);
	});
	it("should convert not consider intervening zeros on integers to be trailing", function() {
		var fp = new FP.Decimal(10010);
		expect(fp.value()).toBe(10010);
		expect(fp.scale()).toBe(0);
	});
	it("should fail if a non-numeric string is used", function() {
		expect(function() { new FP.Decimal("abc"); }).toThrow();
	});
	it("should support factory method from a string", function() {
		var fp = FP.Decimal.valueOf("0.01");
		expect(fp.value()).toBe(1);
		expect(fp.scale()).toBe(2);
	});
	it("should support factory method from a float", function() {
		var fp = FP.Decimal.valueOf(0.01);
		expect(fp.value()).toBe(1);
		expect(fp.scale()).toBe(2);
	});
});

describe("Rounding", function() {
	var fp = new FP.Decimal(1.253);
	expect(fp.value()).toBe(1253);
	expect(fp.scale()).toBe(3);
	it("should not affect the value if the scale is >= current", function() {
		var fp1 = fp.scaleTo(4);
		expect(fp1.value()).toBe(12530);
		expect(fp1.scale()).toBe(4);
	});
	it("should truncate the value if the scale is < current and the last digit is less than 5", function() {
		var fp1 = fp.scaleTo(2);
		expect(fp1.value()).toBe(125);
		expect(fp1.scale()).toBe(2);
	});
	it("should round the value up if the scale is < current and the last digit is >= 5", function() {
		var fp1 = fp.scaleTo(1);
		expect(fp1.value()).toBe(13);
		expect(fp1.scale()).toBe(1);
	});
	it("should support override of rounding function to use floor", function() {
		var fp1 = fp.scaleTo(1,FP.Rounding.FLOOR);
		expect(fp1.value()).toBe(12);
		expect(fp1.scale()).toBe(1);
	});
	it("should support override of rounding function to use ceiling", function() {
		var fp1 = fp.scaleTo(2,FP.Rounding.CEILING);
		expect(fp1.value()).toBe(126);
		expect(fp1.scale()).toBe(2);
	});
});

describe("Addition", function() {
	it("should fail with a TypeError when trying to add something that's not coercable to an FP.Decimal",function() {
		var fp1 = new FP.Decimal(2);
		expect(function() { fp1.add("abc"); }).toThrow();
	});

	it("should add integers correctly", function() {
		var fp1 = new FP.Decimal(2);
		var fp2 = new FP.Decimal(2);
		var result = fp1.add(fp2);
		expect(result.value()).toBe(4);
		expect(result.scale()).toBe(0);
	});

	it("should add decimals of same scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.1);
		var result = fp1.add(fp2);
		expect(result.value()).toBe(42);
		expect(result.scale()).toBe(1);
	});

	it("should add decimals of different scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.11);
		var result = fp1.add(fp2);
		expect(result.value()).toBe(421);
		expect(result.scale()).toBe(2);
	});

	it("should coerce an added value for convenience", function() {
		var fp1 = new FP.Decimal(2.1);
		var result = fp1.add(2.11);
		expect(result.value()).toBe(421);
		expect(result.scale()).toBe(2);
	});
});

describe("Subtraction", function() {
	it("should fail with a TypeError when trying to add something that's not coercable to an FP.Decimal",function() {
		var fp1 = new FP.Decimal(2);
		expect(function() { fp1.subtract("abc"); }).toThrow();
	});

	it("should subtract integers correctly", function() {
		var fp1 = new FP.Decimal(2);
		var fp2 = new FP.Decimal(2);
		var result = fp1.subtract(fp2);
		expect(result.value()).toBe(0);
		expect(result.scale()).toBe(0);
	});

	it("should subtract decimals of same scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.1);
		var result = fp1.subtract(fp2);
		expect(result.value()).toBe(0);
		expect(result.scale()).toBe(1);
	});

	it("should subtract decimals of different scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.11);
		var result = fp1.subtract(fp2);
		expect(result.value()).toBe(-1);
		expect(result.scale()).toBe(2);
	});

	it("should coerce a subtracted value for convenience", function() {
		var fp1 = new FP.Decimal(2.1);
		var result = fp1.subtract(2.11);
		expect(result.value()).toBe(-1);
		expect(result.scale()).toBe(2);
	});
});

describe("Multiplication", function() {
	it("should fail with a TypeError when trying to add something that's not coercable to an FP.Decimal",function() {
		var fp1 = new FP.Decimal(2);
		expect(function() { fp1.multiply("abc"); }).toThrow();
	});

	it("should multiply integers correctly", function() {
		var fp1 = new FP.Decimal(2);
		var fp2 = new FP.Decimal(2);
		var result = fp1.multiply(fp2);
		expect(result.value()).toBe(4);
		expect(result.scale()).toBe(0);
	});

	it("should multiply decimals of same scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.1);
		var result = fp1.multiply(fp2);
		expect(result.value()).toBe(441);
		expect(result.scale()).toBe(2);
	});

	it("should multiply decimals of different scale correctly", function() {
		var fp1 = new FP.Decimal(2.1);
		var fp2 = new FP.Decimal(2.11);
		var result = fp1.multiply(fp2);
		expect(result.value()).toBe(4431);
		expect(result.scale()).toBe(3);
	});

	it("should coerce a multiplied value for convenience", function() {
		var fp1 = new FP.Decimal(2.1);
		var result = fp1.multiply(2.11);
		expect(result.value()).toBe(4431);
		expect(result.scale()).toBe(3);
	});
});
});