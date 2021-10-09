var STARTING = 0;
var RUNNING = 1;
var FINISHED = 2;
var STOPPED = 3;
var PAUSED = 4;
var DELAYING = 5;
var DEAD = 6;

class S3dAction extends RptCommonAncestor {

	beforePrepare() {
		super.beforePrepare();
		this.status 	 = null;
		this.property    = null;
		this.time        = null;
		this.target      = null;
		this.stepCount   = 0;
		this.stepCounter = 0;		
		this.startTime   = 0;
		this.nextTime    = 0;
		this.onStart     = null;
		this.onRestart   = null;
		this.onRun       = null;
		this.onFinish    = null;
		this.onStop      = null;
		this.onPause     = null;
		this.onDelay     = null;
		this.onDead      = null;
	}
	
	afterPrepare() {
		super.afterPrepare();
		if (this.callback) {
			this.stepCount = 1;
		} else {
			this.prop = this.obj3d[this.property];
			this.v3 = this.prop instanceof THREE.Vector3;
			if (!this.toby) this.toby = "to";
			if (this.toby === "on") setTargetOn();
		}
	}

	duringCreate() {
		super.duringCreate();
		this.start();
	}

	setStep() {
		this.step = {};
		var ti = this.time;
		this.stepCount = (ti && ti.loop && ti.steps) ? ti.loop / ti.steps : 1;
		var s  = this.step;
		var sc = this.stepCount;
		var t  = this.target;
		var p  = this.prop;
		if (this.v3) {
			if (typeof t.x === 'number') s.x = (t.x - p.x) / sc;
			if (typeof t.y === 'number') s.y = (t.y - p.y) / sc;
			if (typeof t.z === 'number') s.z = (t.z - p.z) / sc;
		} else
			if (typeof t === 'number') s.val = (t - p) / sc;
	}

	setTargetOn() {
		var t = this.target;
		var p = this.prop;
		if (this.v3) {
			if (typeof t.x === 'number') t.x += p.x;
			if (typeof t.y === 'number') t.y += p.y;
			if (typeof t.z === 'number') t.z += p.z;
		} else
			if (typeof t === 'number') t += p;
	}

	start() {
		this.status = STARTING;
		var t = this.time;
		this.startTime = Date.now() + ((t && t.start) ? t.start : 0);
		if (this.onStart) this.onStart();
	}

	restart(data) {
		this.prepare();
		this.start();
		if (this.onRestart) this.onRestart();
	}

	run() {
		this.status = RUNNING;
		this.stepCounter = 0;
		this.nextTime = this.startTime;
		this.setStep();
		if (this.onRun) this.onRun(this);
	}

	stop() {
	   this.status = STOPPED;
	   if (this.onStop) this.onStop(this);
	}

	finish(data) {
	   this.status = FINISHED;
	   if (this.onFinish) this.onFinish(this,data);
	}

	pause() {
	   this.status = PAUSED;
	   if (this.onPause) this.onPause(this);
	}

	delay(delayTime) {
	   this.status = DELAYING;
	   if (this.onDelay) this.onDelay(this,delayTime);
	}

	dead() {
	   this.status = DEAD;
	}

	kill() {
	   this.status = DEAD;
	}
	
	exec() {
		if ((this.status === STARTING) && (Date.now() > this.startTime)) this.run();
		if  (this.status === RUNNING) this.execStep();
	}

	execStep() {
		if (Date.now() < this.nextTime) return;
		if (this.callback) {
			this.finish(this.callback(this.cbdata));
		} else {
			var s = this.step;
			if (this.v3) {
				var p = this.prop;
				if (typeof s.x === 'number') p.x += s.x;
				if (typeof s.y === 'number') p.y += s.y;
				if (typeof s.z === 'number') p.z += s.z;
			} else
				if (typeof this.prop === 'number') this.prop += s.val;
			if (++this.stepCounter >= this.stepCount) this.finish();
			else if (this.forceStop && this.forceStop()) this.stop();
			else {
				var d;
				do {
					this.nextTime += this.time.steps;
					d = Date.now();
				} while (this.nextTime < d);
			}
		}
	}
}
