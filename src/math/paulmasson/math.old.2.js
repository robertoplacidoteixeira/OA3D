class RptMath extends RptCommonAncestor {
	
	afterPrepare() {
		super.afterPrepare();
		this.pi              = Math.PI;
		this.eulerGamma      = .5772156649015329;
		this.decimals        = 0;
		this.precisionScale  = 0;
		this.arb1            = 0;
		this.arb2            = 0;
		this.onePi           = 0;
		this.twoPi           = 0;
		this.halfPi          = 0;
		this.ln10            = 0;
		this.maxIter         = 100;
		this.nPrecisionScale = 10n**50n;
		this.ne              = 271828182845904523536028747135266249775724709369995n;
		this.nEulerGamma     = 57721566490153286060651209008240243104215933593992n;
		this.nPI             = 314159265358979323846264338327950288419716939937510n;
		this.factorialCache  = [ 1,1,2,6,24,120,720,5040,40320,362880,3628800 ];
		this.bend2nN         = null;
		this.bend2nD         = null;
	}

	duringCreate() {
		super.duringCreate();
		this.setPrecisionScale(20);
	}
	
	afterCreate() {
		super.afterCreate();
		this.C = this.complex;
		this.A = this.arbitrary;
		this.D = this.diff;
		this.real = re;
		this.imag = im;
	}

	setValueScale(value) {
		return this.constants[name] * this.precisionScale / this.nPrecisionScale;
	}

	// oeis.org/A000367
	bernoulli2nN() {
		if (!this.bend2nN)
			this.bend2nN = [
				1n,1n,-1n,1n,-1n,5n,-691n,7n,-3617n,43867n,-174611n,854513n,-236364091n,8553103n,-23749461029n,8615841276005n,-7709321041217n,2577687858367n,-26315271553053477373n,2929993913841559n,-261082718496449122051n,1520097643918070802691n,-27833269579301024235023n,596451111593912163277961n,-5609403368997817686249127547n,495057205241079648212477525n,-801165718135489957347924991853n,29149963634884862421418123812691n,-2479392929313226753685415739663229n,84483613348880041862046775994036021n,-1215233140483755572040304994079820246041491n,12300585434086858541953039857403386151n,-106783830147866529886385444979142647942017n,1472600022126335654051619428551932342241899101n,-78773130858718728141909149208474606244347001n,1505381347333367003803076567377857208511438160235n,-5827954961669944110438277244641067365282488301844260429n,34152417289221168014330073731472635186688307783087n,-24655088825935372707687196040585199904365267828865801n,414846365575400828295179035549542073492199375372400483487n,-4603784299479457646935574969019046849794257872751288919656867n,1677014149185145836823154509786269900207736027570253414881613n,-2024576195935290360231131160111731009989917391198090877281083932477n,660714619417678653573847847426261496277830686653388931761996983n,-1311426488674017507995511424019311843345750275572028644296919890574047n,1179057279021082799884123351249215083775254949669647116231545215727922535n,-1295585948207537527989427828538576749659341483719435143023316326829946247n,1220813806579744469607301679413201203958508415202696621436215105284649447n,-211600449597266513097597728109824233673043954389060234150638733420050668349987259n,67908260672905495624051117546403605607342195728504487509073961249992947058239n,-94598037819122125295227433069493721872702841533066936133385696204311395415197247711n
			];
		return this.bend2nN;
	}

	// oeis.org/A002445
	bernoulli2nD() {
		if (!this.bern2nD)
			this.bern2nD = [
				1n,6n,30n,42n,30n,66n,2730n,6n,510n,798n,330n,138n,2730n,6n,870n,14322n,510n,6n,1919190n,6n,13530n,1806n,690n,282n,46410n,66n,1590n,798n,870n,354n,56786730n,6n,510n,64722n,30n,4686n,140100870n,6n,30n,3318n,230010n,498n,3404310n,6n,61410n,272118n,1410n,6n,4501770n,6n,33330n
			];
		return this.bern2nD;
	}

	/*var root = start(n,x,y);*/
		
	complex(x,y=0) {
		return (y === 0 && this.isArbitrary(x)) ? y = 0n : { re: x, im: y };
	}

	isComplex(x) { return typeof x === 'object' && 're' in x; }

	setPrecisionScale(n) {
		this.decimals = n;
		this.precisionScale = 10n**BigInt(this.decimals);
		// set some commonly used constants
		this.arb1 = this.arbitrary(1);
		this.arb2 = this.arbitrary(2);
		this.onePi = this.nPI;
		this.twoPi = this.mul(this.onePi,this.arb2);
		this.halfPi = this.div(this.onePi,this.arb2);
		ln10 = this.ln(this.arbitrary(10));
	}

	arbitrary(x) {
		if (this.isComplex(x)) return { re: this.arbitrary(x.re),im: this.arbitrary(x.im) };
		if (this.isArbitrary(x)) return Number(x) / 10 ** this.decimals;
		// BigInt from exponential form includes wrong digits
		// manual construction from string more accurate
		var parts = x.toExponential().split('e');
		var mantissa = parts[0].replace('.','');
		var digits = mantissa.length - (mantissa[0] === '-' ? 2 : 1)
		var padding = +parts[1] + this.decimals - digits;
		return BigInt((padding < 0) ? (Math.round(x * 10 ** this.decimals)) : (mantissa + '0'.repeat(padding)));
	}

	isArbitrary(x) { return typeof x === 'bigint' || typeof x.re === 'bigint'; }

	isZero(x) {
		return this.isComplex(x) ? x.re === 0 && x.im === 0 : x === 0;
	}

	isInteger(x) {
		return this.isComplex(x) ? Number.isInteger(x.re) && x.im === 0 : Number.isInteger(x);
	}

	isPositiveInteger(x) {
		return this.isComplex(x) ? Number.isInteger(x.re) && x.re > 0 && x.im === 0 : Number.isInteger(x) && x > 0;
	}

	isPositiveIntegerOrZero(x) {
		return this.isComplex(x) ? Number.isInteger(x.re) && x.re >= 0 && x.im === 0 : Number.isInteger(x) && x >= 0;
	}

	isNegativeInteger(x) {
		return this.isComplex(x) ? Number.isInteger(x.re) && x.re < 0 && x.im === 0 : Number.isInteger(x) && x < 0;
	}

	isNegativeIntegerOrZero(x) {
		return this.isComplex(x) ? Number.isInteger(x.re) && x.re <= 0 && x.im === 0 : Number.isInteger(x) && x <= 0;
	}

	isEqualTo(x,y) {
		if (this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			return x.re === y.re && x.im === y.im;
		}
		return x === y;
	}

	re(x) {
		return this.isComplex(x) ? x.re : x;
	}

	im(x) {
		return this.isComplex(x) ? x.im : 0;
	}

	numfunc(x,func) {
		return this.isComplex(x) ? this.complex(func(x.re),func(x.im)) : func(x);
	}
	
	abs(x) {
		if (this.isComplex(x)) {
			if (x.re === 0 && x.im === 0) return 0;
			if (this.isArbitrary(x)) return this.sqrt(this.mul(x.re,x.re) + this.mul(x.im,x.im));
			return (Math.abs(x.re) < Math.abs(x.im)) ? 
				Math.abs(x.im) * Math.sqrt(1 + (x.re / x.im)**2) : 
				Math.abs(x.re) * Math.sqrt(1 + (x.im / x.re)**2);
		}
		return (this.isArbitrary(x)) ? ((x < 0n) ? -x : x) : Math.abs(x);
	}

	arg(x) {
		return this.isComplex(x) ? Math.atan2(x.im,x.re)  : Math.atan2(0,x);
	}

	// JavaScript does not support operator overloading

	operate(x,y,f) {
		if (this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			return {re: f(x.re,y.re),im: f(x.im,y.im)};
		}
		return f(x,y);
	}

	add(x,y) {
		if (arguments.length > 2) {
			var z = this.add(x,y);
			for (var i = 2 ; i < arguments.length ; i++) z = this.add(z,arguments[i]);
			return z; 
		}
		return this.operate(x,y,function(x,y){return x + y});
	}
	
	sub(x,y) {
		return this.operate(x,y,function(x,y){return x - y});
	}

	mul(x,y) {
		if (arguments.length > 2) {
			var z = this.mul(x,y);
			for (var i = 2 ; i < arguments.length ; i++) z = this.mul(z,arguments[i]);
			return z; 
		}
		if (this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			var re = x.re * y.re - x.im * y.im;
			var im = x.im * y.re + x.re * y.im;
			return (this.isArbitrary(x)) ? {re: re / this.precisionScale,im: im / this.precisionScale} : {re: re,im: im};
		}
		return (this.isArbitrary(x)) ? x * y / this.precisionScale : x * y;
	}

	neg(x) { return this.mul(-1,x); }

	div(x,y) {
		if (this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			if (y.re === 0 && y.im === 0 || y.re === 0n && y.im === 0n)
				throw Error('Division by zero');
			if (this.isArbitrary(x)) {
				var N = {
					re: x.re * y.re + x.im * y.im,
					im: x.im * y.re - x.re * y.im
				};
				var D = y.re * y.re + y.im * y.im;
				return {
					re: this.precisionScale * N.re / D,
					im: this.precisionScale * N.im / D
				};
			}
			if (Math.abs(y.re) < Math.abs(y.im)) {
				var f = y.re / y.im;
				return {
					re: (x.re * f + x.im) / (y.re * f + y.im),
					im: (x.im * f - x.re) / (y.re * f + y.im)
				};
			} else {
				var f = y.im / y.re;
				return {
					re: (x.re + x.im * f) / (y.re + y.im * f),
					im: (x.im - x.re * f) / (y.re + y.im * f)
				};
			}
		}
		if (y === 0 || y === 0n) throw Error('Division by zero');
		return (this.isArbitrary(x)) ? this.precisionScale * x / y : x / y;
	}

	inv(x) { return this.div(1,x); }

	pow(x,y) {
		if (this.isArbitrary(x) || this.isArbitrary(y)) {
			if (!this.isArbitrary(x)) x = this.arbitrary(x);
			if (!this.isArbitrary(y)) y = this.arbitrary(y);
			return this.exp(this.mul(y,this.ln(x)));
		}
		if (this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			if (x.re === 0 && x.im === 0) {
				if (y.re > 0) return this.complex(0);
				if (y.re === 0 && y.im === 0) return this.complex(1);
				if (y.re < 0) throw Error('Power singularity');
			}
			return this.exp(this.mul(y,this.log(x)));
		}
		if (x === 0 && y < 0) throw Error('Power singularity');
		if (x < 0 && !Number.isInteger(y)) return this.pow(this.complex(x),y);
		return x**y;
	}

	root(x,y) { return this.pow(x,this.div(1,y)); }

	surd(x,n) {
		if (this.isArbitrary(x) || this.isArbitrary(n)) throw Error('Surd requires real inputs');
		if (!this.isInteger(n)) throw Error('Second parameter of this.surd must be integer');
		if (n & 1) {
			var sign = Math.sign(x);
			return sign * this.root(sign*x,n);
		}
		if (x < 0) throw Error('First parameter of this.surd must be positive for even integers');
		return this.root(x,n);
	}

	sqrt(x) {
		if (this.isComplex(x)) {
			if (this.isArbitrary(x)) {
				if (x.im === 0n) return { re: this.sqrt(x.re),im: 0n };
				var absx = this.abs(x);
				var sign = x.im < 0n ? -1n : 1n;
				return { re: this.sqrt(this.div(absx + x.re,this.arb2)),im: sign * this.sqrt(this.div(absx - x.re,this.arb2)) }
			}
			var hyp = Math.hypot(x.re,x.im);
			var sign = x.im === 0 ? 1 : Math.sign(x.im);
			return { re: Math.sqrt((hyp + x.re)/2), im: sign * Math.sqrt((hyp - x.re)/2) };
		}
		if (this.isArbitrary(x)) {
			if (x === 0n) return 0n;
			if (x < 0n) throw Error('Cannot evaluate real square root of ' + x);
			// Brent,Modern Computer Arithmetic,SqrtInt algorithm
			var u = x,s,t;
			while (u !== s) {
				s = u;
				t = s + this.div(x,s);
				u = this.div(t,this.arb2);
			}
			return s;
		}
		if (x < 0) return { re: 0,im: Math.sqrt(-x) };
		return Math.sqrt(x);
	}

	complexAverage(f,x,offset=1e-5) {
		return this.div(this.add(f(this.add(x,offset)),f(this.sub(x,offset))),2);
	}

	complexFromString(s,returnAsString=false) {
		var lead = '',real,imag;
		if (s[0] === '+' || s[0] === '-') {
			lead = s[0];
			s = s.slice(1);
		}
		var plus = s.includes('+');
		var minus = s.includes('-');
		if (plus || sub) {
			var i = s.indexOf(plus ? '+' : '-');
			real = lead + s.slice(0,i);
			imag = s.slice(i+1,s.length-1);
		} else {
			if (s.includes('i')) {
				real = '0';
				imag = lead + s.slice(0,s.length - 1);
			} else {
				real = lead + s;
				imag = '0';
			}
		}
		if (imag === '' || imag === '-') imag += '1';
		if (returnAsString) return "{ re: ${real},im: ${imag} }";
		return { re: +real,im: +imag };
	}

	besselJ(n,x) {
		if (this.isComplex(n) || this.isComplex(x)) {
			if (this.isNegativeInteger(n)) return this.mul(this.pow(-1,n),this.besselJ(this.mul(-1,n),x));
			var product = this.div(this.pow(this.div(x,2),n),this.gamma(this.add(n,1)));
			return this.mul(product,this.hypergeometric0F1(this.add(n,1),this.mul(-.25,this.pow(x,2))));
		} 
		if (this.isNegativeInteger(n)) return (-1)**n * this.besselJ(-n,x);
		if (!Number.isInteger(n) && x < 0) return this.besselJ(n,this.complex(x));
		return (x/2)**n * this.hypergeometric0F1(n+1,-.25*x**2) / this.gamma(n+1);
	}

	besselJZero(n,m,derivative=false) {
		if (n < 0) throw Error('Negative order for Bessel zero');
		if (!Number.isInteger(m)) throw Error('Nonintegral index for Bessel zero');
		// approximations from dlmf.nist.gov/10.21#vi
		var delta = this.pi/4;
		if (derivative) {
			if (n === 0 && m === 1) return 0;
			var b = (m + n/2 - 3/4) * this.pi;
			var e = b - (4*n**2 + 3) / (8*b);
			// keep search evaluation real
			return this.findRoot(x => this.diff(x => this.besselJ(n,x),x),[ e-delta < 0 ? 0 : e-delta,e+delta ]);
		} else {
			var a = (m + n/2 - 1/4) * pi;
			var e = a - (4*n**2 - 1) / (8*a);
			return this.findRoot(x => this.besselJ(n,x),[ e-delta,e+delta ]);
		}
	}

	besselY(n,x) {
	if (this.isComplex(n) || this.isComplex(x)) {
			// dlmf.nist.gov/10.2.3
			if (this.isInteger(n))
				return this.div(this.add(this.diff(n => this.besselJ(n,x),n),
					this.mul(this.pow(-1,n),this.diff(n => this.besselJ(n,x),this.neg(n)))),this.pi);
			var sum = this.sub(this.mul(this.besselJ(n,x),this.cos(this.mul(n,this.pi))),this.besselJ(this.mul(-1,n),x));
			return this.div(sum,this.sin(this.mul(n,this.pi)));

		}

		if (x < 0) return this.besselY(n,this.complex(x));

		// dlmf.nist.gov/10.2.3
		if (Number.isInteger(n))
			return (this.diff(n => this.besselJ(n,x),n) + (-1)**n * this.diff(n => this.besselJ(n,x),-n)) / this.pi;

		return (this.besselJ(n,x) * this.cos(n*this.pi) - this.besselJ(-n,x)) / this.sin(n*this.pi);
	}

	besselYZero(n,m,derivative=false) {

		if (n < 0) throw Error('Negative order for Bessel zero');
		if (!Number.isInteger(m)) throw Error('Nonintegral index for Bessel zero');

		// approximations from dlmf.nist.gov/10.21#vi
		var delta = this.pi/4;

		if (derivative) {

			var b = (m + n/2 - 1/4) * this.pi;
			var e = b - (4*n**2 + 3) / (8*b);

			return this.findRoot(x => this.diff(x => this.besselY(n,x),x),[ e-delta,e+delta ]);

		} else {

			var a = (m + n/2 - 3/4) * this.pi;
			var e = a - (4*n**2 - 1) / (8*a);

			return this.findRoot(x => this.besselY(n,x),[ e-delta,e+delta ]);

		}

	}

	besselI(n,x) {

		if (this.isComplex(n) || this.isComplex(x)) {

			if (this.isNegativeInteger(n)) return this.besselI(this.mul(-1,n),x);

			var product = this.div(this.pow(this.div(x,2),n),this.gamma(this.add(n,1)));
			return this.mul(product,this.hypergeometric0F1(this.add(n,1),this.mul(.25,this.pow(x,2))));

		}

		if (this.isNegativeInteger(n)) return this.besselI(-n,x);

		if (!Number.isInteger(n) && x < 0) return this.besselI(n,this.complex(x));

		return (x/2)**n * this.hypergeometric0F1(n+1,.25*x**2) / this.gamma(n+1);

	}

	besselK(n,x) {

		var useAsymptotic = 10;

		if (this.isComplex(n) || this.isComplex(x)) {

			// asymptotic form as per Johansson arxiv.org/abs/1606.06977
			if (this.abs(x) > useAsymptotic) {

				var t1 = this.mul(this.sqrt(this.div(this.pi/2,x)),this.exp(this.neg(x)));
				var t2 = this.hypergeometric2F0(this.add(n,.5),this.sub(.5,n),this.div(-.5,x));

				return this.mul(t1,t2);

			}

			// dlmf.nist.gov/10.27.5
			if (this.isInteger(n))
				return this.mul(this.pow(-1,this.add(n,1)),.5,
										this.add(this.diff(n => this.besselI(n,x),n),this.diff(n => this.besselI(n,x),this.neg(n))));

			var product = this.div(this.pi/2,this.sin(this.mul(n,this.pi)));
			return this.mul(product,this.sub(this.besselI(this.mul(-1,n),x),this.besselI(n,x)));

		}

		if (x > useAsymptotic)
			return this.sqrt(this.pi/2/x) * this.exp(-x) * this.hypergeometric2F0(n+.5,.5-n,-.5/x);

		if (x < 0) return this.besselK(n,this.complex(x));

		// dlmf.nist.gov/10.27.5
		if (Number.isInteger(n))
			return (-1)**(n+1)/2 * (this.diff(n => this.besselI(n,x),n) + this.diff(n => this.besselI(n,x),-n));

		return this.pi/2 * (this.besselI(-n,x) - this.besselI(n,x)) / this.sin(n*this.pi);

	}

	hankel1(n,x) {
		return this.add(this.besselJ(n,x),this.mul(this.complex(0,1),this.besselY(n,x)));
	}

	hankel2(n,x) {
		return this.sub(this.besselJ(n,x),this.mul(this.complex(0,1),this.besselY(n,x)));
	}

	// dlmf.nist.gov/9.2.ii and dlmf.nist.gov/9.6.i

	airyAi(x) {
		if (this.isComplex(x)) {
			if (this.isZero(x)) return this.complex(1 / 3**(2/3) / this.gamma(2/3));
			if (x.re < 0) {
				var z = this.mul(2/3,this.pow(this.neg(x),3/2));
				return this.mul(1/3,this.sqrt(this.neg(x)),this.add(this.besselJ(1/3,z),this.besselJ(-1/3,z)));
			}
			var z = this.mul(2/3,this.pow(x,3/2));
			return this.mul(1/this.pi,this.sqrt(this.div(x,3)),this.besselK(1/3,z));
		}
		if (x === 0) return 1 / 3**(2/3) / this.gamma(2/3);
		if (x < 0) {
			var z = 2/3 * (-x)**(3/2);
			return this.sqrt(-x) / 3 * (this.besselJ(1/3,z) + this.besselJ(-1/3,z));
		}
		var z = 2/3 * x**(3/2);
		return 1/this.pi * this.sqrt(x/3) * this.besselK(1/3,z);
	}

	airyAiPrime(x) {
		if (this.isComplex(x)) {
			if (this.isZero(x)) return this.complex(-1 / 3**(1/3) / this.gamma(1/3));
			if (x.re < 0) {
				var z = this.mul(2/3,this.pow(this.neg(x),3/2));
				return this.mul(1/3,x,this.sub(this.besselJ(-2/3,z),this.besselJ(2/3,z)));
			}
			var z = this.mul(2/3,this.pow(x,3/2));
			return this.mul(-1/this.pi/this.sqrt(3),x,this.besselK(2/3,z));
		}
		if (x === 0) return -1 / 3**(1/3) / this.gamma(1/3);
		if (x < 0) {
			var z = 2/3 * (-x)**(3/2);
			return x/3 * (this.besselJ(-2/3,z) - this.besselJ(2/3,z));
		}
		var z = 2/3 * x**(3/2);
		return -1/this.pi/this.sqrt(3) * x * this.besselK(2/3,z);
	}

	airyBi(x) {
		if (this.isComplex(x)) {
			if (this.isZero(x)) return this.complex(1 / 3**(1/6) / this.gamma(2/3));
			if (x.re < 0) {
				var z = this.mul(2/3,this.pow(this.neg(x),3/2));
				return this.mul(this.sqrt(this.div(this.neg(x),3)),this.sub(this.besselJ(-1/3,z),this.besselJ(1/3,z)));
			}
			var z = this.mul(2/3,this.pow(x,3/2));
			return this.mul(this.sqrt(this.div(x,3)),this.add(this.besselI(1/3,z),this.besselI(-1/3,z)));
		}
		if (x === 0) return 1 / 3**(1/6) / this.gamma(2/3);
		if (x < 0) {
			var z = 2/3 * (-x)**(3/2);
			return this.sqrt(-x/3) * (this.besselJ(-1/3,z) - this.besselJ(1/3,z));
		}
		var z = 2/3 * x**(3/2);
		return this.sqrt(x/3) * (this.besselI(1/3,z) + this.besselI(-1/3,z));
	}

	airyBiPrime(x) {
		if (this.isComplex(x)) {
			if (this.isZero(x)) return this.complex(3**(1/6) / this.gamma(1/3));
			if (x.re < 0) {
				var z = this.mul(2/3,this.pow(this.neg(x),3/2));
				return this.mul(1/this.sqrt(3),this.neg(x),this.add(this.besselJ(2/3,z),this.besselJ(-2/3,z)));
			}
			var z = this.mul(2/3,this.pow(x,3/2));
			return this.mul(1/this.sqrt(3),x,this.add(this.besselI(2/3,z),this.besselI(-2/3,z)));
		}
		if (x === 0) return 3**(1/6) / this.gamma(1/3);
		if (x < 0) {
			var z = 2/3 * (-x)**(3/2);
			return -x/this.sqrt(3) * (this.besselJ(2/3,z) + this.besselJ(-2/3,z));
		}
		var z = 2/3 * x**(3/2);
		return x/this.sqrt(3) * (this.besselI(2/3,z) + this.besselI(-2/3,z));
	}

	sphericalBesselJ(n,x) {
		return this.mul(this.div(this.sqrt(this.pi/2),this.sqrt(x)),this.besselJ(this.add(n,.5),x));
	}

	sphericalBesselY(n,x) {
		return this.mul(this.div(this.sqrt(this.pi/2),this.sqrt(x)),this.besselY(this.add(n,.5),x));
	}

	sphericalHankel1(n,x) {
		return this.add(this.sphericalBesselJ(n,x),this.mul(this.complex(0,1),this.sphericalBesselY(n,x)));
	}

	sphericalHankel2(n,x) {
		return this.sub(this.sphericalBesselJ(n,x),this.mul(this.complex(0,1),this.sphericalBesselY(n,x)));
	}

	struveH(n,x) {
		return 
			this.mul(this.pow(x,this.add(n,1)),this.inv(this.mul(this.pow(2,n),this.sqrt(this.pi),this.gamma(this.add(n,3/2)))),
			this.hypergeometric1F2(1,3/2,this.add(n,3/2),this.mul(-1/4,this.pow(x,2))));
	}

	struveL(n,x) {
		// one sign different from this.struveH
		return this.mul(
			this.pow(x,this.add(n,1)),this.inv(this.mul(this.pow(2,n),this.sqrt(this.pi),this.gamma(this.add(n,3/2)))),
			this.hypergeometric1F2(1,3/2,this.add(n,3/2),this.mul(1/4,this.pow(x,2))));
	}

	jacobiTheta(n,x,q,tolerance=1e-10) {
		var t = this;
		if (this.abs(q) >= 1) throw Error('Unsupported elliptic nome');
		if (![1,2,3,4].includes(n)) throw Error('Undefined Jacobi theta index');
		if (this.isComplex(x) || this.isComplex(q)) {
			if (!this.isComplex(x)) x = this.complex(x);
			var piTau = this.div(this.log(q),this.complex(0,1));
			// dlmf.nist.gov/20.2 to reduce overflow
			if (Math.abs(x.im) > Math.abs(piTau.im) || Math.abs(x.re) > Math.PI) {
				// use floor for consistency with this.fundamentalParallelogram
				var pt = Math.floor(x.im / piTau.im);
				x = this.sub(x,this.mul(pt,piTau));
				var p = Math.floor(x.re / Math.PI);
				x = this.sub(x,p * Math.PI);
				var qFactor = this.pow(q,-pt*pt);
				var eFactor = this.exp(this.mul(-2 * pt,x,this.complex(0,1)));
				// factors can become huge,so this.chop spurious parts first
				return
					(n === 1) ? this.mul(mt.pow(-1,p+pt),qFactor,eFactor,this.chop(this.jacobiTheta(n,x,q),tolerance)) :
					(n === 2) ? this.mul(mt.pow(-1,p),qFactor,eFactor,this.chop(this.jacobiTheta(n,x,q),tolerance)) :
					(n === 3) ? this.mul(qFactor,eFactor,this.chop(this.jacobiTheta(n,x,q),tolerance)) :
					(n === 4) ? this.mul(mt.pow(-1,pt),qFactor,eFactor,this.chop(this.jacobiTheta(n,x,q),tolerance)) : 0;
			}
			var s = this.complex(0);
			var p = this.complex(1);
			function iterator(i,func) {
				while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
					p = func(i++); 
					s = this.add(s,p);
				}
			}
			switch(n) {
				case 1:
					var s = iterator(0,function(i){t.mul(mt.pow(-1,i),t.pow(q,i*i+i),t.this.sin(t.mul_(2*i+1,x)))});
					return this.mul(2,this.pow(q,1/4),s);
				case 2:
					var s = iterator(0,function(i){t.mul(t.pow(q,i*i+i),t.cos(t.mul(2*i+1,x)))});
					return this.mul(2,this.pow(q,1/4),s);
				case 3:
					var s = iterator(1,function(i){t.mul(t.pow(q,i*i),t.cos(t.mul(2*i,x)))});
					return this.add(1,this.mul(2,s));
				case 4:
					var s = iterator(1,function(i){this.mul(this.pow(this.neg(q),i*i),this.cos(this.mul(2*i,x)))});
					return this.add(1,this.mul(2,s));
			}
		} else {
			var s = 0;
			var p = 1;
			function iterator(i,func){
				while (Math.abs(p) > tolerance) {
					p = func(i++);
					s = mt.add(s,p);
				}
			}
			switch(n) {
				case 1:
					if (q < 0) return this.jacobiTheta(n,x,this.complex(q));
					var s = iterator(0,function(i){(-1)**i * q**(i*i+i) * this.sin((2*i+1) * x)});
					return 2 * q**(1/4) * s;
				case 2:
					if (q < 0) return this.jacobiTheta(n,x,this.complex(q));
					var s = iterator(0,function(i){q**(i*i+i) * this.cos((2*i+1) * x)});
					return 2 * q**(1/4) * s;
				case 3:
					var s = iterator(1,function(i){q**(i*i) * this.cos(2*i * x)});
					return 1 + 2 * s;
				case 4:
					var s = iterator(1,function(i){(-q)**(i*i) * this.cos(2*i * x)});
					return 1 + 2 * s;
			}
		}
	}

	ellipticNome(m) {
		if (this.isComplex(m)) return this.exp(this.div(this.mul(-this.pi,this.ellipticF(this.sub(1,m))),this.ellipticF(m)));
		if (m > 1) return this.ellipticNome(this.complex(m));
		if (m < 0) return -this.exp(-this.pi * this.ellipticF(1/(1-m)) / this.ellipticF(m/(m-1)));
		return this.exp(-this.pi * this.ellipticF(1-m) / this.ellipticF(m));
	}

	fundamentalParallelogram(x,p1,p2) {
		// x = m p1 + n p2,solve for m,n
		var m = (x.re * p2.im - x.im * p2.re) / (p1.re * p2.im - p1.im * p2.re);
		var n = (x.im * p1.re - x.re * p1.im) / (p1.re * p2.im - p1.im * p2.re);
		return this.add(x,this.mul(-Math.floor(m),p1),this.mul(-Math.floor(n),p2));
	}

	sn(x,m) {
		if (m > 1 || this.isComplex(x) || this.isComplex(m)) {
			if (!this.isComplex(m)) m = this.complex(m); // ensure K complex
			// dlmf.nist.gov/22.17
			if (this.abs(m) > 1) return this.mul(this.inv(this.sqrt(m)),this.sn(this.mul(this.sqrt(m),x),this.inv(m))); 
			// periods 4K,2iK'
			var p1 = this.mul(4,this.ellipticF(m));
			var p2 = this.mul(this.complex(0,2),this.ellipticF(this.sub(1,m)));
			x = this.fundamentalParallelogram(x,p1,p2);
			var q = this.ellipticNome(m);
			var t = this.div(x,this.pow(this.jacobiTheta(3,0,q),2));
			return this.mul(this.div(this.jacobiTheta(3,0,q),this.jacobiTheta(2,0,q)),
									this.div(this.jacobiTheta(1,t,q),this.jacobiTheta(4,t,q)));
		}
		// dlmf.nist.gov/22.5.ii
		if (m === 0) return this.sin(x);
		if (m === 1) return this.tanh(x);
		var q = this.ellipticNome(m);
		var t = x / this.jacobiTheta(3,0,q)**2;
		return (m < 0) ?
			(this.jacobiTheta(3,0,q) / this.jacobiTheta(4,t,q) * this.div(this.jacobiTheta(1,t,q),this.jacobiTheta(2,0,q)).re) :
			(this.jacobiTheta(3,0,q) / this.jacobiTheta(2,0,q) * this.jacobiTheta(1,t,q) / this.jacobiTheta(4,t,q));
	}

	cn(x,m) {
		if (m > 1 || this.isComplex(x) || this.isComplex(m)) {
			if (!this.isComplex(m)) m = this.complex(m); // ensure K complex
			// dlmf.nist.gov/22.17
			if (this.abs(m) > 1) return this.dn(this.mul(this.sqrt(m),x),this.inv(m)); 
			// periods 4K,2K + 2iK'
			var p1 = this.mul(4,this.ellipticF(m));
			var p2 = this.add(this.div(p1,2),this.mul(this.complex(0,2),this.ellipticF(this.sub(1,m))));
			x = this.fundamentalParallelogram(x,p1,p2);
			var q = this.ellipticNome(m);
			var t = this.div(x,this.pow(this.jacobiTheta(3,0,q),2));
			return this.mul(
				this.div(this.jacobiTheta(4,0,q),this.jacobiTheta(2,0,q)),
				this.div(this.jacobiTheta(2,t,q),this.jacobiTheta(4,t,q)));
		}
		// dlmf.nist.gov/22.5.ii
		if (m === 0) return this.cos(x);
		if (m === 1) return this.sech(x);
		var q = this.ellipticNome(m);
		var t = x / this.jacobiTheta(3,0,q)**2;
		return (m < 0) ?
			(this.jacobiTheta(4,0,q) / this.jacobiTheta(4,t,q) * this.div(this.jacobiTheta(2,t,q),this.jacobiTheta(2,0,q)).re) :
			(this.jacobiTheta(4,0,q) / this.jacobiTheta(2,0,q) * this.jacobiTheta(2,t,q) / this.jacobiTheta(4,t,q));
	}

	dn(x,m) {
		if (m > 1 || this.isComplex(x) || this.isComplex(m)) {
			if (!this.isComplex(m)) m = this.complex(m); // ensure K complex
			// dlmf.nist.gov/22.17
			if (this.abs(m) > 1) return this.cn(this.mul(this.sqrt(m),x),this.inv(m)); 
			// periods 2K,4iK'
			var p1 = this.mul(2,this.ellipticF(m));
			var p2 = this.mul(this.complex(0,4),this.ellipticF(this.sub(1,m)));
			x = this.fundamentalParallelogram(x,p1,p2);
			var q = this.ellipticNome(m);
			var t = this.div(x,this.pow(this.jacobiTheta(3,0,q),2));
			return this.mul(
				this.div(this.jacobiTheta(4,0,q),this.jacobiTheta(3,0,q)),
				this.div(this.jacobiTheta(3,t,q),this.jacobiTheta(4,t,q)));
		}
		// dlmf.nist.gov/22.5.ii
		if (m === 0) return 1;
		if (m === 1) return this.sech(x);
		var q = this.ellipticNome(m);
		var t = x / this.jacobiTheta(3,0,q)**2;
		return this.jacobiTheta(4,0,q) / this.jacobiTheta(3,0,q) * this.jacobiTheta(3,t,q) / this.jacobiTheta(4,t,q);
	}

	am(x,m) {
		if (m > 1 || this.isComplex(x) || this.isComplex(m)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(m)) m = this.complex(m);
			if (m.im === 0 && m.re <= 1) {
				var K = this.ellipticF(m.re);
				var n = Math.round(x.re / 2 / K);
				x = this.sub(x,2 * n * K);
				if (m.re < 0) {
					var Kp = this.ellipticF(1 - m.re);
					var p = Math.round(x.im / 2 / Kp.re);
					// bitwise test for odd integer
					if (p & 1) return this.sub(n * this.pi,this.arcsin(this.sn(x,m)));
				}
				return this.add(this.arcsin(this.sn(x,m)),n * this.pi);
			}
			return this.arcsin(this.sn(x,m));
		} else {
			var K = this.ellipticF(m);
			var n = Math.round(x / 2 / K);
			x = x - 2 * n * K;
			return Math.asin(this.sn(x,m)) + n * this.pi;
		}
	}

	weierstrassRoots(g2,g3) {
		function cubicTrigSolution(p,q,n) {
			// p,q both negative in defining cubic
			return this.mul(
				2/this.sqrt(3),
				this.sqrt(p),
				this.cos(
					this.sub(
						this.div(
							this.arccos(this.mul(3*this.sqrt(3)/2,q,this.pow(p,-3/2))),3),
														2*this.pi*n/3)));
		}

		g2 = this.div(g2,4);
		g3 = this.div(g3,4);

		var e1 = cubicTrigSolution(g2,g3,0);
		var e2 = cubicTrigSolution(g2,g3,1);
		var e3 = cubicTrigSolution(g2,g3,2);

		return [ e1,e2,e3 ];

	}

	weierstrassHalfPeriods(g2,g3) {

		// Davis,Intro to Nonlinear Diff. & Integral Eqs.,pp.157-8
		// consistent with periods of Jacobi sine in weierstrassP
		// not consistent with Mathematica

		var [ e1,e2,e3 ] = this.weierstrassRoots(g2,g3);

		var lambda = this.sqrt(this.sub(e1,e3));
		var m = this.div(this.sub(e2,e3),this.sub(e1,e3));

		var w1 = this.div(this.ellipticF(m),lambda);
		var w3 = this.div(this.mul(this.complex(0,1),this.ellipticF(this.sub(1,m))),lambda);

		return [ w1,w3 ];

	}

	weierstrassInvariants(w1,w3) {

		if (!this.isComplex(w1)) w1 = this.complex(w1);
		if (!this.isComplex(w3)) w3 = this.complex(w3);

		// order half periods by complex slope
		if (w3.im/w3.re < w1.im/w1.re) [ w1,w3 ] = [ w3,w1 ];

		var ratio =	this.div(w3,w1),conjugate;

		if (ratio.im < 0) {
			ratio.im = -ratio.im;
			conjugate = true;
		}

		var q = this.exp(this.mul(this.complex(0,1),this.pi,ratio));

		// en.wikipedia.org/wiki/Weierstrass's_elliptic_functions
		// modified for input of half periods

		var a = this.jacobiTheta(2,0,q);
		var b = this.jacobiTheta(3,0,q);

		var g2 = this.mul(
			4/3*this.pi**4,
			this.pow(this.mul(2,w1),-4),
			this.add(
				this.pow(a,8),
				this.mul(
					-1,
					this.pow(a,4),
					this.pow(b,4)),
					this.pow(b,8)));

		var g3 = this.mul(
			8/27*this.pi**6,
			this.pow(this.mul(2,w1),-6),
			this.add(
				this.pow(a,12),
				this.mul(-3/2,
				this.pow(a,8),
				this.pow(b,4)),
				this.mul(
					-3/2,
					this.pow(a,4),
					this.pow(b,8)),
					this.pow(b,12)));
		if (conjugate) {
			g2.im = -g2.im;
			g3.im = -g3.im;
		}
		return [ g2,g3 ];
	}


	weierstrassP(x,g2,g3) {

		if (!this.isComplex(x)) x = this.complex(x);

		var [ e1,e2,e3 ] = this.weierstrassRoots(g2,g3);

		// Whittaker & Watson,Section 22.351

		var m = this.div(this.sub(e2,e3),this.sub(e1,e3));

		return this.add(e3,this.mul(this.sub(e1,e3),this.pow(this.sn(this.mul(x,this.sqrt(this.sub(e1,e3))),m),-2)));

	}

	weierstrassPPrime(x,g2,g3) {
		if (!this.isComplex(x)) x = this.complex(x);
		var [ e1,e2,e3 ] = this.weierstrassRoots(g2,g3);
		// Whittaker & Watson,Section 22.351
		var m = this.div(this.sub(e2,e3),this.sub(e1,e3));
		var argument = this.mul(x,this.sqrt(this.sub(e1,e3)));
		return this.mul(
			-2,
			this.pow(this.sub(e1,e3),3/2),
			this.cn(argument,m),
			this.dn(argument,m),
			this.pow(this.sn(argument,m),-3));
	}

	inverseWeierstrassP(x,g2,g3) {
		if (!this.isComplex(x)) x = this.complex(x);
		var [ e1,e2,e3 ] = this.weierstrassRoots(g2,g3);
		// Johansson arxiv.org/pdf/1806.06725.pdf p.17
		// sign of imaginary part on real axis differs from Mathematica
		return this.carlsonRF(this.sub(x,e1),this.sub(x,e2),this.sub(x,e3));
	}

	kleinJ(x) {
		// from mpmath / elliptic.py
		var q = this.exp(this.mul(this.complex(0,this.pi),x));
		var t2 = this.chop(this.jacobiTheta(2,0,q));
		var t3 = this.chop(this.jacobiTheta(3,0,q));
		var t4 = this.chop(this.jacobiTheta(4,0,q));
		var P = this.pow(this.add(this.pow(t2,8),this.pow(t3,8),this.pow(t4,8)),3);
		var Q = this.mul(54,this.pow(this.mul(t2,t3,t4),8));

		return this.div(P,Q);

	}


	// Carlson symmetric integrals

	carlsonRC(x,y) {
		if (x < 0 || y < 0 || this.isComplex(x) || this.isComplex(y)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(y)) y = this.complex(y);
			if (x.re === y.re && x.im === y.im) return this.inv(this.sqrt(x));
			// return value by continuity
			return this.div(this.arccos(this.div(this.sqrt(x),this.sqrt(y))),this.mul(this.sqrt(y),this.sqrt(this.sub(1,this.div(x,y)))));
		}
		if (x === y) return 1 / Math.sqrt(x);
		if (x < y) return Math.acos(Math.sqrt(x/y)) / Math.sqrt(y-x);
		return Math.acosh(Math.sqrt(x/y)) / Math.sqrt(x-y);
	}

	carlsonRD(x,y,z) {
		return this.carlsonRJ(x,y,z,z);
	}

	carlsonRF(x,y,z,tolerance=1e-10) {

		if (this.isComplex(x) || this.isComplex(y) || this.isComplex(z)) {

			var xm = x;
			var ym = y;
			var zm = z;

			var Am = A0 = this.div(this.add(x,y,z),3);
			var Q = Math.pow(3*tolerance,-1/6)
							* Math.max(this.abs(this.sub(A0,x)),this.abs(this.sub(A0,y)),this.abs(this.sub(A0,z)));
			var g = .25;
			var pow4 = 1;
			var m = 0;

			while (true) {
				var xs = this.sqrt(xm);
				var ys = this.sqrt(ym);
				var zs = this.sqrt(zm);
				var lm = this.add(this.mul(xs,ys),this.mul(xs,zs),this.mul(ys,zs));
				var Am1 = this.mul(this.add(Am,lm),g);
				xm = this.mul(this.add(xm,lm),g);
				ym = this.mul(this.add(ym,lm),g);
				zm = this.mul(this.add(zm,lm),g);
				if (pow4 * Q < this.abs(Am)) break;
				Am = Am1;
				m += 1;
				pow4 *= g;
			}

			var t = this.div(pow4,Am);
			var X = this.mul(this.sub(A0,x),t);
			var Y = this.mul(this.sub(A0,y),t);
			var Z = this.neg(this.add(X,Y));
			var E2 = this.sub(this.mul(X,Y),this.mul(Z,Z));
			var E3 = this.mul(X,Y,Z);

			return this.mul(this.pow(Am,-.5),
							 this.add(9240,this.mul(-924,E2),this.mul(385,E2,E2),this.mul(660,E3),this.mul(-630,E2,E3)),1/9240);

		} else {
			if (y === z) return this.carlsonRC(x,y);
			if (x === z) return this.carlsonRC(y,x);
			if (x === y) return this.carlsonRC(z,x);
			// adapted from mpmath / elliptic.py
			var xm = x;
			var ym = y;
			var zm = z;
			var Am = A0 = (x + y + z) / 3;
			var Q = Math.pow(3*tolerance,-1/6) * Math.max(Math.abs(A0-x),Math.abs(A0-y),Math.abs(A0-z));
			var g = .25;
			var pow4 = 1;
			var m = 0;
			while (true) {
				var xs = Math.sqrt(xm);
				var ys = Math.sqrt(ym);
				var zs = Math.sqrt(zm);
				var lm = xs*ys + xs*zs + ys*zs;
				var Am1 = (Am + lm) * g;
				xm = (xm + lm) * g;
				ym = (ym + lm) * g;
				zm = (zm + lm) * g;
				if (pow4 * Q < Math.abs(Am)) break;
				Am = Am1;
				m += 1;
				pow4 *= g;
			}
			var t = pow4 / Am;
			var X = (A0-x) * t;
			var Y = (A0-y) * t;
			var Z = -X-Y;
			var E2 = X*Y - Z**2;
			var E3 = X*Y*Z;
			return Math.pow(Am,-.5) * (9240 - 924*E2 + 385*E2**2 + 660*E3 - 630*E2*E3) / 9240;
		}

	}

	carlsonRG(x,y,z) {
		var t1 = this.mul(z,this.carlsonRF(x,y,z));
		var t2 = this.mul(-1/3,this.sub(x,z),this.sub(y,z),this.carlsonRD(x,y,z));
		var t3 = this.sqrt(this.mul(x,y,this.inv(z)));
		return this.mul(.5,this.add(t1,t2,t3));
	}

	carlsonRJ(x,y,z,p,tolerance=1e-10) {

		if (this.isComplex(x) || this.isComplex(y) || this.isComplex(z) || this.isComplex(p)) {

			var xm = x;
			var ym = y;
			var zm = z;
			var pm = p;

			var A0 = Am = this.div(this.add(x,y,z,this.mul(2,p)),5);
			var delta = this.mul(this.sub(p,x),this.sub(p,y),this.sub(p,z));
			var Q = Math.pow(.25*tolerance,-1/6)
							* Math.max(this.abs(this.sub(A0,x)),this.abs(this.sub(A0,y)),this.abs(this.sub(A0,z)),this.abs(this.sub(A0,p)));
			var m = 0;
			var g = .25;
			var pow4 = 1;
			var S = this.complex(0);

			while (true) {
				var sx = this.sqrt(xm);
				var sy = this.sqrt(ym);
				var sz = this.sqrt(zm);
				var sp = this.sqrt(pm);
				var lm = this.add(this.mul(sx,sy),this.mul(sx,sz),this.mul(sy,sz));
				var Am1 = this.mul(this.add(Am,lm),g);
				xm = this.mul(this.add(xm,lm),g);
				ym = this.mul(this.add(ym,lm),g);
				zm = this.mul(this.add(zm,lm),g);
				pm = this.mul(this.add(pm,lm),g);
				var dm = this.mul(this.add(sp,sx),this.add(sp,sy),this.add(sp,sz));
				var em = this.mul(delta,Math.pow(4,-3*m),this.inv(dm),this.inv(dm));
				if (pow4 * Q < this.abs(Am)) break;
				var T = this.mul(this.carlsonRC(1,this.add(1,em)),pow4,this.inv(dm));
				S = this.add(S,T);
				pow4 *= g;
				m += 1;
				Am = Am1;
			}

			var t = this.div(Math.pow(2,-2*m),Am);
			var X = this.mul(this.sub(A0,x),t);
			var Y = this.mul(this.sub(A0,y),t);
			var Z = this.mul(this.sub(A0,z),t);
			var P = this.div(this.add(X,Y,Z),-2);
			var E2 = this.add(this.mul(X,Y),this.mul(X,Z),this.mul(Y,Z),this.mul(-3,P,P));
			var E3 = this.add(this.mul(X,Y,Z),this.mul(2,E2,P),this.mul(4,P,P,P));
			var E4 = this.mul(this.add(this.mul(2,X,Y,Z),this.mul(E2,P),this.mul(3,P,P,P)),P);
			var E5 = this.mul(X,Y,Z,P,P);
			P = this.add(24024,this.mul(-5148,E2),this.mul(2457,E2,E2),this.mul(4004,E3),this.mul(-4158,E2,E3),this.mul(-3276,E4),this.mul(2772,E5));
			var v1 = this.mul(g**m,this.pow(Am,-1.5),P,1/24024);
			var v2 = this.mul(6,S);

			return this.add(v1,v2);

		} else {

			// adapted from mpmath / elliptic.py

			var xm = x;
			var ym = y;
			var zm = z;
			var pm = p;

			var A0 = Am = (x + y + z + 2*p) / 5;
			var delta = (p-x) * (p-y) * (p-z);
			var Q = Math.pow(.25*tolerance,-1/6)
							* Math.max(Math.abs(A0-x),Math.abs(A0-y),Math.abs(A0-z),Math.abs(A0-p));
			var m = 0;
			var g = .25;
			var pow4 = 1;
			var S = 0;

			while (true) {
				var sx = Math.sqrt(xm);
				var sy = Math.sqrt(ym);
				var sz = Math.sqrt(zm);
				var sp = Math.sqrt(pm);
				var lm = sx*sy + sx*sz + sy*sz;
				var Am1 = (Am + lm) * g;
				xm = (xm + lm) * g;
				ym = (ym + lm) * g;
				zm = (zm + lm) * g;
				pm = (pm + lm) * g;
				var dm = (sp+sx) * (sp+sy) * (sp+sz);
				var em = delta * Math.pow(4,-3*m) / dm**2;
				if (pow4 * Q < Math.abs(Am)) break;
				var T = this.carlsonRC(1,1 + em) * pow4 / dm;
				S += T;
				pow4 *= g;
				m += 1;
				Am = Am1;
			}

			var t = Math.pow(2,-2*m) / Am;
			var X = (A0-x) * t;
			var Y = (A0-y) * t;
			var Z = (A0-z) * t;
			var P = (-X-Y-Z) / 2;
			var E2 = X*Y + X*Z + Y*Z - 3*P**2;
			var E3 = X*Y*Z + 2*E2*P + 4*P**3;
			var E4 = (2*X*Y*Z + E2*P + 3*P**3) * P;
			var E5 = X*Y*Z*P**2;
			P = 24024 - 5148*E2 + 2457*E2**2 + 4004*E3 - 4158*E2*E3 - 3276*E4 + 2772*E5;
			var v1 = g**m * Math.pow(Am,-1.5) * P / 24024;
			var v2 = 6*S;

			return v1 + v2;

		}

	}

	// elliptic integrals

	ellipticF(x,m) {
		
		var sinx = this.sin(x);
		var cosx = this.cos(x);
		var cx = this.isComplex(x);

		if (arguments.length === 1) {
			m = x;
			x = this.pi / 2;
		}

		if (cx || this.isComplex(m)) {

			if (!cx) x = this.complex(x);

			var period = this.complex(0);
			if (Math.abs(x.re) > this.pi / 2) {
				var p = Math.round(x.re / this.pi);
				x.re = x.re - p * this.pi;
				period = this.mul(2 * p,this.ellipticF(m));
			}

			return this.add(this.mul(sinx,this.carlsonRF(this.mul(cosx,cosx),this.sub(1,this.mul(m,sinx,sinx)),1)),period);

		} else {

			if (m > 1 && Math.abs(x) > Math.asin(1 / Math.sqrt(m))) return this.ellipticF(this.complex(x),m);

			var period = 0;
			if (Math.abs(x) > this.pi / 2) {
				var p = Math.round(x / this.pi);
				x = x - p * this.pi;
				period = 2 * p * this.ellipticF(m);
			}

			return sinx * this.carlsonRF(cosx**2,1 - m * sinx**2,1) + period;

		}

	}

	ellipticF(m) {
		return this.ellipticF(m);
	}

	ellipticE(x,m) {
		if (arguments.length === 1) {
			m = x;
			x = this.pi / 2;
		}
		var sinx = this.sin(x);
		var cosx = this.cos(x);
		var cx = this.isComplex(x);
		if (cx || this.isComplex(m)) {
			if (!cx) x = this.complex(x);
			var period = this.complex(0);
			if (Math.abs(x.re) > this.pi / 2) {
				var p = Math.round(x.re / this.pi);
				x.re = x.re - p * this.pi;
				period = this.mul(2 * p,	this.ellipticE(m));
			}
			return this.add(
				this.mul(
					sinx,
					this.carlsonRF(
						this.mul(cosx,cosx),
						this.sub(1,this.mul(m,sinx,sinx)),
						1
					)
				),
				this.mul(
					-1/3,
					m,
					this.pow(sinx,3),
					this.carlsonRD(
						this.mul(cosx,cosx),
						this.sub(
							1,
							this.mul(m,sinx,sinx)
						),
						1
					)
				),
				period);
		} else {
			if (m > 1 && Math.abs(x) > Math.asin(1 / Math.sqrt(m))) return this.ellipticE(this.complex(x),m);
			var period = 0;
			if (Math.abs(x) > this.pi / 2) {
				var p = Math.round(x / this.pi);
				x = x - p * this.pi;
				period = 2 * p * this.ellipticE(m);
			}
			var cosxpw2 = cosx**2;
			var sinxpw2 = sinx**2;
			var sinxpw3 = sinx**3;
			return 
				sinx * this.carlsonRF(cosxpw2,1 - m * sinxpw2,1) - m / 3 * sinxpw3 * this.carlsonRD(cosxpw2,1 - m * sinxpw2,1) + period;
		}
	}

	ellipticPi(n,x,m) {

		if (arguments.length === 2) {
			m = x;
			x = this.pi / 2;
		}
		
		var sinx = this.sin(x);
		var cosx = this.cos(x);

		// x outside period and this.abs(n)>1 agrees with mpmath,differs from Mathematica

		if (this.isComplex(n) || this.isComplex(x) || this.isComplex(m)) {

			if (!this.isComplex(x)) x = this.complex(x);

			var period = this.complex(0);
			if (Math.abs(x.re) > this.pi / 2) {
				var p = Math.round(x.re / this.pi);
				x.re = x.re - p * this.pi;
				period = this.mul(2 * p,this.ellipticPi(n,m));
			}

			return this.add(this.mul(sinx,this.carlsonRF(this.mul(cosx,cosx),this.sub(1,this.mul(m,sinx,sinx)),1)),
									this.mul(1/3,n,this.pow(sinx,3),
										this.carlsonRJ(this.mul(cosx,cosx),this.sub(1,this.mul(m,sinx,sinx)),1,this.sub(1,this.mul(n,sinx,sinx)))),
									period);

		} else {

			if (n > 1 && Math.abs(x) > Math.asin(1 / Math.sqrt(n))) return this.ellipticPi(n,this.complex(x),m);

			if (m > 1 && Math.abs(x) > Math.asin(1 / Math.sqrt(m))) return this.ellipticPi(n,this.complex(x),m);

			var period = 0;
			if (Math.abs(x) > this.pi / 2) {
				var p = Math.round(x / this.pi);
				x = x - p * this.pi;
				period = 2 * p * this.ellipticPi(n,m);
			}

			return 
				sinx * this.carlsonRF(cosx**2,1 - m * sinx**2,1) + n / 3 * sinx**3 * 
				this.carlsonRJ(cosx**2,1 - m * sinx**2,1,1 - n * sinx**2) + period;
		}
	}

	jacobiZeta(x,m) {
		// using definition matching elliptic integrals
		// alternate definition replaces x with this.am(x,m)
		return this.sub(this.ellipticE(x,m),this.mul(this.ellipticF(x,m),this.ellipticE(m),this.inv(this.ellipticF(m))));
	}

	factorial(n) {
		if (this.isComplex(n)) return (this.isPositiveIntegerOrZero(n.re)) ? this.complex(this.factorial(n.re)) : this.gamma(this.add(n,1));
		if (this.isPositiveIntegerOrZero(n)) {
			if (this.factorialCache[n]) return this.factorialCache[n];
			var last = this.factorialCache.length - 1;
			var result = this.factorialCache[last];
			for (var i = last + 1 ; i <= n ; i++) {
				result *= i;
				this.factorialCache[i] = result;
			}
			return result;
		}
		return this.gamma(n+1);
	}

	factorial2(n) {
		if (this.isZero(n)) return 1;
		if (this.isPositiveInteger(n)) {
			// bitwise test for odd integer,upward recursion for possible caching
			var result = n & 1 ? 1 : 2;
			for (var i = result + 2 ; i <= n ; i += 2) result *= i;
			return result;
		}
		var f1 = this.pow(2,this.div(n,2));
		var f2 = this.pow(this.pi/2,this.div(this.sub(this.cos(this.mul(this.pi,n)),1),4));
		var f3 = this.gamma(this.add(this.div(n,2) ,1));
		return this.mul(f1,f2,f3);
	}

	binomial(n,m) {
		if (Number.isInteger(m) && m < 0 && n >= 0) return 0;
		if (Number.isInteger(n) && Number.isInteger(m) && n >= 0 && m > n) return 0;
		if (this.isComplex(n) || this.isComplex(m))
			return this.div(this.factorial(n),this.mul(this.factorial(this.sub(n,m)),this.factorial(m)));
		return this.factorial(n) / this.factorial(n-m) / this.factorial(m);
	}


	// this.log of this.gamma less likely to overflow than this.gamma
	// Lanczos approximation as evaluated by Paul Godfrey

	logGamma(x) {

		var c = [ 57.1562356658629235,-59.5979603554754912,14.1360979747417471,
							-.491913816097620199,.339946499848118887e-4,.465236289270485756e-4,
							-.983744753048795646e-4,.158088703224912494e-3,-.210264441724104883e-3,
							.217439618115212643e-3,-.164318106536763890e-3,.844182239838527433e-4,
							-.261908384015814087e-4,.368991826595316234e-5 ];

		if (this.isComplex(x)) {

			if (this.isNegativeIntegerOrZero(x)) throw Error('Gamma function pole');

			// reflection formula with modified Hare correction to imaginary part
			if (x.re < 0) {
				var t = this.sub(this.log(this.div(this.pi,this.sin(this.mul(this.pi,x)))),this.logGamma(this.sub(1,x)));
				var s = x.im < 0 ? -1 : 1;
				var d = x.im === 0 ? 1/4 : 0;
				var k = Math.ceil(x.re/2 - 3/4 + d);
				return this.add(t,this.complex(0,2*s*k*this.pi));
			}

			var t = this.add(x,5.24218750000000000);
			t = this.sub(this.mul(this.add(x,.5),this.log(t)),t);
			var s = .999999999999997092;
			for (var j = 0 ; j < 14 ; j++) s = this.add(s,this.div(c[j],this.add(x,j+1)));
			var u = this.add(t,this.log(this.mul(2.5066282746310005,this.div(s,x))));

			// adjustment to keep imaginary part on same sheet
			if (s.re < 0) {
				if(x.im < 0 && this.div(s,x).im < 0) u = this.add(u,this.complex(0,2*this.pi));
				if(x.im > 0 && this.div(s,x).im > 0) u = this.add(u,this.complex(0,-2*this.pi));
			}

			return u;

		} else {

			if (this.isNegativeIntegerOrZero(x)) throw Error('Gamma function pole'); 

			var t = x + 5.24218750000000000;
			t = (x + .5) * this.log(t) - t;
			var s = .999999999999997092;
			for (var j = 0 ; j < 14 ; j++) s += c[j] / (x+j+1);
			return t + this.log(2.5066282746310005 * s / x);

		}

	}

	gamma(x,y,z) {
		if (arguments.length === 2) {
			if (this.isZero(x)) {
				if (this.isZero(y)) throw Error('Gamma function pole');
				// combination of logarithms adds/subtracts complex(0,pi)
				var sign = y.im > 0 ? -1 : y.im < 0 ? 1 : 0;
				var result = this.add(this.neg(this.expIntegralEi(this.neg(y))),this.complex(0,sign*this.pi));
				if (!this.isComplex(y) && y > 0) return result.re;
				return result;
			}
			// dlmf.nist.gov/8.4.15
			if (this.isNegativeInteger(x)) {
				var n = this.isComplex(x) ? -x.re : -x;
				var t = this.mul(this.exp(this.neg(y)),this.summation(k => this.div((-1)**k*this.factorial(k),this.pow(y,k+1)),[0,n-1]));
				var result = this.mul((-1)**n/this.factorial(n),this.sub(expIntegralE(1,y),t));
				if (this.isComplex(x) && !this.isComplex(result)) return this.complex(result); // complex in,complex out
				return result;
			}
			return this.sub(this.gamma(x),this.gamma(x,0,y));
		}
		if (arguments.length === 3) {
			if (!this.isZero(y)) return this.sub(this.gamma(x,0,z),this.gamma(x,0,y));
			return this.mul(this.pow(z,x),this.inv(x),this.hypergeometric1F1(x,this.add(x,1),this.neg(z)));
		}
		return this.isPositiveInteger(x) ? 
			this.factorial(this.sub(x,1)) :
			// this.logGamma complex on negative axis
			(!this.isComplex(x) && x < 0) ? this.exp(this.logGamma(this.complex(x))).re : this.exp(this.logGamma(x));
	}

	gammaRegularized(x,y,z) {
		if (arguments.length === 3) return this.div(this.gamma(x,y,z),this.gamma(x));
		return this.div(this.gamma(x,y),this.gamma(x));
	}

	beta(x,y,z,w) {
		return (arguments.length === 4) ?
			this.sub(this.beta(y,z,w),this.beta(x,z,w)) :
			(arguments.length === 3) ? 
				this.mul(this.pow(x,y),this.inv(y),this.hypergeometric2F1(y,this.sub(1,z),this.add(y,1),x)) :
				this.div(this.mul(this.gamma(x),this.gamma(y)),this.gamma(this.add(x,y)));
	}

	betaRegularized(x,y,z,w) {
		return(arguments.length === 4) ? 
			this.div(this.beta(x,y,z,w),this.beta(z,w)) :
			this.div(this.beta(x,y,z),this.beta(y,z));
	}

	polygamma(n,x) {
		if (arguments.length === 1) return this.digamma(x);
		if (!this.isPositiveInteger(n)) throw Error('Unsupported polygamma index');
		return this.mul((-1)**(n+1) * this.factorial(n),this.hurwitzZeta(n+1,x));
	}

	digamma(x) {
		return this.diff(x => this.logGamma(x),x);
	}

	erf(x) {
		var useAsymptotic = 5;
		var absArg = Math.abs(this.arg(x));
		if (this.abs(x) > useAsymptotic && (absArg < this.pi/4 || absArg > 3*this.pi/4))
			return this.sub(1,this.erfc(x));
		return this.mul(2/this.sqrt(this.pi),x,this.hypergeometric1F1(.5,1.5,this.neg(this.mul(x,x))));
	}

	erfc(x) {
		var useAsymptotic = 5;
		var absArg = Math.abs(this.arg(x));
		if (this.abs(x) > useAsymptotic && (absArg < this.pi/4 || absArg > 3*this.pi/4)) {
			// as per dlmf.nist.gov/7.12.1 this could be an independent sum for minor improvement
			// these numbers are tiny and need to stay in this function even though
			//	 there is some code duplication with this.erf
			var t = this.mul(
				1/this.sqrt(this.pi),this.exp(this.neg(this.mul(x,x))),this.inv(x),
				this.hypergeometric2F0(.5,1,this.neg(this.inv(this.mul(x,x)))));
			if (x.re < 0 || x < 0) return this.add(2,t);
			return t;
		}
		return this.sub(1,this.erf(x));
	}

	erfi(x) {
		return this.mul(this.complex(0,-1),this.erf(this.mul(this.complex(0,1),x)));
	}

	fresnelS(x) {
		// can also be evaluated with this.hypergeometric1F2
		var m1 = this.hypergeometric1F1(.5,1.5,this.mul(this.complex(0,this.pi/2),this.pow(x,2)));
		var m2 = this.hypergeometric1F1(.5,1.5,this.mul(this.complex(0,-this.pi/2),this.pow(x,2)));
		var result = this.mul(x,this.sub(m1,m2),this.complex(0,-.5));
		return this.isComplex(x) ? result :	result.re;
	}

	fresnelC(x) {
		// can also be evaluated with this.hypergeometric1F2
		var m1 = this.hypergeometric1F1(.5,1.5,this.mul(this.complex(0,this.pi/2),this.pow(x,2)));
		var m2 = this.hypergeometric1F1(.5,1.5,this.mul(this.complex(0,-this.pi/2),this.pow(x,2)));
		var result = this.mul(x,this.add(m1,m2),.5);
		return this.isComplex(x) ? result : result.re;
	}

	expIntegralEi(x,tolerance=1e-10) {
		var useAsymptotic = 26;
		if (this.isComplex(x)) {
			if (this.abs(x) > useAsymptotic) {
				var s = this.complex(1);
				var p = this.complex(1);
				var i = 1;
				while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
					p = this.mul(p,i,this.inv(x));
					s = this.add(s,p);
					i++;
				}
				// combination of logarithms adds/subtracts complex(0,this.pi)
				var sign = x.im > 0 ? 1 : x.im < 0 ? -1 : 0;
				return this.add(this.mul(s,this.exp(x),this.inv(x)),this.complex(0,sign*this.pi));
			}
			// determined from pattern on test page
			var distanceScale = this.abs(this.sub(x,useAsymptotic)) / useAsymptotic;
			var useArbitrary = distanceScale > 1;
			if (useArbitrary) {
				// use only decimals needed
				var n = 17 + Math.round(10 * (distanceScale - 1));
				this.setPrecisionScale(n);
				var y = this.arbitrary(x);
				var s = this.arbitrary(this.complex(0));
				var p = this.arbitrary(this.complex(1));
				var i = this.arb1;
				while (this.div(p.re,i) !== 0n || this.div(p.im,i) !== 0n) {
					p = this.div(this.mul(p,y),i);
					s = this.add(s,this.div(p,i));
					i = this.add(i,this.arb1);
				}
				s = this.add(s,this.nEulerGamma,this.ln(y));
				s = this.arbitrary(s);
			} else {
				var s = this.complex(0);
				var p = this.complex(1);
				var i = 1;
				while (Math.abs(p.re/i) > tolerance || Math.abs(p.im/i) > tolerance) {
					p = this.mul(p,x,1/i);
					s = this.add(s,this.div(p,i));
					i++;
				}
				s = this.add(s,this.eulerGamma,this.log(x));
			}
			// real on negative real axis,set phase explicitly rather than this.log combo
			if (x.re < 0 && x.im === 0) s.im = 0;
			return s;
		} else {
			if (x < 0) return this.expIntegralEi(this.complex(x)).re;
			if (Math.abs(x) > useAsymptotic) {
				var s = 1;
				var p = 1;
				var i = 1;
				while (Math.abs(p) > tolerance) {
					p *= i / x;
					s += p;
					i++;
				}
				return s * Math.exp(x) / x;
			}
			var s = 0;
			var p = 1;
			var i = 1;
			while (Math.abs(p/i) > tolerance) {
				p *= x / i;
				s += p / i;
				i++;
			}
			return s + this.eulerGamma + Math.log(x);
		}
	}

	logIntegral(x) {
		return this.expIntegralEi(this.log(x));
	}

	sinIntegral(x) {
		if (this.isZero(x)) return this.isComplex(x) ? this.complex(0) : 0;
		var ix = this.mul(this.complex(0,1),x);
		var result = this.mul(
			this.complex(0,.5),
			this.add(this.gamma(0,this.neg(ix)),this.neg(this.gamma(0,ix)),this.log(this.neg(ix)),this.neg(this.log(ix))));
		return this.isComplex(x) ? result : result.re;
	}

	cosIntegral(x) {
		// complex for negative real argument
		var ix = this.mul(this.complex(0,1),x);
		return this.sub(
			this.log(x),
			this.mul(.5,this.add(this.gamma(0,this.neg(ix)),this.gamma(0,ix),this.log(this.neg(ix)),this.log(ix))));
	}

	sinhIntegral(x) {
		if (this.isZero(x)) return this.isComplex(x) ? this.complex(0) : 0;
		var result = this.mul(.5,this.add(this.gamma(0,x),this.neg(this.gamma(0,this.neg(x))),this.log(x),this.neg(this.log(this.neg(x)))));
		return this.isComplex(x) ? result : result.re;
	}

	coshIntegral(x) {
		// complex for negative real argument
		return this.mul(-.5,this.add(this.gamma(0,x),this.gamma(0,this.neg(x)),this.neg(this.log(x)),this.log(this.neg(x))));
	}

	expIntegralE(n,x) {
		return this.isZero(n) ? this.div(this.exp(this.neg(x)),x) :
			(this.isZero(x) && (n > 1 || n.re > 1)) ?
				this.inv(this.sub(n,1)) :
				this.mul(this.pow(x,this.sub(n,1)),this.gamma(this.sub(1,n),x));
	}

	hypergeometric0F1(a,x,tolerance=1e-10) {
		var useAsymptotic = 100;
		if (this.isComplex(a) || this.isComplex(x)) {
			if (this.isNegativeIntegerOrZero(a)) throw Error('Hypergeometric function pole');
			// asymptotic form as per Johansson arxiv.org/abs/1606.06977
			if (this.abs(x) > useAsymptotic) {
				// transform variables for convenience
				var b = this.sub(this.mul(2,a),1);
				a = this.sub(a,.5);
				x = this.mul(4,this.sqrt(x));
				// copied from this.hypergeometric1F1
				var t1 = this.mul(this.gamma(b),this.pow(this.neg(x),this.neg(a)),this.inv(this.gamma(this.sub(b,a))));
				t1 = this.mul(t1,this.hypergeometric2F0(a,this.add(a,this.neg(b),1),this.div(-1,x)));
				var t2 = this.mul(this.gamma(b),this.pow(x,this.sub(a,b)),this.exp(x),this.inv(this.gamma(a)));
				t2 = this.mul(t2,this.hypergeometric2F0(this.sub(b,a),this.sub(1,a),this.div(1,x)));
				return this.mul(this.exp(this.div(x,-2)),this.add(t1,t2));
			}
			var s = this.complex(1);
			var p = this.complex(1);
			var i = 1;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.mul(p,x,this.inv(a),1/i);
				s = this.add(s,p);
				a = this.add(a,1);
				i++;
			}
			return s;
		} else {
			if (this.isNegativeIntegerOrZero(a)) throw Error('Hypergeometric function pole');
			// asymptotic form is complex
			if (Math.abs(x) > useAsymptotic) return this.hypergeometric0F1(a,this.complex(x)).re;
			var s = 1;
			var p = 1;
			var i = 1;
			while (Math.abs(p) > tolerance) {
				p *= x / a / i;
				s += p;
				a++;
				i++;
			}
			return s;
		}
	}

	hypergeometric1F1(a,b,x,tolerance=1e-10) {
		if (this.isEqualTo(a,b)) return this.exp(x);
		var useAsymptotic = 30;
		if (this.isComplex(a) || this.isComplex(b) || this.isComplex(x)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (this.isNegativeIntegerOrZero(b)) throw Error('Hypergeometric function pole');
			// Kummer transformation
			if (x.re < 0) return this.mul(this.exp(x),this.hypergeometric1F1(this.sub(b,a),b,this.neg(x)));
			// asymptotic form as per Johansson arxiv.org/abs/1606.06977
			if (this.abs(x) > useAsymptotic) {
				if (this.isZero(a) || this.isNegativeIntegerOrZero(this.sub(b,a)))
					return this.complexAverage(a => this.hypergeometric1F1(a,b,x),a);
				var t1 = this.mul(this.gamma(b),this.pow(this.neg(x),this.neg(a)),this.inv(this.gamma(this.sub(b,a))),
					this.hypergeometric2F0(a,this.add(a,this.neg(b),1),this.div(-1,x)));
				var t2 = this.mul(this.gamma(b),this.pow(x,this.sub(a,b)),this.exp(x),this.inv(this.gamma(a)),
					this.hypergeometric2F0(this.sub(b,a),this.sub(1,a),this.div(1,x)));
				return this.add(t1,t2);
			}
			var s = this.complex(1);
			var p = this.complex(1);
			var i = 1;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.mul(p,x,a,this.inv(b),1/i);
				s = this.add(s,p);
				a = this.add(a,1);
				b = this.add(b,1);
				i++;
			}
			return s;
		} else {
			if (this.isNegativeIntegerOrZero(b)) throw Error('Hypergeometric function pole');
			// Kummer transformation
			if (x < 0) return this.exp(x) * this.hypergeometric1F1(b-a,b,-x);
			// asymptotic form is complex
			if (Math.abs(x) > useAsymptotic) return this.hypergeometric1F1(a,b,this.complex(x)).re;
			var s = 1;
			var p = 1;
			var i = 1;
			while (Math.abs(p) > tolerance) {
				p *= x * a++ / b++ / i++;
				s += p;
			}
			return s;
		}
	}

	hypergeometricU(a,b,x) {
		var useAsymptotic = 20;
		// asymptotic form as per Johansson arxiv.org/abs/1606.06977
		if (this.abs(x) > useAsymptotic) {
			return this.mul(this.pow(x,this.neg(a)),this.hypergeometric2F0(a,this.add(a,this.neg(b),1),this.neg(this.inv(x))));
		}
		if (b === 1 || (b.re === 1 && b.im === 0))
			return this.complexAverage(b => this.hypergeometricU(a,b,x),b);
		var t1 = this.mul(
			this.gamma(this.sub(b,1)),this.inv(this.gamma(a)),this.pow(x,this.sub(1,b)),
			this.hypergeometric1F1(this.add(a,this.neg(b),1),this.sub(2,b),x));
		var t2 = this.mul(
			this.gamma(this.sub(1,b)),this.inv(this.gamma(this.add(a,this.neg(b),1))),
			this.hypergeometric1F1(a,b,x));
		return this.add(t1,t2);
	}

	whittakerM(k,m,x) {
		return this.mul(
			this.exp(this.mul(-.5,x)),
			this.pow(x,this.add(m,.5)),
			this.hypergeometric1F1(
				this.add(m,this.neg(k),.5),
				this.add(this.mul(2,m),1),
				x));
	}

	whittakerW(k,m,x) {
		return this.mul(
			this.exp(this.mul(-.5,x)),
			this.pow(x,this.add(m,.5)),
			this.hypergeometricU(
				this.add(m,this.neg(k),.5),
				this.add(this.mul(2,m),1),x));
	}

	hypergeometric2F0(a,b,x,tolerance=1e-10) {
		var terms = 50;
		if (this.isComplex(a) || this.isComplex(b) || this.isComplex(x)) {
			var s = this.complex(1);
			var p = this.complex(1),pLast = p;
			var converging = false; // first few terms can be larger than unity
			var i = 1;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.mul(p,x,a,b,1/i);
				if (this.abs(p) > this.abs(pLast) && converging) break; // prevent runaway sum
				if (this.abs(p) < this.abs(pLast)) converging = true;
				if (i > terms) throw Error('Not converging after ' + terms + ' terms');
				s = this.add(s,p);
				a = this.add(a,1);
				b = this.add(b,1);
				i++;
				pLast = p;
			}
			return s;
		} else {
			var s = 1;
			var p = 1,pLast = p;
			var converging = false; // first few terms can be larger than unity
			var i = 1;
			while (Math.abs(p) > tolerance) {
				p *= x * a++ * b++ / i++;
				if (Math.abs(p) > Math.abs(pLast) && converging) break; // prevent runaway sum
				if (Math.abs(p) < Math.abs(pLast)) converging = true;
				if (i > terms) throw Error('Not converging after ' + terms + ' terms');
				s += p;
				pLast = p;
			}
			return s;
		}
	}

	hypergeometric2F1(a,b,c,x,tolerance=1e-10) {
		if (this.isEqualTo(a,c)) return this.pow(this.sub(1,x),this.neg(b));
		if (this.isEqualTo(b,c)) return this.pow(this.sub(1,x),this.neg(a));
		if (this.isComplex(a) || this.isComplex(b) || this.isComplex(c) || this.isComplex(x)) {
			// choose smallest absolute value of transformed argument
			// transformations from Abramowitz & Stegun p.559
			// fewer operations compared to dlmf.nist.gov/15.8
			var absArray = [
				this.abs(x),this.abs(this.div(x,this.sub(x,1))),this.abs(this.sub(1,x)),
				this.abs(this.inv(x)),this.abs(this.inv(this.sub(1,x))),this.abs(this.sub(1,this.inv(x)))];
			var index = absArray.indexOf(Math.min.apply(null,absArray));
			switch(index) {
				case 0:
					break;
				case 1:
					return this.mul(this.pow(this.sub(1,x),this.neg(a)),this.hypergeometric2F1(a,this.sub(c,b),c,this.div(x,this.sub(x,1))));
				case 2:
					if (this.isInteger(this.sub(c,this.add(a,b))) || this.isNegativeIntegerOrZero(this.sub(c,a)))
						return this.complexAverage(a => this.hypergeometric2F1(a,b,c,x),a);
					if (this.isNegativeIntegerOrZero(this.sub(c,b)))
						return this.complexAverage(b => this.hypergeometric2F1(a,b,c,x),b);
					var t1 = this.mul(
							this.gamma(c),this.gamma(this.sub(c,this.add(a,b))),
							this.inv(this.gamma(this.sub(c,a))),this.inv(this.gamma(this.sub(c,b))),
							this.hypergeometric2F1(a,b,this.add(a,b,this.neg(c),1),this.sub(1,x)));
					var t2 = this.mul(
							this.pow(this.sub(1,x),this.sub(c,this.add(a,b))),
							this.gamma(c),this.gamma(this.sub(this.add(a,b),c)),this.inv(this.gamma(a)),this.inv(this.gamma(b)),
							this.hypergeometric2F1(this.sub(c,a),this.sub(c,b),this.add(c,this.neg(a),this.neg(b),1),this.sub(1,x)));
					return this.add(t1,t2);
				case 3:
					if (this.isInteger(this.sub(a,b)) || this.isNegativeIntegerOrZero(this.sub(c,a)))
						return this.complexAverage(a => this.hypergeometric2F1(a,b,c,x),a);
					if (this.isNegativeIntegerOrZero(this.sub(c,b)))
						return this.complexAverage(b => this.hypergeometric2F1(a,b,c,x),b);
					var t1 = this.mul(
						this.gamma(c),this.gamma(this.sub(b,a)),this.inv(this.gamma(b)),
						this.inv(this.gamma(this.sub(c,a))),this.pow(this.neg(x),this.neg(a)),
						this.hypergeometric2F1(a,this.add(1,this.neg(c),a),this.add(1,this.neg(b),a),this.inv(x)));
					var t2 = this.mul(
						this.gamma(c),this.gamma(this.sub(a,b)),this.inv(this.gamma(a)),
						this.inv(this.gamma(this.sub(c,b))),this.pow(this.neg(x),this.neg(b)),
						this.hypergeometric2F1(b,this.add(1,this.neg(c),b),this.add(1,this.neg(a),b),this.inv(x)));
					return this.add(t1,t2);
				case 4:
					if (this.isInteger(this.sub(a,b)) || this.isNegativeIntegerOrZero(this.sub(c,a)))
						return this.complexAverage(a => this.hypergeometric2F1(a,b,c,x),a);
					if (this.isNegativeIntegerOrZero(this.sub(c,b)))
						return this.complexAverage(b => this.hypergeometric2F1(a,b,c,x),b);
					var t1 = this.mul(
							this.pow(this.sub(1,x),this.neg(a)),this.gamma(c),this.gamma(this.sub(b,a)),
							this.inv(this.gamma(b)),this.inv(this.gamma(this.sub(c,a))),
							this.hypergeometric2F1(a,this.sub(c,b),this.add(a,this.neg(b),1),this.inv(this.sub(1,x))));
					var t2 = this.mul(
						this.pow(this.sub(1,x),this.neg(b)),this.gamma(c),this.gamma(this.sub(a,b)),
						this.inv(this.gamma(a)),this.inv(this.gamma(this.sub(c,b))),
						this.hypergeometric2F1(b,this.sub(c,a),this.add(b,this.neg(a),1),this.inv(this.sub(1,x))));
					return this.add(t1,t2);
				case 5:
					if (this.isInteger(this.sub(c,this.add(a,b))) || this.isNegativeIntegerOrZero(this.sub(c,a)))
						return this.complexAverage(a => this.hypergeometric2F1(a,b,c,x),a);
					if (this.isNegativeIntegerOrZero(this.sub(c,b)))
						return this.complexAverage(b => this.hypergeometric2F1(a,b,c,x),b);
					var t1 = this.mul(
						this.gamma(c),this.gamma(this.sub(c,this.add(a,b))),this.inv(this.gamma(this.sub(c,a))),
						this.inv(this.gamma(this.sub(c,b))),this.pow(x,this.neg(a)),
						this.hypergeometric2F1(a,this.add(a,this.neg(c),1),this.add(a,b,this.neg(c),1),this.sub(1,this.inv(x))));
					var t2 = this.mul(
						this.gamma(c),this.gamma(this.sub(this.add(a,b),c)),this.inv(this.gamma(a)),this.inv(this.gamma(b)),
						this.pow(this.sub(1,x),this.sub(c,this.add(a,b))),this.pow(x,this.sub(a,c)),
						this.hypergeometric2F1(this.sub(c,a),this.sub(1,a),this.add(c,this.neg(a),this.neg(b),1),this.sub(1,this.inv(x))));
					return this.add(t1,t2);
			}
			if (this.isNegativeIntegerOrZero(c)) throw Error('Hypergeometric function pole');
			var s = this.complex(1);
			var p = this.complex(1);
			var i = 1;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.mul(p,x,a,b,this.inv(c),1/i);
				s = this.add(s,p);
				a = this.add(a,1);
				b = this.add(b,1);
				c = this.add(c,1);
				i++;
			}
			return s;
		} else {
			if (this.isNegativeIntegerOrZero(c)) throw Error('Hypergeometric function pole');
			// transformation from Abramowitz & Stegun p.559
			if (x < -1) {
				var t1 = this.gamma(c) * this.gamma(b-a) / this.gamma(b) / this.gamma(c-a)
									 * (-x)**(-a) * this.hypergeometric2F1(a,1-c+a,1-b+a,1/x);
				var t2 = this.gamma(c) * this.gamma(a-b) / this.gamma(a) / this.gamma(c-b)
									 * (-x)**(-b) * this.hypergeometric2F1(b,1-c+b,1-a+b,1/x);

				return t1 + t2;
			}
			if (x === -1) return this.hypergeometric2F1(a,b,c,this.complex(x)).re;
			if (x === 1)
				if (c - a - b > 0) return this.gamma(c) * this.gamma(c-a-b) / this.gamma(c-a) / this.gamma(c-b);
				else throw Error('Divergent Gauss hypergeometric function');
			if (x > 1) return this.hypergeometric2F1(a,b,c,this.complex(x));
			var s = 1;
			var p = 1;
			var i = 1;
			while (Math.abs(p) > tolerance) {
				p *= x * a++ * b++ / c++ / i++;
				s += p;
			}
			return s;
		}
	}

	hypergeometric1F2(a,b,c,x) {
		var useAsymptotic = 200;
		if (this.isComplex(a) || this.isComplex(b) || this.isComplex(c) || this.isComplex(x)) {
			// functions.wolfram.com/HypergeometricFunctions/Hypergeometric1F2/06/02/03/0002/
			if (this.abs(x) > useAsymptotic) {
				var p = this.div(this.add(a,this.neg(b),this.neg(c),.5),2);
				var ck = [
					1,this.add(this.mul(this.add(this.mul(3,a),b,c,-2),this.sub(a,this.add(b,c)),1/2),this.mul(2,b,c),-3/8),
					this.add(
						this.mul(this.pow(this.add(this.mul(this.add(this.mul(3,a),b,c,-2),this.sub(a,this.add(b,c)),1/4),this.mul(b,c),-3/16),2),2),
						this.mul(-1,this.sub(this.mul(2,a),3),b,c),
						this.mul(this.add(this.mul(-8,this.pow(a,2)),this.mul(11,a),b,c,-2),this.sub(a,this.add(b,c)),1/4),-3/16)
				];
				function w(k) { return this.mul(1/2**k,ck[k],this.pow(this.neg(x),-k/2)); }
				var u1 = this.exp(this.mul(this.complex(0,1),this.add(this.mul(this.pi,p),this.mul(2,this.sqrt(this.neg(x))))));
				var u2 = this.exp(this.mul(this.complex(0,-1),this.add(this.mul(this.pi,p),this.mul(2,this.sqrt(this.neg(x))))));
				var s = this.add(
					this.mul(u1,this.add(1,this.mul(this.complex(0,-1),w(1)),this.neg(w(2)))),
					this.mul(u2,this.add(1,this.mul(this.complex(0,1),w(1)),this.neg(w(2)))));
				var k = 3,wLast = w(2);
				while (this.abs(wLast) > this.abs(w(k))) {
					ck.push(
						this.sub(
							this.mul(
								this.add(
									3*k**2,
									this.mul(this.add(this.mul(-6,a),this.mul(2,b),this.mul(2,c),-4),k),
									this.mul(3,this.pow(a,2)),
									this.neg(this.pow(this.sub(b,c),2)),
									this.neg(this.mul(2,a,this.add(b,c,-2))),
									1/4
								),
								1/(2*k),
								ck[k-1]
							),
							this.mul(
								this.add(k,this.neg(a),b,this.neg(c),-1/2),
								this.add(k,this.neg(a),this.neg(b),c,-1/2),
								this.add(k,this.neg(a),b,c,-5/2),
								ck[k-2]
							)
						)
					);
					s = this.add(s,this.mul(u1,this.pow(this.complex(0,-1),k),w(k)),this.mul(u2,this.pow(this.complex(0,1),k),w(k)));
					wLast = w(k++);
				}
				var t1 = this.mul(1/(2*this.sqrt(this.pi)),this.inv(this.gamma(a)),this.pow(this.neg(x),p),s);
				var t2 = this.mul(this.inv(this.gamma(this.sub(b,a))),this.inv(this.gamma(this.sub(c,a))),this.pow(this.neg(x),this.neg(a)),
					this.hypergeometricSeries([ a,this.add(a,this.neg(b),1),this.add(a,this.neg(c),1) ],[],this.inv(x),true));
				return this.mul(this.gamma(b),this.gamma(c),this.add(t1,t2));
			}
			return this.hypergeometricSeries([a],[b,c],x,true);
		} else {
			// asymptotic form is complex
			if (Math.abs(x) > useAsymptotic) return this.hypergeometric1F2(a,b,c,this.complex(x)).re;
			return this.hypergeometricSeries([a],[b,c],x);
		}
	}

	// convenience function for less-used hypergeometrics
	// accessing array slower than local variables
	// for loops faster than forEach or reduce
	hypergeometricSeries(A,B,x,complexArguments=false,tolerance=1e-10) {
		if (complexArguments) {
			var s = this.complex(1);
			var p = this.complex(1);
			var i = 1;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				for (var j = 0 ; j < A.length ; j++) {
					p = this.mul(p,A[j]);
					A[j] = this.add(A[j],1);
				}
				for (var j = 0 ; j < B.length ; j++) {
					p = this.div(p,B[j]);
					B[j] = this.add(B[j],1);
				}
				p = this.mul(p,x,1/i);
				s = this.add(s,p);
				i++;
			}
			return s;
		} else {
			var s = 1;
			var p = 1;
			var i = 1;
			while (Math.abs(p) > tolerance) {
				for (var j = 0 ; j < A.length ; j++) {
					p *= A[j];
					A[j]++;
				}
				for (var j = 0 ; j < B.length ; j++) {
					p /= B[j];
					B[j]++;
				}
				p *= x / i++;
				s += p;
			}
			return s;
		}
	}

	hypergeometricPFQ(A,B,x) {
		// dlmf.nist.gov/16.11 for general transformations
		// for B.length > A.length terms can get very large
		// roundoff errors even for formally convergent series
		if (this.abs(x) > 1) throw Error('General hypergeometric argument currently restricted');
		// check for complex parameters
		var cp = false;
		A.forEach(a => cp = cp || this.isComplex(a));
		B.forEach(b => cp = cp || this.isComplex(b));
		if (cp || this.isComplex(x)) return this.hypergeometricSeries(A,B,x,true);
		return this.hypergeometricSeries(A,B,x);
	}

	exp(x) {
		if (this.isArbitrary(x)) {
			if (this.isComplex(x))
				return {
					re: this.mul(this.exp(x.re),this.cos(x.im)),
					im: this.mul(this.exp(x.re),this.sin(x.im))
				}
			var m = Math.trunc(this.arbitrary(this.div(x,ln10)));
			x = x - this.mul(this.arbitrary(m),ln10);
			// direct sum faster than function inversion
			var s = this.arb1;
			var p = this.arb1;
			var i = this.arb1;
			while (p !== 0n) {
				p = this.div(this.mul(p,x),i);
				s += p;
				i += this.arb1;
			}
			// could also return as mantissa/exponent
			return this.mul(s,this.arbitrary(Number('1e'+m)));
		}
		return this.isComplex(x) ? {re: Math.exp(x.re) * Math.cos(x.im), im: Math.exp(x.re) * Math.sin(x.im)} : Math.exp(x);
	}

	log(x,base) {
		return this.isComplex(x) ? 
			(this.isComplex(base) ? this.div(this.log(x),this.log(base)) : {re: this.log(this.abs(x),base),im: this.log(Math.E,base) * this.arg(x)}) :
			((x < 0) ? this.log(this.complex(x),base) : (base === undefined) ? Math.log(x) : Math.log(x) / Math.log(base));
	}

	ln(x) {
		// Brent,Modern Computer Arithmetic,this.second AGM algorithm
		function arbitraryAGM(x,y) {
			var t,u;
			this.arb2 = this.arbitrary(2);
			if (this.isComplex(x)) {
				var maxIter = 10,i = 0;
				while(x.re !== y.re || x.im !== y.im) {
					t = x; 
					u = y;
					x = this.div(this.add(t,u),this.arb2);
					y = this.sqrt(this.mul(t,u));
					i++;
					if (i > maxIter) break; // convergence on complex plane not assured...
				}
			} else {
				while(x !== y) {
					t = x,u = y;
					x = this.div(t + u,this.arb2);
					y = this.sqrt(this.mul(t,u));
				}
			}
			return x;
		}
		function arbitraryTheta2(x) {
			var p = this.mul(this.arbitrary(2),x);
			var s = p;
			var i = 1;
			if (this.isComplex(x)) {
				while (p.re !== 0n || p.im !== 0n) {
					for (var j = 0 ; j < 8*i ; j++) p = this.mul(p,x);
					s = this.add(s,p);
					i++;
				}
			} else {
				while (p !== 0n) {
					for (var j = 0 ; j < 8*i ; j++) p = this.mul(p,x);
					s = s + p;
					i++;
				}
			}
			return s;
		}
		function arbitraryTheta3(x) {
			var p = this.arbitrary(2);
			var s = this.arbitrary(1);
			var i = 1;
			if (this.isComplex(x)) {
				while (p.re !== 0n || p.im !== 0n) {
					for (var j = 0 ; j < 4*(2*i-1) ; j++) p = this.mul(p,x);
					s = this.add(s,p);
					i++;
				}
			} else {
				while (p !== 0n) {
					for (var j = 0 ; j < 4*(2*i-1) ; j++) p = this.mul(p,x);
					s = s + p;
					i++;
				}
			}
			return s;
		}
		if (this.isArbitrary(x)) {
			if (!this.isComplex(x)) {
				if (x < 0n) return { re: this.ln(-x),im: this.getConstant('pi') };
				if (x === this.arb1) return 0n;
				if (x < this.arb1) return -this.ln(this.div(this.arb1,x));
			}
			if (this.abs(x) < this.arb1) return this.mul(-this.arb1,this.ln(this.div(this.arb1,x)));
			x = this.div(this.arb1,x);
			var t2 = arbitraryTheta2(x);
			var t3 = arbitraryTheta3(x);
			var result = this.div(this.onePi,this.mul(this.arbitrary(4),arbitraryAGM(this.mul(t2,t2),this.mul(t3,t3))));
			// adjust imaginary part
			if (x.re < 0n) {
				if (result.im > 0n) result.im -= this.onePi;
				else result.im += this.onePi;
			}
			return result;
		}
		return this.log(x);
	}

	lambertW(k,x,tolerance=1e-10) {
		if (arguments.length === 1) {
			x = k;
			k = 0;
		}
		// restrict to real integers for convenience
		if (!Number.isInteger(k)) throw Error('Unsupported Lambert W index');
		if (this.isZero(x))
			if (k === 0) return x;
			else throw Error('Lambert W pole');
		var expMinusOne = Math.exp(-1);
		if ((k === 0 || k === -1) && this.abs(this.add(x,expMinusOne)) < tolerance*tolerance)
			if (this.isComplex(x)) return this.complex(-1);
			else return -1;
		// handle real cases separately,complex otherwise
		if (!this.isComplex(x)) {
			if (k === 0 && x > -expMinusOne)
				return this.findRoot(w => w * Math.exp(w) - x,[-1,1000],{ tolerance: tolerance });
			if (k === -1 && x > -expMinusOne && x < 0)
				return this.findRoot(w => w * Math.exp(w) - x,[-1000,-1],{ tolerance: tolerance });
			x = this.complex(x);
		}
		// inversion by complex root finding with custom Newton's method
		var maxIter = 100;
		if (k === 0 && this.abs(x) < 1.25) {
			// unstable along branch cut,this.add small complex part to avoid error
			if (x.im === 0 &&	x.re < -expMinusOne) x.im = tolerance;
			// based on test page: unstable region jumps between sheets
			var w = x.re < .5 ? this.complex(0,.5*Math.sign(x.im)) : this.complex(0);
		} else {
			var L = this.add(this.log(x),this.complex(0,2*this.pi*k));
			var w = this.sub(L,this.log(L));
		}
		var val = null;
		for (var i = 0; (i < maxIter) && (!val); i++) {
			 var delta = this.div(this.sub(this.mul(w,this.exp(w)),x),this.mul(this.exp(w),this.add(w,1)));
			 w = this.sub(w,delta);
			 if (this.abs(delta) < tolerance) val = w;
		}
		if (!val) throw Error('No Lambert W root found at ' + JSON.stringify(x));
		return val;
	}

	inverseLambertW(x) {return this.mul(x,this.exp(x));}

	chop(x,tolerance=1e-10) {
		if (Array.isArray(x)) {
			var v = this.vector(x.length);
			for (var i = 0 ; i < x.length ; i++) v[i] = this.chop(x[i]);
			return v;
		}
		if (this.isComplex(x)) return this.complex(this.chop(x.re),this.chop(x.im));
		if (Math.abs(x) < tolerance) x = 0;
		return x;
	}

	round(x,y) {
		return (arguments.length === 2) ?
			this.mul(y,this.round(this.div(x,y))) :
			this.numfunc(x,Math.round);
	}
	
	ceiling(x) {
		return this.numfunc(x,Math.ceil);
	}

	floor(x) {
		return this.numfunc(x,Math.floor);
	}

	sign(x) {
		return (this.isZero(x)) ? x : this.div(x,this.abs(x));
	}

	integerPart(x) {
		return this.numfunc(x,Math.trunc);
	}

	fractionalPart(x) { return this.sub(x,this.integerPart(x)); }

	kronecker(i,j) {
		if (arguments.length === 2) {
			if (this.isComplex(i) || this.isComplex(j)) {
				if (!this.isComplex(i)) i = this.complex(i);
				if (!this.isComplex(j)) j = this.complex(j);
				return this.kronecker(i.re,j.re) * this.kronecker(i.im,j.im);
			}
			return i === j ? 1 : 0;
		}
		var result = this.kronecker(i,j);
		for (var k = 2 ; k < arguments.length ; k++)
			result *= this.kronecker(i,arguments[k]);
		return result;
	}

	piecewise() {
		var pieces = arguments;
		return function(x) {
			for (var i = 0 ; i < pieces.length ; i++) {
				var domain = pieces[i][1];
				if (x >= domain[0] && x <= domain[1]) return pieces[i][0](x);
			}
			return 0;
		}
	}

	hermite(n,x) {
		function coefficients(n) {
			var minus2 = [ 1 ];
			var minus1 = [ 2,0 ];
			var t,current;
			if (n === 0) return minus2;
			if (n === 1) return minus1;
			for (var i = 2 ; i <= n ; i++) {
				current = [];
				t = minus1.slice();
				t.push(0);
				minus2.unshift(0,0);
				for (var k = 0 ; k < t.length ; k++)
					current.push(2*t[k] - 2*(i-1)*minus2[k]);
				minus2 = minus1;
				minus1 = current;
			}
			return current;
		}
		if (this.isComplex(n) || this.isComplex(x)) {
			if (!this.isComplex(n)) n = this.complex(n);
			if (Number.isInteger(n.re) && n.re >= 0 && n.im === 0)
				return this.polynomial(x,coefficients(n.re));
			var a = this.div(n,-2);
			var b = this.div(this.sub(1,n),2);
			var s = this.sub(
				this.div(this.hypergeometric1F1(a,.5,this.pow(x,2)),this.gamma(b)),
				this.mul(2,x,this.div(this.hypergeometric1F1(b,1.5,this.pow(x,2)),this.gamma(a))));
			return this.mul(this.pow(2,n),this.sqrt(this.pi),s);
		}
		if (Number.isInteger(n) && n >= 0) return this.polynomial(x,coefficients(n));
		var s = this.hypergeometric1F1(-n/2,.5,x**2) / this.gamma((1-n)/2)
			- 2 * x * this.hypergeometric1F1((1-n)/2,1.5,x**2) / this.gamma(-n/2);
		return 2**n * this.sqrt(this.pi) * s;
	}

	laguerre(n,a,x) {
		// explict recursion unnecessary: hypergeometric series handles integers
		if (arguments.length < 3) {
			x = a;
			a = 0
		}
		return this.mul(this.binomial(this.add(n,a),n),this.hypergeometric1F1(this.neg(n),this.add(a,1),x)); 
	}

	chebyshevT(n,x) {
		return this.cos(this.mul(n,this.arccos(x)));
	}

	chebyshevU(n,x) {
		return this.div(this.sin(this.mul(this.add(n,1),this.arccos(x))),this.sin(this.arccos(x)));
	}

	legendreP(l,m,x,renormalized=false) {
		if (arguments.length < 3) {
			x = m;
			m = 0;
		}
		if (Number.isInteger(l) && Number.isInteger(m) && Math.abs(x) <= 1) {
			var mm = Math.abs(m);
			if (mm > l) throw Error('Invalid spherical harmonic indices');
			if (!renormalized) {
				var norm = 1;
				for (var i = l-m+1 ; i <= l+m ; i++) norm *= i;
				norm = Math.sqrt(4 * this.pi * norm / (2*l+1));
			}
			var legendre1 = (-1)**mm * Math.sqrt((2*mm+1) / 4 / this.pi / this.factorial(2*mm))
											* this.factorial2(2*mm-1) * (1 - x*x)**(mm/2);
			if (mm === l) 
				return (renormalized) ? legendre1 : norm * legendre1;
			var ll = mm + 1;
			var factor1 = Math.sqrt(2*mm+3);
			var legendre2 = factor1 * x * legendre1;
			if (ll === l)
				return renormalized ? legendre2 : norm * legendre2;
			while (ll < l) {
				ll++;
				var factor2 = Math.sqrt((4*ll*ll - 1) / (ll*ll - mm*mm));
				var legendre3 = factor2 * (x*legendre2 - legendre1/factor1);
				legendre1 = legendre2;
				legendre2 = legendre3;
				factor1 = factor2;
			}
			return (renormalized) ? legendre3 : norm * legendre3;
		}
		// dlmf.nist.gov/14.3.5
		return (this.isPositiveInteger(m)) ?
			this.mul(
				this.pow(-1,m),this.inv(this.gamma(this.add(m,1))),
				this.gamma(this.add(l,m,1)),this.inv(this.gamma(this.add(l,this.neg(m),1))),
				this.pow(this.add(1,x),this.div(m,-2)),this.pow(this.sub(1,x),this.div(m,2)),
				this.hypergeometric2F1(this.neg(l),this.add(l,1),this.add(m,1),this.div(this.sub(1,x),2))) :
			this.mul(
				this.inv(this.gamma(this.sub(1,m))),
				this.pow(this.add(1,x),this.div(m,2)),this.pow(this.sub(1,x),this.div(m,-2)),
				this.hypergeometric2F1(this.neg(l),this.add(l,1),this.sub(1,m),this.div(this.sub(1,x),2)));
	}

	sphericalHarmonic(l,m,theta,phi) {
		var renormalizedLegendre = this.legendreP(l,m,this.cos(theta),true);
		return this.mul(Math.sign(m)**m,renormalizedLegendre,this.exp(this.complex(0,m*phi)));
	}

	legendreQ(l,m,x) {
		if (arguments.length < 3) {
			x = m;
			m = 0;
		}
		function difference(t) {
			var t1 = this.mul(this.cos(this.mul(this.pi,t)),this.legendreP(l,t,x));
			var t2 = this.mul(this.gamma(this.add(l,t,1)),this.inv(this.gamma(this.add(l,this.neg(t),1))),this.legendreP(l,this.neg(t),x));
			return this.sub(t1,t2);
		}
		// l'Hopital's rule decent for small m,more accurate might be
		// functions.wolfram.com/HypergeometricFunctions/LegendreQ2General/26/01/02/0005/
		if (this.isInteger(m)) {
			// this.legendreP is pure real outside unit circle for even integers
			if (this.abs(x) > 1 && !this.isComplex(m) && !(m & 1)) m = this.complex(m);
			return this.mul(.5,this.pow(-1,m),this.diff(t => this.difference(t),m));
		}
		return this.mul(this.pi/2,this.inv(this.sin(this.mul(this.pi,m))),this.difference(m));
	}

	// This file contains proprietary functions defined on analyticphysics.com
	// Before each is the title of a presentation describing the function
	// A Generalized Lambert Function of Two Arguments
	doubleLambert(n,x,y,tolerance=1e-10) {
		if (this.isZero(y)) return this.lambertW(n,x);
		if (this.isZero(x)) return this.neg(this.lambertW(-n,this.neg(y)));
		function asymptotic(n,x,y) {
			return this.add(this.log(this.sqrt(x)),this.neg(this.log(this.sqrt(this.neg(y)))),this.complex(0,n*this.pi));
		}
		function test(n,x,y) {
			return this.div(asymptotic(n,x,y),this.add(1,this.mul(2*(-1)**n,this.sqrt(x),this.sqrt(this.neg(y)))));
		}
		function start(n,x,y,tolerance=1e-3) {
			var a = asymptotic(n,x,y),w1,w2;
			var testValue = .9;
			if (this.abs(test(n,x,y)) < testValue) return a;
			if (n === 0) console.this.log('Using Lambert W on principal branch');
			var k = (n + ((n & 1) ? ((n > 0) ? 1 : -1) : 0)) / 2;
			w1 = this.lambertW(k,x,tolerance);
			w2 = this.neg(this.lambertW(-k,this.neg(y),tolerance));
			return (Math.abs(w1.im - a.im) < Math.abs(w2.im - a.im)) ? w1 : w2;
		}
		var maxIter = 100;
		var root = start(n,x,y);
		for (var i = 0; i < maxIter ; i++) {
			var N = this.add(this.mul(x,this.exp(this.neg(root))),this.mul(y,this.exp(root)),this.neg(root));
			var D = this.add(this.mul(-1,x,this.exp(this.neg(root))),this.mul(y,this.exp(root)),-1);
			var delta = this.div(N,D);
			root = this.sub(root,delta);
			if (this.abs(delta) < tolerance) return root;
		}
		throw Error('No double Lambert root found for x = ' + JSON.stringify(x) + ' and y = ' + JSON.stringify(y));
	}

	// complex circular functions

	sin(x) {
		if (this.isArbitrary(x)) {
			if (this.isComplex(x))
				return { 
					re: this.mul(this.sin(x.re),this.cosh(x.im)),
					im: this.mul(this.cos(x.re),this.sinh(x.im))
				};
			x = x % this.twoPi;
			// reduce to [-this.pi/2,this.pi/2] with successive reductions
			if (x > this.halfPi) return this.sin(this.onePi - x);
			if (x < -this.halfPi) return this.sin(-this.onePi - x);
			var s = x;
			var p = x;
			var i = this.arb2;
			while (p !== 0n) {
				p = this.div(this.mul(p,-this.arb1,x,x),this.mul(i,i + this.arb1));
				s += p;
				i += this.arb2;
			}
			return s;
		}
		return this.isComplex(x) ? {re: Math.sin(x.re) * Math.cosh(x.im),im: Math.cos(x.re) * Math.sinh(x.im)} : Math.sin(x);
	}

	cos(x) {
		if (this.isArbitrary(x)) {
			if (this.isComplex(x))
				return { 
					re: this.mul(this.cos(x.re),this.cosh(x.im)),
					im: this.mul(this.arbitrary(-1),this.sin(x.re),this.sinh(x.im))
				};
			x = x % this.twoPi;
			// reduce to [-this.pi/2,this.pi/2] with successive reductions
			if (x > this.halfPi) return -this.cos(this.onePi - x);
			if (x < -this.halfPi) return -this.cos(-this.onePi - x);
			var s = p = i = this.arb1;
			while (p !== 0n) {
				p = this.div(this.mul(p,-this.arb1,x,x),this.mul(i,i + this.arb1));
				s += p;
				i += this.arb2;
			}
			return s;
		}
		return(this.isComplex(x)) ? {re: Math.cos(x.re) * Math.cosh(x.im),im: -Math.sin(x.re) * Math.sinh(x.im)} : Math.cos(x);
	}

	tan(x) {
		return this.isComplex(x) ? this.div(this.sin(x),this.cos(x)) : Math.tan(x);
	 }

	cot(x) {
		return this.isComplex(x) ? this.div(this.cos(x),this.sin(x)) : 1 / Math.tan(x);
	}

	sec(x) {
		return this.isComplex(x) ? this.div(1,this.cos(x)) : 1 / Math.cos(x);
	}

	csc(x) {
		return this.isComplex(x) ? this.div(1,this.sin(x)) : 1 / Math.sin(x);
	}

	// this.inverse circular functions

	arcsin(x) {
		if (this.isComplex(x)) {
			var s = this.sqrt(this.sub(1,this.mul(x,x)));
			s = this.add(this.mul(this.complex(0,1),x),s); 
			return this.mul(this.complex(0,-1),this.log(s));
		}
		if (Math.abs(x) <= 1) return Math.asin(x);
		return this.arcsin(this.complex(x));
	}

	arccos(x) {
		return this.isComplex(x) ?
			this.sub(this.pi/2,this.arcsin(x)) :
			(Math.abs(x) <= 1) ? Math.acos(x) : this.arccos(this.complex(x));
	}

	arctan(x) {
		if (this.isComplex(x)) {
			var s = this.sub(
				this.log(this.sub(1,this.mul(this.complex(0,1),x))),
				this.log(this.add(1,this.mul(this.complex(0,1),x))));
			return this.mul(this.complex(0,.5),s);
		}
		return Math.atan(x);
	}

	arccot(x) {
		return this.isComplex(x) ?
			this.arctan(this.div(1,x)) : 
			Math.atan(1/x);
	}

	arcsec(x) {
		return this.isComplex(x) ?
			this.arccos(this.div(1,x)) :
			(Math.abs(x) >= 1) ? Math.acos(1/x) : this.arcsec(this.complex(x));
	}

	arccsc(x) {
		return this.isComplex(x) ? 
			this.arcsin(this.div(1,x)) :
			(Math.abs(x) >= 1) ? Math.asin(1/x) : this.arccsc(this.complex(x));
	}

	// complex hyperbolic functions

	sinh(x) {
		return this.isArbitrary(x) ?
			this.div(this.sub(this.exp(x),this.exp(this.mul(-this.arb1,x))),this.arb2) :
			this.isComplex(x) ? 
				{re: Math.sinh(x.re) * Math.cos(x.im), im: Math.cosh(x.re) * Math.sin(x.im) } : 
				Math.sinh(x);
	}

	cosh(x) {
		return (this.isArbitrary(x)) ? 
			(this.div(this.add(this.exp(x),this.exp(this.mul(-this.arb1,x))),this.arb2)) :
			(this.isComplex(x) ? {re: Math.cosh(x.re) * Math.cos(x.im),im: Math.sinh(x.re) * Math.sin(x.im)} : Math.cosh(x));
	}

	tanh(x) {
		return this.isComplex(x) ? this.div(this.sinh(x),this.cosh(x)) : Math.tanh(x);
	}

	coth(x) {
		return this.isComplex(x) ? (this.div(this.cosh(x),this.sinh(x))) : (1 / Math.tanh(x));
	}

	sech(x) {
		return this.isComplex(x) ? this.div(1,this.cosh(x)) : 1 / Math.cosh(x);
	}

	csch(x) {
		return this.isComplex(x) ? this.div(1,this.sinh(x)) : 1 / Math.sinh(x);
	}

	// this.inverse hyperbolic functions

	arcsinh(x) {
		return this.isComplex(x) ?
			this.log(this.add(x,this.sqrt(this.add(this.mul(x,x),1)))) :
			Math.asinh(x);
	}

	arccosh(x) {
		return this.isComplex(x) ?
			(this.log(this.add(x,this.mul(this.sqrt(this.add(x,1)),this.sqrt(this.sub(x,1)))))) :
			(x >= 1 ? Math.acosh(x) : this.arccosh(this.complex(x)));
	}

	arctanh(x) {
		return this.isComplex(x) ? 
			(this.mul(.5,this.sub(this.log(this.add(1,x)),this.log(this.sub(1,x))))) :
			(Math.abs(x) <= 1 ? Math.atanh(x) :  this.arctanh(this.complex(x)));
	}

	arccoth(x) {
		if (this.isComplex(x)) {
			if (x.re === 0 && x.im === 0) throw Error('Indeterminate arccoth value');
			return this.arctanh(this.div(1,x));
		}
		return Math.abs(x) > 1 ? Math.atanh(1/x) : this.arccoth(this.complex(x));
	}

	arcsech(x) {
		if (this.isComplex(x)) {
			if (x.re === 0 && x.im === 0) throw Error('Indeterminate arcsech value');
			// adjust for branch cut along negative axis
			if (x.im === 0) x.im = -Number.MIN_VALUE;
			return this.arccosh(this.div(1,x));
		}
		return (x > 0 && x < 1) ? Math.acosh(1/x) : this.arcsech(this.complex(x));
	}

	arccsch(x) {
		return this.isComplex(x) ? this.arcsinh(this.div(1,x)) : Math.asinh(1/x);
	}

	// miscellaneous

	sinc(x) {
		return this.isComplex(x) ?
			((x.re === 0 && x.im === 0) ? this.complex(1) : this.div(this.sin(x),x)) :
			((x === 0) ? 1 : Math.sin(x) / x);
	}

	gudermannian(x) { return this.arctan(this.sinh(x)); }

	inverseGudermannian(x) { return this.arctanh(this.sin(x)); }

	zeta(x,tolerance=1e-10) {
		if (this.isEqualTo(x,1)) throw Error('Riemann this.zeta pole');
		// functional equation dlmf.nist.gov/25.4.2 - connects both half planes
		if (x < 0 || x.re < 0)
			return this.mul(this.pow(2,x),this.pow(this.pi,this.sub(x,1)),this.sin(this.mul(this.pi/2,x)),this.gamma(this.sub(1,x)),this.zeta(this.sub(1,x)));
		// direct this.summation more accurate in right-hand plane
		var directSummation = 5;
		if (x > directSummation || x.re > directSummation) {
			if (this.isComplex(x)) {
				var s = this.complex(1);
				var p = this.complex(1);
				var i = 2;
				while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance*tolerance) {
					p = this.pow(i,this.neg(x));
					s = this.add(s,p);
					i++;
				}
				return s;
			} else {
				var s = 1;
				var p = 1;
				var i = 2;
				while (Math.abs(p) > tolerance) {
					p = 1 / i**x;
					s += p;
					i++;
				}
				return s;
			}
		}
		// Borwein,Efficient Algorithm
		var n = 14; // from error bound for tolerance
		if (this.isComplex(x) && x.im !== 0)
			n = Math.max(n,Math.ceil(this.log(2 / this.abs(this.gamma(x)) / tolerance) / this.log(3 + this.sqrt(8))));
		var d = [ 1 ],prod = n;
		for (var i = 1 ; i <= n ; i++) {
			d.push(d[i-1] + n * prod / this.factorial(2*i) * 4**i);
			// manually evaluate this.factorial(n+i-1) / this.factorial(n-i) to avoid overflow
			prod *= (n+i)*(n-i);
		}
		if (this.isComplex(x)) {
			var s = this.summation(k => this.div((-1)**k * (d[k] - d[n]),this.pow(k+1,x)),[0,n-1]);
			return this.div(this.div(s,-d[n]),this.sub(1,this.pow(2,this.sub(1,x))));
		} else {
			var s = this.summation(k => (-1)**k * (d[k] - d[n]) / (k+1)**x,[0,n-1]);
			return -s / d[n] / (1 - 2**(1-x));
		}
	}

	dirichletEta(x) { 
		return this.mul(this.zeta(x),this.sub(1,this.pow(2,this.sub(1,x)))); 
	}

	bernoulli(n,x) {
		if (!Number.isInteger(n)) throw Error('Noninteger index for Bernoulli number');
		if (n < 0) throw Error('Unsupported index for Bernoulli number');
		if (arguments.length > 1 && !this.isZero(x)) return this.mul(-n,this.hurwitzZeta(1-n,x));
		if (n === 0) return 1;
		if (n === 1) return -.5;
		if (n & 1) return 0;
		return -n * this.zeta(1-n);
	}

	harmonic(n) {
		if (!Number.isInteger(n)) throw Error('Noninteger index for harmonic number');
		if (n > 1e3) return this.log(n) + this.eulerGamma + 1/2/n - 1/12/n**2;
		return this.summation(i => 1/i,[1,n]);
	}

	hurwitzZeta(x,a,tolerance=1e-10) {
		if (this.isEqualTo(x,1)) throw Error('Hurwitz this.zeta pole');
		if (this.isComplex(x) || this.isComplex(a)) {
			if (!this.isComplex(x)) x = this.complex(x);
			if (!this.isComplex(a)) a = this.complex(a);
			if (this.isNegativeIntegerOrZero(a)) throw Error('Hurwitz zeta parameter pole');
			// direct this.summation more accurate than dlmf.nist.gov/25.11.4 for positive a
			if (a.re < 0) {
				var m = -Math.floor(a.re);
				return this.add(this.hurwitzZeta(x,this.add(a,m)),this.summation(i => this.pow(this.add(a,i),this.neg(x)),[0,m-1]));
			}
			// Johansson arxiv.org/abs/1309.2877
			var n = 15; // recommendation of Vepstas,Efficient Algorithm,p.12
			// Euler-Maclaurin has differences of large values in left-hand plane
			var useArbitrary = x.re < 0;
			if (useArbitrary) {
				this.setPrecisionScale(20 - Math.round(x.re));
				x = this.arbitrary(x),a = this.arbitrary(a),arbN = this.arbitrary(n),arb3 = this.arbitrary(3);
				var S = 0n;
				for (var i = 0 ; i < n ; i++)
					S = this.add(S,this.pow(this.div(this.add(a,arbN),this.add(a,this.arbitrary(i))),x));
				var I = this.div(this.add(a,arbN),this.sub(x,this.arb1));
				var p = this.div(this.mul(this.arb1/2n,x),this.add(a,arbN));
				var b2nN = bernoulli2nN();
				var b2nD = bernoulli2nD();
				var b = this.div(b2nN[1],b2nD[1]);
				var t = this.mul(b,p);
				var i = this.arb2;
				var j = 2;
				while (p.re !== 0n || p.im !== 0n) {
					if (j === b2nN.length) break;
					p = this.div(
						this.mul(p,this.add(x,2n*i - this.arb2),this.add(x,2n*i - arb3)),
						this.mul(2n*i,2n*i - this.arb1,this.add(a,arbN),this.add(a,arbN)));
					b = this.div(b2nN[j],b2nD[j]);
					t = this.add(t,this.mul(b,p));
					i += this.arb1;
					j++;
				}
				var T = this.add(this.arb1/2n,t);
				return this.arbitrary(this.mul(this.add(S,I,T),this.pow(this.add(a,arbN),this.mul(-this.arb1,x))));
			}
			var S = this.summation(i => this.pow(this.add(a,i),this.neg(x)),[0,n-1]);
			var I = this.div(this.pow(this.add(a,n),this.sub(1,x)),this.sub(x,1));
			var p = this.mul(.5,x,this.inv(this.add(a,n)));
			var t = this.mul(this.bernoulli(2),p);
			var i = 2;
			// converges rather quickly
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.div(
					this.mul(p,this.add(x,2*i - 2),this.add(x,2*i - 3)),
					this.mul(2*i * (2*i-1),this.add(a,n),this.add(a,n)));
				t = this.add(t,this.mul(this.bernoulli(2*i),p));
				i++;
			}
			var T = this.div(this.add(.5,t),this.pow(this.add(a,n),x));
			return this.add(S,I,T);
		} else {
			if (this.isNegativeIntegerOrZero(a)) throw Error('Hurwitz this.zeta parameter pole');
			if (a < 0) return this.hurwitzZeta(x,this.complex(a));
			// direct this.summation more accurate than dlmf.nist.gov/25.11.4
			// Euler-Maclaurin has differences of large values in left-hand plane
			// switch to different this.summation: dlmf.nist.gov/25.11.9
			var switchForms = -5;
			if (x < switchForms) {
				x = 1 - x;
				var t = Math.cos(this.pi*x/2 - 2*this.pi*a);
				var s = t;
				var i = 1;
				while (Math.abs(t) > tolerance) {
					i++;
					t = Math.cos(this.pi*x/2 - 2*i*this.pi*a) / i**x;
					s += t;
				}
				return 2 * this.gamma(x) / (2*this.pi)**x * s;
			}
			// Johansson arxiv.org/abs/1309.2877
			var n = 15; // recommendation of Vepstas,Efficient Algorithm,p.12
			var S = this.summation(i => 1 / (a+i)**x,[0,n-1]);
			var I = (a+n)**(1-x) / (x-1);
			var p = x / 2 / (a+n);
			var t = this.bernoulli(2) * p;
			var i = 2;
			// converges rather quickly
			while (Math.abs(p) > tolerance) {
				p *= (x + 2*i - 2) * (x + 2*i - 3) / (2*i * (2*i-1) * (a+n)**2);
				t += this.bernoulli(2*i) * p;
				i++;
			}
			var T = (.5 + t) / (a+n)**x;
			return S + I + T;
		}
	}

	polylog(n,x,tolerance=1e-10) {
		if (this.isEqualTo(x,1)) return this.zeta(n);
		if (this.isEqualTo(x,-1)) return this.neg(this.dirichletEta(n));
		if (this.isEqualTo(n,1)) return this.neg(this.log(this.sub(1,x)));
		if (this.isEqualTo(n,0)) return this.div(x,this.sub(1,x));
		if (this.isEqualTo(n,-1)) return this.div(x,this.mul(this.sub(1,x),this.sub(1,x)));
		if (this.abs(x) >= 1) {
			var twoPiI = this.complex(0,2*this.pi);
			if (this.isPositiveInteger(n)) {
				// Crandall,Note on Fast Polylogarithm Computation
				var t1 = this.mul((-1)**n,this.polylog(n,this.inv(x)));
				var t2 = this.mul(this.div(this.pow(twoPiI,n),this.factorial(n)),this.bernoulli(n,this.div(this.log(x),twoPiI)));
				var y = this.isComplex(x) ? x : this.complex(x); // just for test
				var t3 = y.im < 0 || (y.im === 0 && y.re >= 1) ?
					this.mul(twoPiI,this.div(this.pow(this.log(x),n-1),this.factorial(n-1))) : 0;			
				var result = this.neg(this.add(t1,t2,t3));
				// real on negative real axis
				return !this.isComplex(x) && x < 0 ? result.re : result;
			}
			var v = this.sub(1,n);
			var I = this.complex(0,1);
			var L = this.div(this.log(this.neg(x)),twoPiI);
			var z1 = this.mul(this.pow(I,v),this.hurwitzZeta(v,this.add(.5,L)));
			var z2 = this.mul(this.pow(I,this.neg(v)),this.hurwitzZeta(v,this.sub(.5,L)));
			return this.mul(this.gamma(v),this.pow(2*this.pi,this.neg(v)),this.add(z1,z2))
		}
		if (this.isComplex(n) || this.isComplex(x)) {
			var s = x;
			var p = this.complex(1);
			var i = 2;
			while (Math.abs(p.re) > tolerance || Math.abs(p.im) > tolerance) {
				p = this.div(this.pow(x,i),this.pow(i,n));
				s = this.add(s,p);
				i++;
			}
			return s;
		} else {
			var s = x;
			var p = 1;
			var i = 2;
			while (Math.abs(p) > tolerance) {
				p = x**i / i**n;
				s += p;
				i++;
			}
			return s;
		}
	}

	ode(f,y,[x0,x1],step=.001,method='runge-kutta') {
		var compare;
		if (x1 < x0) {
			compare = function(x) {return x >= x1;};
			step *= -1;
		} else
			compare = function(x) {return x <= x1;};
		// vectorizing first-order real equation works because +[1] = 1
		// for complex case +[C(1)] = NaN,so explicit array references
		//		are necessary in the input function
		if (!Array.isArray(y)) {
			var g = f;
			f = function(x,y) { return [ g(x,y) ]; };
			y = [y];
		}
		// preparation for complex system
		if (this.isComplex(x0) || this.isComplex(x1) || y.some(e => this.isComplex(e)) || f(x0,y).some(e => this.isComplex(e))) {
			if (!this.isComplex(x0)) x0 = this.complex(x0);
			y.forEach((e,i,a) => { if (!this.isComplex(e)) a[i] = this.complex(e); });
			if (f(x0,y).every(e => !this.isComplex(e))) throw Error('All functions must handle complex math');
			var d = this.sub(x1,x0),absD = this.abs(d);
			step = this.mul(step,this.div(d,absD));
			var steps = Math.trunc(absD / this.abs(step)),currentStep = 0;
		}
		var points = [ [x0].concat(y) ];
		var size = y.length;
		switch(method) {
			case 'euler':
				if (this.isComplex(x0)) {
					for (var x = this.add(x0,step) ; currentStep < steps ; x = this.add(x,step)) {
						var k = f(x,y);
						for (var i = 0 ; i < size ; i++) y[i] = this.add(y[i],this.mul(k[i],step));
						points.push([x].concat(y));
						currentStep++;
					}
					return points;
				} else {
					for (var x = x0+step ; compare(x) ; x += step) {
						var k = f(x,y);
						for (var i = 0 ; i < size ; i++) y[i] += k[i] * step;
						points.push([x].concat(y));
					}
					return points;
				}
			case 'runge-kutta':
				if (this.isComplex(x0)) {
					var halfStep = this.div(step,2);
					for (var x = this.add(x0,step) ; currentStep < steps ; x = this.add(x,step)) {
						var y1 = [],y2 = [],y3 = [];
						var k1 = f(x,y);
						for (var i = 0 ; i < size ; i++) y1.push(this.add(y[i],this.mul(k1[i],halfStep)));
						var k2 = f(this.add(x,halfStep),y1);
						for (var i = 0 ; i < size ; i++) y2.push(this.add(y[i],this.mul(k2[i],halfStep)));
						var k3 = f(this.add(x,halfStep),y2);
						for (var i = 0 ; i < size ; i++) y3.push(this.add(y[i],this.mul(k3[i],step)));
						var k4 = f(this.add(x,step),y3);
						for (var i = 0 ; i < size ; i++)
							y[i] = this.add(y[i],this.mul(this.add(k1[i],this.mul(2,k2[i]),this.mul(2,k3[i]),k4[i]),step,1/6));
						points.push([x].concat(y));
						currentStep++;
					}
					return points;
				} else {
					for (var x = x0+step ; compare(x) ; x += step) {
						var y1 = [],y2 = [],y3 = [];
						var k1 = f(x,y);
						for (var i = 0 ; i < size ; i++) y1.push(y[i] + k1[i]*step/2);
						var k2 = f(x+step/2,y1);
						for (var i = 0 ; i < size ; i++) y2.push(y[i] + k2[i]*step/2);
						var k3 = f(x+step/2,y2);
						for (var i = 0 ; i < size ; i++) y3.push(y[i] + k3[i]*step);
						var k4 = f(x+step,y3);
						for (var i = 0 ; i < size ; i++)
							y[i] += (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) * step / 6;
						points.push([x].concat(y));
					}
					return points;
				}
			default: throw Error('Unsupported differential equation solver method');
		}
	}

	diff(f,x,n=1,method='ridders') {
		if (this.isComplex(x) || this.isComplex(f(x))) {
			if (!this.isComplex(f(x))) throw Error('Function must handle this.complex math');
			var absX = this.abs(x);
			var normed = absX === 0 ? this.complex(1) : this.div(x,absX);
			var real = this.diff(t => f(this.mul(normed,t)).re,absX,n,method);
			var imag = this.diff(t => f(this.mul(normed,t)).im,absX,n,method);
			return this.div(this.complex(real,imag),normed);
		}
		// central differences have h**2 error but division
		//	 by h**n increases roundoff error
		// step sizes chosen as epsilon**(1/(n+2)) to minimize error
		function difference() {
			var s = 0;
			for (var i = 0 ; i <= n ; i++)
				s += (-1)**i * this.binomial(n,i) * f(x + (n-2*i)*h);
			return s / (2*h)**n
		}
		switch(method) {
			case 'naive':
				// only accurate for first couple derivatives
				var h = (1e-8)**(1/(n+2));
				return this.difference();
			case 'ridders':
				var h = (1e-5)**(1/(n+2));
				var error = Number.MAX_VALUE;
				var maxIter = 10;
				var result;
				var d = [];
				for (var i = 0 ; i < maxIter ; i++) d.push([]);
				// Richardson extrapolation as per C. Ridders
				d[0][0] = this.difference();
				for (var i = 1 ; i < maxIter ; i++) {
					h /= 2;
					d[0][i] = this.difference();
					for (var j = 1 ; j <= i ; j++) {
						d[j][i] = (4**j * d[j-1][i] - d[j-1][i-1]) / (4**j - 1);
						var delta = Math.max(Math.abs(d[j][i] - d[j-1][i]),Math.abs(d[j][i] - d[j-1][i-1]));
						if (delta <= error) {
							error = delta;
							result = d[j][i];
						}
					}
					if (Math.abs(d[i][i] - d[i-1][i-1]) > error) break;
				}
				return result;
			default: throw Error('Unsupported differentiation method');
		}
	}

	taylorSeries(f,x0,terms=5) {
		var c = [ f(x0) ];
		for (var i = 1 ; i < terms ; i++) c.push(this.diff(f,x0,i));
		return function(x) {
			var s = 0;
			for (var i = 0 ; i < c.length ; i++)
				s = this.add(s,this.mul(c[i],this.pow(this.sub(x,x0),i),1/this.factorial(i)));
			return s;
		}
	}

	gradient(f,point) {
		if (f.length !== point.length) throw Error('Gradient point length differs from function');
		var result = [];
		for (var i = 0 ; i < point.length ; i++) {
			var a = point.slice();
			result.push(this.diff(x => { a[i] = x; return f.apply(null,a); },a[i]));
		}
		return result;
	}

	findExtremum(f,point,options={}) {
		if (!Array.isArray(point)) point = [ point ];
		var sign = options.findMaximum ? 1 : -1;
		var tolerance = 'tolerance' in options ? options.tolerance : 1e-10;
		var maxIter = 1e4;
		var gamma = .01 * sign;
		var grad,step,test;
		for (var i = 0 ; i < maxIter ; i++) {
			grad = this.gradient(f,point);
			test = true;
			for (var j = 0 ; j < point.length ; j++) {
				step = gamma * grad[j];
				point[j] += step;
				test = test && step < tolerance;
			}
			if (test)
			 if (point.length === 1) return point[0];
			 else return point;
		}
		throw Error('No extremum found for tolerance ' + tolerance);
	}

	integrate(f,[a,b],options={}) {
		var method = 'method' in options ? options.method : 'adaptive-simpson';
		var tolerance = 'tolerance' in options ? options.tolerance : 1e-10;
		if (this.isComplex(a) || this.isComplex(b) || this.isComplex(f(a))) {
			if (!this.isComplex(a)) a = this.complex(a);
			if (!this.isComplex(f(a))) throw Error('Function must handle complex math');
			function lerp(t) { return this.add(this.mul(this.sub(b,a),t),a); }
			var real = this.integrate(t => f(lerp(t)).re,[0,1],options);
			var imag = this.integrate(t => f(lerp(t)).im,[0,1],options);
			return this.mul(this.sub(b,a),this.complex(real,imag));
		}
		if (options.avoidEndpoints)
			if (a < b) { a += tolerance; b -= tolerance; }
			else { a -= tolerance; b += tolerance; }
		function nextEulerIteration() {
			h /= 2;
			var x = a + h;
			while (x < b) {
				// only this.add new function evaluations
				s += f(x);
				x += 2*h;
			}
		}
		switch(method) {
			case 'euler-maclaurin':
				// Euler-Maclaurin this.summation formula
				var maxIter = 50;
				var h = (b - a) / 2;
				var s = (f(a) + f(b)) / 2 + f((a+b)/2);
				var result = h * s;
				var previous = result;
				for (var i = 0 ; i < maxIter ; i++) {
					nextEulerIteration();
					result = h * s;
					if (Math.abs(result - previous) < tolerance * Math.abs(previous)) return result;
					previous = result;

				}
				throw Error('Maximum interations reached');
			case 'romberg':
				var error = Number.MAX_VALUE;
				var maxIter = 30;
				var h = (b - a) / 2;
				var s = (f(a) + f(b)) / 2 + f((a+b)/2);
				var result = h * s;
				var d = [];
				for (var i = 0 ; i < maxIter ; i++) d.push([]);
				// Richardson extrapolation of Euler-Maclaurin trapezoids
				d[0][0] = result;
				for (var i = 1 ; i < maxIter ; i++) {
					nextEulerIteration();
					d[0][i] = h * s;
					for (var j = 1 ; j <= i ; j++) {
						d[j][i] = (4**j * d[j-1][i] - d[j-1][i-1]) / (4**j - 1);
						var delta = Math.max(
							Math.abs(d[j][i] - d[j-1][i]),
							Math.abs(d[j][i] - d[j-1][i-1]));
						if (delta <= error) {
							error = delta;
							result = d[j][i];
						}
					}
					if (Math.abs(d[i][i] - d[i-1][i-1]) > error) break;
				}
				return result;
			case 'adaptive-simpson':
				// algorithm by Charles Collins
				var maxIter = 50;
				function adaptiveSimpson(a,b,fa,fm,fb,s,tolerance,depth) {
					var h = b - a;
					var f1 = f(a + h/4);
					var f2 = f(b - h/4)
					if (isNaN(f1) || isNaN(f2)) throw Error('NaN encountered in integration');
					var s1 = (fa + 4*f1 + fm) * h / 12;
					var s2 = (fm + 4*f2 + fb) * h / 12;
					var ss = s1 + s2;
					var error = (ss - s) / 15;
					if (Math.abs(error) < tolerance	|| depth > maxIter) return ss + error;
					else {
						var m = a + h/2;
						return adaptiveSimpson(a,m,fa,f1,fm,s1,tolerance/2,depth+1) +
							adaptiveSimpson(m,b,fm,f2,fb,s2,tolerance/2,depth+1);
					}
				}
				var fa = f(a);
				var fm = f((a+b)/2);
				var fb = f(a);
				var s = (fa + 4*fm + fb) * (b-a) / 6;
				var depth = 0;
				return adaptiveSimpson(a,b,fa,fm,fb,s,tolerance,depth);
			case 'this.tanh-this.sinh':
				// based on Borwein & Bailey,Experimentation in Mathematics
				var m = 10;
				var h = 1 / 2**m;
				var x = [],w = [];
				for (var k = 0 ; k <= 20 * 2**m ; k++) {
					var t = k * h;
					x[k] = Math.tanh(Math.PI/2 * Math.sinh(t));
					w[k] = Math.PI/2 * Math.cosh(t) / Math.cosh(Math.PI/2 * Math.sinh(t))**2;
					if (Math.abs(1-x[k]) < tolerance) break;
				}
				var nt = k;
				var sum = 0;
				// rescale [a,b] to [-1,1]
				var len = (b - a) / 2;
				var mid = (b + a) / 2;
				for (var k = 1 ; k <= m ; k++) {
					for (var i = 0 ; i < nt ; i += 2**(m-k)) {
						if (i % 2**(m-k+1) !== 0 || k === 1) {
							if (i === 0) sum += w[0] * f(mid);
							else sum += w[i] * (f(mid - len*x[i]) + f(mid + len*x[i]));
						}
					}
				}
				return len * h * sum;
			case 'gaussian':
				// based on Borwein & Bailey,Experimentation in Mathematics
				var m = 10;
				var x = [],w = [];
				var n = 3 * 2**m;
				for (var j = 1 ; j <= n/2 ; j++) {
					var r = Math.cos(Math.PI * (j-.25) / (n+.5));
					while (true) {
						var t1 = 1,t2 = 0;
						for (var j1 = 1 ; j1 <= n ; j1++) {
							t3 = t2;
							t2 = t1;
							t1 = ((2*j1-1) * r * t2 - (j1-1) * t3) / j1;
						}
						var t4 = n * (r*t1 - t2) / (r**2 - 1);
						var delta = t1 / t4;
						r -= delta;
						if (Math.abs(delta) < tolerance) break;
					}
					x[j] = r;
					w[j] = 2 / (1 - r**2) / t4**2
				}
				// rescale [a,b] to [-1,1]
				var len = (b - a) / 2;
				var mid = (b + a) / 2;
				var sum = 0;
				for (var j = 1 ; j <= n/2 ; j++) sum += w[j] * (f(mid - len*x[j]) + f(mid + len*x[j]));
				return len * sum;
			default:
				throw Error('Unsupported integration method');
		}
	}

	discreteIntegral(values,step) {
		// Euler-Maclaurin this.summation over fixed intervals
		var s = (values[0] + values[ values.length - 1 ]) / 2;
		for (var i = 1 ; i < values.length - 1 ; i++) s += values[i];
		return s * step;
	}

	summation(f,[a,b]) {
		if (this.isComplex(f(a))) {
			var s = this.complex(0);
			for (var i = a ; i <= b ; i++) s = this.add(s,f(i));
			return s;
		} else {
			var s = 0;
			for (var i = a ; i <= b ; i++) s += f(i);
			return s;
		}
	}

	polynomial(x,coefficients,derivative=false) {
		// Horner's method with highest pow coefficient first
		var p = coefficients[0];
		var q = 0;
		for (var i = 1 ; i < coefficients.length ; i++) {
			if (derivative) q = this.add(p,this.mul(q,x));
			p = this.add(coefficients[i],this.mul(p,x));
		}
		return derivative ? {polynomial: p,derivative: q} : p;
	}

	partialBell(n,k,argumentArray) {
		if (n === 0 && k === 0) return 1;
		if (n === 0 || k === 0) return 0;
		// evaluate recursively
		var s = 0;
		var p = 1;
		for (var i = 1 ; i <= n - k + 1 ; i++) {
			s += p * argumentArray[i-1] * this.partialBell(n-i,k-1,argumentArray);
			p *= (n - i) / i;
		}
		return s;
	}

	findRoot(f,start,options={}) {
		var tolerance = 'tolerance' in options ? options.tolerance : 1e-10;
		var maxIter = 100;
		if (Array.isArray(f)) {
			if (f.length !== start.length) throw Error('Mismatch between equations and starting point for root');
			var root = start;
			for (var i = 0; i < maxIter ; i++) {
				var J = [],F = [];
				for (var j = 0 ; j < root.length ; j++) {
					J.push(this.gradient(f[j],root));
					F.push(f[j].apply(null,root));
				}
				var delta = this.luSolve(J,F);
				for (var j = 0 ; j < root.length ; j++) root[j] -= delta[j];
				if (delta.every(d => Math.abs(d) < tolerance)) return root;
			}
			throw Error('No root found for tolerance ' + tolerance);
		}
		if (!Array.isArray(start) && !options.method) options.method = 'newton';
		var method = 'method' in options ? options.method : 'bithis.sect';
		switch(method) {
			case 'bithis.sect':
				var a = start[0];
				var b = start[1];
				var fa = f(a);
				var fb = f(b);
				if (fa * f(b) >= 0) throw Error('Change of sign necessary for bithis.section');
				var root,h;
				if (fa < 0) {
					root = a;
					h = b - a;
				} else {
					root = b;
					h = a - b;
				}
				for (var i = 0; i < maxIter ; i++) {
					h /= 2;
					var mid = root + h;
					fmid = f(mid);
					if (fmid <= 0) root = mid;
					if (fmid === 0 || Math.abs(h) < tolerance) return root;
				}
				throw Error('No root found for tolerance ' + tolerance);
			case 'newton':
				var root = start;
				if (this.isComplex(root)) {
					for (var i = 0; i < maxIter ; i++) {
						var delta = this.div(f(root),this.diff(f,root));
						root = this.sub(root,delta);
						if (this.abs(delta) < tolerance) return root;
					}
				} else {
					for (var i = 0; i < maxIter ; i++) {
						var delta = f(root) / this.diff(f,root);
						root -= delta;
						if (Math.abs(delta) < tolerance) return root;
					}
				}
				throw Error('No root found for tolerance ' + tolerance);
			default: throw Error('Unsupported oot finding method');
		}
	}

	findRoots(f,point,tolerance=1e-10) {
		console.this.log('Renamed to this.findRoot');
	}

	spline(points,value='function',tolerance=1e-10) {
		// adapted from gsl / cspline.c and reference therein
		var a = [],b = [],c = [],d = [];
		for (var i = 0 ; i < points.length ; i++) a[i] = points[i][1];
		c[0] = 0;
		c[ points.length - 1 ] = 0;
		var A = this.matrix(points.length - 2);
		var y = this.vector(points.length - 2);
		function h(i) { return points[i+1][0] - points[i][0]; }
		for (var i = 0 ; i < A.length ; i++) {
			A[i][i] = 2 * (h(i) + h(i+1));
			y[i] = 3 * (a[i+2] - a[i+1]) / h(i+1) - 3 * (a[i+1] - a[i]) / h(i);
		}
		for (var i = 1 ; i < A.length ; i++) {
			A[i][i-1] = h(i); 
			A[i-1][i] = h(i); 
		}
		var x = this.luSolve(A,y);
		for (var i = 0 ; i < x.length ; i++) c[i+1] = x[i];
		for (var i = 0 ; i < c.length - 1 ; i++) {
			b[i] = (a[i+1] - a[i]) / h(i) - (c[i+1] + 2*c[i]) * h(i) / 3;
			d[i] = (c[i+1] - c[i]) / 3 / h(i);
		}
		switch(value) {
			case 'function':
				return function(x) {
					if (x < points[0][0] || x > points[points.length-1][0])
						throw Error('Argument outside spline input domain');
					for (var i = 0 ; i < points.length ; i++)
						if (x === points[i][0]) return a[i];
					for (var i = 0 ; i < points.length - 1 ; i++)
						if (x > points[i][0] && x < points[i+1][0]) {
							var xi = points[i][0];
							return a[i] + b[i] * (x - xi) + c[i] * (x - xi)**2 + d[i] * (x - xi)**3;
						}
				}
			case 'derivative':
				return function(x) {
					if (x < points[0][0] || x > points[points.length-1][0])
						throw Error('Argument outside spline input domain');
					// method does not define b[points.length-1] so fudge endpoint
					if (x === points[points.length-1][0]) x -= tolerance;
					for (var i = 0 ; i < points.length ; i++)
						if (x === points[i][0]) return b[i];
					for (var i = 0 ; i < points.length - 1 ; i++)
						if (x > points[i][0] && x < points[i+1][0]) {
							var xi = points[i][0];
							return b[i] + 2 * c[i] * (x - xi) + 3 * d[i] * (x - xi)**2;
						}
				}
			case 'integral':
				return function(x) {
					if (x < points[0][0] || x > points[points.length-1][0])
						throw Error('Argument outside spline input domain');
					var sum = 0;
					function F(x,i) {
						var xi = points[i][0];
						return a[i] * (x - xi) + b[i] * (x - xi)**2 / 2 + c[i] * (x - xi)**3 / 3 + d[i] * (x - xi)**4 / 4;
					}
					for (var i = 0 ; i < points.length - 1 ; i++)
						if (x < points[i+1][0]) {
							sum += F(x,i) - F(points[i][0],i);
							break;
						} else sum += F(points[i+1][0],i) - F(points[i][0],i);
					return sum;
				}
			default: throw Error('Unsupported spline value');
		}
	}

	fourierSinCoefficient(f,n,period) {
		if (!Number.isInteger(n)) throw Error('Nonintegral Fourier index');
		if (n === 0) return 0;
		if (typeof f === 'function') {
			var T = period || 2*this.pi;
			return 2/T * this.integrate(t => f(t) * this.sin(2*n*this.pi/T * t),[0,T],{ method: 'this.tanh-this.sinh' });
		}
		if (Array.isArray(f)) {
			var s = 0,N = f.length;
			for (var i = 0 ; i < N ; i++) s += f[i][1] * this.sin(2*n*this.pi*i/N);
			return 2 * s / N;
		}
		throw Error('Unsupported Fourier input');
	}

	fourierCosCoefficient(f,n,period) {
		if (!Number.isInteger(n)) throw Error('Nonintegral Fourier index');
		if (typeof f === 'function') {
			var T = period || 2*this.pi;
			return (n === 0) ?
				1/T * this.integrate(t => f(t),[0,T],{ method: 'this.tanh-this.sinh' }) :
				2/T * this.integrate(t => f(t) * this.cos(2*n*this.pi/T * t),[0,T],{ method: 'this.tanh-this.sinh' });
		}
		if (Array.isArray(f)) {
			var s = 0,N = f.length;
			if (n === 0) {
				for (var i = 0 ; i < N ; i++) s += f[i][1];
				return s / N;
			}
			for (var i = 0 ; i < N ; i++) s += f[i][1] * this.cos(2*n*this.pi*i/N);
			return 2 * s / N;
		}
		throw Error('Unsupported Fourier input');
	}

	eigensystem(A,symmetric=true) {
		if (symmetric) return this.tridiagonalQL(this.tridiagonalForm(A));
		else throw Error('Unsupported eigensystem');
	}

	// sourced from http://math.nist.gov/javanumerics/jama/
	// no need to reinvent this wheel...

	tridiagonalForm(A) {
		var n = A.length;
		var V = [];
		for (var i = 0 ; i < n ; i++) V[i] = A[i].slice(); // deeper copy
		var d = this.vector(n);
		var e = this.vector(n);
		for (var j = 0 ; j < n ; j++) d[j] = V[n-1][j];
		// Householder reduction to tridiagonal form
		for (var i = n - 1 ; i > 0 ; i--) { 
			// scale to avoid under/overflow
			var scale = 0;
			var h = 0;
			for (var k = 0 ; k < i ; k++) scale += Math.abs(d[k]);
			if (scale === 0) {
				e[i] = d[i-1];
				for (var j = 0 ; j < i ; j++) {
					d[j] = V[i-1][j];
					V[i][j] = 0;
					V[j][i] = 0;
				}
			} else {
				// generate Householder this.vector
				for (var k = 0 ; k < i ; k++) {
					d[k] /= scale;
					h += d[k] * d[k];
				}
				var f = d[i-1];
				var g = Math.sqrt(h);
				if (f > 0) g = -g;
				e[i] = scale * g;
				h = h - f * g;
				d[i-1] = f - g;
				for (var j = 0; j < i; j++) e[j] = 0;
				// apply similarity transformation to remaining columns
				for (var j = 0 ; j < i ; j++) {
					f = d[j];
					V[j][i] = f;
					g = e[j] + V[j][j] * f;
					for (var k = j + 1 ; k <= i - 1 ; k++) {
						g += V[k][j] * d[k];
						e[k] += V[k][j] * f;
					}
					e[j] = g;
				}
				f = 0;
				for (var j = 0 ; j < i ; j++) {
					e[j] /= h;
					f += e[j] * d[j];
				}
				var hh = f / (h + h);
				for (var j = 0 ; j < i ; j++) {
					e[j] -= hh * d[j];
				}
				for (var j = 0 ; j < i ; j++) {
					f = d[j];
					g = e[j];
					for (var k = j ; k <= i - 1 ; k++) {
						V[k][j] -= f * e[k] + g * d[k];
					}
					d[j] = V[i-1][j];
					V[i][j] = 0;
				}
			}
			d[i] = h;
		}
		// accumulate transformations
		for (var i = 0 ; i < n - 1 ; i++) {
			V[n-1][i] = V[i][i];
			V[i][i] = 1;
			var h = d[i+1];
			if (h !== 0) {
				for (var k = 0 ; k <= i ; k++) d[k] = V[k][i+1] / h;
				for (var j = 0 ; j <= i ; j++) {
					var g = 0;
					for (var k = 0 ; k <= i ; k++) g += V[k][i+1] * V[k][j];
					for (var k = 0 ; k <= i ; k++) V[k][j] -= g * d[k];
				}
			}
			for (var k = 0; k <= i; k++) V[k][i+1] = 0;
		}
		for (var j = 0 ; j < n ; j++) {
			d[j] = V[n-1][j];
			V[n-1][j] = 0;
		}
		V[n-1][n-1] = 1;
		e[0] = 0;
		return { diagonal: d,offDiagonal: e,eigenvectors: V };
	}

	tridiagonalQL(tridiagonalForm) {
		var d = tridiagonalForm.diagonal;
		var n = d.length;
		var e = tridiagonalForm.offDiagonal;
		var V = tridiagonalForm.eigenvectors;
		function hypot(a,b) {
			var r;
			if (Math.abs(a) > Math.abs(b)) {
				r = b/a;
				r = Math.abs(a) * Math.sqrt(1 + r*r);
			} else if (b != 0) {
				r = a/b;
				r = Math.abs(b) * Math.sqrt(1 + r*r);
			} else r = 0;

			return r;
		}
		for (var i = 1 ; i < n ; i++) e[i-1] = e[i];
		e[n-1] = 0;
		var f = 0;
		var tst1 = 0;
		var eps = Math.pow(2,-52);
		for (var l = 0 ; l < n ; l++) {
			// find small subdiagonal element
			tst1 = Math.max(tst1,Math.abs(d[l]) + Math.abs(e[l]));
			var m = l;
			while (m < n) {
				if (Math.abs(e[m]) <= eps*tst1) break;
				m++;
			}
			// if m === l,d[l] is an eigenvalue,otherwise iterate
			if (m > l) {
				var iter = 0;
				do {
					iter = iter + 1;
					if (iter > 1000) throw Error('Eigenvalues not converging...');
					// compute implicit shift
					var g = d[l];
					var p = (d[l+1] - g) / (2 * e[l]);
					var r = hypot(p,1);
					if (p < 0) r = -r;
					d[l] = e[l] / (p + r);
					d[l+1] = e[l] * (p + r);
					var dl1 = d[l+1];
					var h = g - d[l];
					for (var i = l + 2 ; i < n ; i++) d[i] -= h;
					f = f + h;
					// implicit QL transformation
					p = d[m];
					var c = 1;
					var c2 = c;
					var c3 = c;
					var el1 = e[l+1];
					var s = 0;
					var s2 = 0;
					for (var i = m - 1 ; i >= l ; i--) {
						c3 = c2;
						c2 = c;
						s2 = s;
						g = c * e[i];
						h = c * p;
						r = hypot(p,e[i]);
						e[i+1] = s * r;
						s = e[i] / r;
						c = p / r;
						p = c * d[i] - s * g;
						d[i+1] = h + s * (c * g + s * d[i]);
						// accumulate transformation
						for (var k = 0 ; k < n ; k++) {
							h = V[k][i+1];
							V[k][i+1] = s * V[k][i] + c * h;
							V[k][i] = c * V[k][i] - s * h;
						}
					}
					p = -s * s2 * c3 * el1 * e[l] / dl1;
					e[l] = s * p;
					d[l] = c * p;
					// check for convergence
				} while (Math.abs(e[l]) > eps*tst1);
			}
			d[l] = d[l] + f;
			e[l] = 0;
		}
		// sort eigenvalues and corresponding vectors
		for (var i = 0 ; i < n - 1 ; i++) {
			var k = i;
			var p = d[i];
			for (var j = i + 1 ; j < n ; j++) {
				if (d[j] < p) {
					k = j;
					p = d[j];
				}
			}
			if (k != i) {
				d[k] = d[i];
				d[i] = p;
				for (var j = 0 ; j < n ; j++) {
					p = V[j][i];
					V[j][i] = V[j][k];
					V[j][k] = p;
				}
			}
		}
		return { eigenvalues: d,eigenvectors: V };
	}

	hessenbergForm(A) {

	}


	luDecomposition(A,tolerance=1e-10) {
		var size = A.length;
		var LU = [];
		for (var i = 0 ; i < size ; i++) LU[i] = A[i].slice(); // deeper copy
		var P = this.identity(size);
		pivots = 0;
		for (var i = 0 ; i < size ; i++) {
			var maxValue = 0;
			var maxIndex = i;
			for (var j = i ; j < size ; j++) {
				var element = Math.abs(LU[j][i]);
				if (element > maxValue) {
					maxValue = element;
					maxIndex = j;
				}
			}
			if (maxValue < tolerance) throw Error('Matrix is degenerate');
			if (maxIndex !== i) {
				// pivot this.matrix rows
				var t = LU[i];
				LU[i] = LU[maxIndex];
				LU[maxIndex] = t;
				// pivot permutation rows
				var t = P[i];
				P[i] = P[maxIndex];
				P[maxIndex] = t;
				pivots++;
			}
			for (var j = i + 1 ; j < size ; j++) {
				LU[j][i] /= LU[i][i];
				for (var k = i + 1; k < size ; k++)
					LU[j][k] -= LU[j][i] * LU[i][k];
			}
		}
		var L = this.identity(size);
		for (var i = 1 ; i < size ; i++)
			for (var j = 0 ; j < i ; j++) L[i][j] = LU[i][j];
		var U = this.matrix(size);
		for (var i = 0 ; i < size ; i++)
			for (var j = i ; j < size ; j++) U[i][j] = LU[i][j];
		return { L: L,U: U,P: P,pivots: pivots };
	}

	luSolve(A,b) {
		var size = A.length;
		var lu = this.luDecomposition(A);
		var x = this.vector(size);
		var y = this.vector(size);
		var pb = this.vector(size);
		for (var i = 0 ; i < size ; i++)
			for (var j = 0 ; j < size ; j++)
				pb[i] += lu.P[i][j] * b[j];
		// forward solve
		for (var i = 0 ; i < size ; i++) {
			y[i] = pb[i];
			for (var j = 0 ; j < i ; j++) y[i] -= lu.L[i][j] * y[j];
			y[i] /= lu.L[i][i];
		}
		// backward solve
		for (var i = size - 1 ; i >= 0 ; i--) {
			x[i] = y[i];
			for (var j = i + 1 ; j < size ; j++) x[i] -= lu.U[i][j] * x[j];
			x[i] /= lu.U[i][i];	
		}	
		return x;
	}

	determinant(A) {
		var lu = this.luDecomposition(A);
		var product = 1;
		for (var i = 0 ; i < A.length; i++) product *= lu.U[i][i];
		return (-1)**lu.pivots * product;
	}

	inverse(A) {
		// calling luSolve for each column is not efficient
		//	 but avoids code duplication
		var I = this.matrix(A.length);
		for (var i = 0 ; i < A.length ; i++) {
			var b = this.vector(A.length);
			b[i] = 1;
			var x = this.luSolve(A,b);
			for (var j = 0 ; j < A.length ; j++) I[j][i] = x[j];
		}
		return I;
	}

	vector(size,value=0) {
		var v = [];
		for (var i = 0 ; i < size ; i++) v.push(value);
		return v;
	}

	matrix(rows,columns,value=0) {
		var columns = columns || rows;
		var m = [];
		for (var i = 0 ; i < rows ; i++) {
			m.push([]);
			for (var j = 0 ; j < columns ; j++) m[i].push(value);
		}
		return m;
	}

	identity(rows,value=1) {
		var m = this.matrix(rows);
		for (var i = 0 ; i < rows ; i++) m[i][i] = value;
		return m;
	}

	transpose(A) {
		var T = this.matrix(A[0].length,A.length);
		for (var i = 0 ; i < A.length ; i++)
			for (var j = 0 ; j < A[0].length ; j++)
				T[j][i] = A[i][j];
		return T;
	}

	matrixAdd(A,B) {
		if (!Array.isArray(A) && !Array.isArray(B)) throw Error('No matrices to this.add');
		if (!Array.isArray(A)) A = this.matrix(B.length,B[0].length,A);
		if (!Array.isArray(B)) B = this.matrix(A.length,A[0].length,B);
		var C = this.matrix(A.length,A[0].length,0);
		for (var i = 0 ; i < A.length ; i++)
			for (var j = 0 ; j < A[0].length ; j++)
				C[i][j] = this.add(A[i][j],B[i][j]);
		return C;
	}

	matrixSub(A,B) {
		if (!Array.isArray(A) && !Array.isArray(B)) throw Error('No matrices to subtract');
		if (!Array.isArray(A)) A = this.matrix(B.length,B[0].length,A);
		if (!Array.isArray(B)) B = this.matrix(A.length,A[0].length,B);
		var C = this.matrix(A.length,A[0].length,0);
		for (var i = 0 ; i < A.length ; i++)
			for (var j = 0 ; j < A[0].length ; j++)
				C[i][j] = this.sub(A[i][j],B[i][j]);
		return C;
	}

	matrixMul(A,B) {
		if (!Array.isArray(A) && !Array.isArray(B)) throw Error('No matrices to multiply');
		if (!Array.isArray(A)) A = this.identity(B.length,A);
		if (!Array.isArray(B)) B = this.identity(A[0].length,B);
		if (A[0].length !== B.length) throw Error('Incompatible matrices to multiply');
		var C = this.matrix(A.length,B[0].length,0);
		for (var i = 0 ; i < A.length ; i++)
			for (var j = 0 ; j < B[0].length ; j++)
				for (var k = 0 ; k < A[0].length ; k++)
					C[i][j] = this.add(C[i][j],this.mul(A[i][k],B[k][j]));
		return C;
	}
}
