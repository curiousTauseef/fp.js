var FP = FP || {};

FP.CheckNumeric = function(value) {
	if (typeof(value) === "string" && value.search(/[^0-9.]/) > -1)	{
		throw new TypeError("Strings passed can only include numbers and decimal point");
	}
}

FP.Decimal = function(value) {
	"use strict";
	"use restrict";

	var _value = 0,
		_scale = 0;

	FP.CheckNumeric(value);

	if (typeof(value) === "number") {
		value = value.toString();
	}
	if (typeof(value) === "string") {
		if (value.indexOf(".") > 0) {
			_value = (+value.replace("\.",""));
			_scale = -(value.length - value.indexOf(".") - 1);
		}
		else if (value.indexOf("0") > 0) {
			_value = (+value.substring(0,value.indexOf("0")));
			_scale = value.length - value.indexOf("0");
		}
	}

	var typeTest = function(other) {
		typeTestProperties(other.value, other.scale);
	};

	var typeTestProperties = function(otherValue, otherScale) {
		if (typeof(otherValue) === "undefined" || typeof(otherScale) === "undefined")
		{
			throw new TypeError("Add expects FP.Decimal objects to be added");
		}
	};

	return {
		value: _value,

		scale: _scale,

		convert: function(otherScale) {
			var scaleFactor = this.scale - otherScale;
			this.value = this.value * Math.pow(10,scaleFactor);
			this.scale = otherScale;
			return this;
		},

		add: function(other) {
			var otherValue = other.value,
				otherScale = other.scale;
			typeTestProperties(otherValue,otherScale);
			return new FP.Decimal
		},

		equals: function(other) {
			return typeof other !== 'undefined' &&
			        other !== null &&
			        this._value === other._value
			        && this._scale === other._scale
    	},

		toString: function() {
			var str = _value.toString(),
				posn = str.length - _scale;
			return str.substring(0,posn) || 0 + "." + str.substring(posn);
		}
	};
};

FP.Decimal.valueOf = function(value) {
	return new FP.Decimal(value);
};
