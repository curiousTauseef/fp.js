# fp.js: A Fixed-precision math javascript library

Currently work-in-process, not ready for consumption

### Usage:

Supports fixed precision math, no more floating point imprecision:

1.23 * 10^1 = 1.2300000000001

```javascript
  var value = new FP.Decimal(1.23);
  var multiplier = new FP.Decimal(2);
  
  expect(value.multiply(multiplier)).toBe(new FP.Decimal(2.46));
  expect(value.multiply(0.1)).toBe(new FP.Decimal(0.123));
  expect(value.multiply(0.1).scaleTo(-1)).toBe(new FP.Decimal(1.2));
```

Licensed APL 2.0