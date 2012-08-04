describe("Constructors", function() {
	it("should support construction from a string", function() {
		var fp = new FP.Decimal("0.01");
		expect(fp.value).toBe(1);
		expect(fp.scale).toBe(-2);
	});
	it("should support construction from a float", function() {
		var fp = new FP.Decimal(0.01);
		expect(fp.value).toBe(1);
		expect(fp.scale).toBe(-2);
	});
	it("should convert trailing zeros on integers to positive scale", function() {
		var fp = new FP.Decimal(100);
		expect(fp.value).toBe(1);
		expect(fp.scale).toBe(2);

		var fp = new FP.Decimal(1230);
		expect(fp.value).toBe(123);
		expect(fp.scale).toBe(1);
	});
	it("should fail if a non-numeric string is used", function() {
		expect(function() { new FP.Decimal("abc"); }).toThrow();
	});
	it("should support factory method from a string", function() {
		var fp = FP.Decimal.valueOf("0.01");
		expect(fp.value).toBe(1);
		expect(fp.scale).toBe(-2);
	});
	it("should support factory method from a float", function() {
		var fp = FP.Decimal.valueOf(0.01);
		expect(fp.value).toBe(1);
		expect(fp.scale).toBe(-2);
	});
});

describe("Scale conversion", function() {
	var fp = new FP.Decimal(1.23);
	expect(fp.value).toBe(123);
	expect(fp.scale).toBe(-2);
	it("should convert both the value and the scale to stay the same for negative", function() {
		var fp1 = fp.convert(-1);
		expect(fp1.value).toBe(12.3);
		expect(fp1.scale).toBe(-1);
	});
	it("should convert both the value and the scale to stay the same for positive", function() {
		var fp1 = fp.convert(1);
		expect(fp1.value).toBe(0.123);
		expect(fp1.scale).toBe(1);
	});
});

xdescribe("Addition", function() {
	it("should fail with a TypeError when trying to add something that's not coercable to an FP.Decimal",function() {
		var fp1 = new FP.Decimal(2);
		expect(function() { fp1.add("abc"); }).toThrow();
	});

	it("should add integers correctly", function() {
		var fp1 = new FP.Decimal(2);
		var fp2 = new FP.Decimal(2);
		expect(fp1.add(fp2)).toBe(4);
	});
});