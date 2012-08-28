# fp.js: A floating-point decimal math javascript library

[![Build Status](https://secure.travis-ci.org/scullxbones/fp.js.png)](http://travis-ci.org/scullxbones/fp.js)

Currently work-in-process, not ready for consumption

### Usage:

Supports decimal math, no more base-2 imprecision:

1.23 * 10 = 12.300000000001

```javascript
  var value = new FP.Decimal(1.23);
  var multiplier = new FP.Decimal(2);
  
  expect(value.multiply(multiplier)).toBe(new FP.Decimal(2.46));
  expect(value.multiply(0.1)).toBe(new FP.Decimal(0.123));
  expect(value.multiply(0.1).scaleTo(-1)).toBe(new FP.Decimal(1.2));
```

Licensed APL 2.0