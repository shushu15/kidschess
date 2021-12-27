/**
 * Mixin to add to the topmost component, responsible timing, idle timer
 * */
import * as KidsConst from '@/lib/const.js';

const TimerMixin = {
  data() {
    return {
        isInactive: false,
        userActivityThrottlerTimeout: null,
        userActivityTimeout: null,
        timers: {
          start: performance.now(),
          checked: performance.now(),
        }
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  /*
  created() {
    // check passive listeners support
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          this.supportsPassive = true;
          return true;
        },
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {
      console.log(`TimerMixin passive error ${e.toString()}`); // eslint-disable-line no-console

      // continue regardless of error
    }
  },
  */
  beforeMount() {
    this.activateActivityTracker();
    this.userActivityThrottler();
  },

  beforeDestroy() {
    this.deactivateActivityTracker();
    clearTimeout(this.userActivityTimeout);
    clearTimeout(this.userActivityThrottlerTimeout);
  },
  /*
  provide() {
    return {
      timer: this,
    };
  }, */


  methods: {
    // idle Timer methodds
    activateActivityTracker() {
      ['click', 'touchstart'].forEach(evt => window.addEventListener(evt, this.userActivityThrottler, false));
      //window.addEventListener("mousemove", this.userActivityThrottler);
      //window.addEventListener("scroll", this.userActivityThrottler);
      //window.addEventListener("keydown", this.userActivityThrottler);
      //window.addEventListener("resize", this.userActivityThrottler);
    },

    deactivateActivityTracker() {
      ['click', 'touchstart'].forEach(evt => window.removeEventListener(evt, this.userActivityThrottler, false));
      //window.removeEventListener("mousemove", this.userActivityThrottler);
      //window.removeEventListener("scroll", this.userActivityThrottler);
      //window.removeEventListener("keydown", this.userActivityThrottler);
      //window.removeEventListener("resize", this.userActivityThrottler);
    },
    resetUserActivityTimeout() {
      clearTimeout(this.userActivityTimeout);

      this.userActivityTimeout = setTimeout(() => {
        this.inactiveUserAction();
        this.userActivityThrottler(false);
      }, KidsConst.INACTIVE_USER_TIME_THRESHOLD-KidsConst.USER_ACTIVITY_THROTTLER_TIME); // KidsConst.INACTIVE_USER_TIME_THRESHOLD-KidsConst.USER_ACTIVITY_THROTTLER_TIME
    },
    userActivityThrottler(fromUser=true) {
      if (this.isInactive && fromUser) {
        this.isInactive = false;
        this.timers.checked = performance.now();
      }
      if (!this.userActivityThrottlerTimeout) {
        this.userActivityThrottlerTimeout = setTimeout(() => {
          this.resetUserActivityTimeout();
          clearTimeout(this.userActivityThrottlerTimeout);
          this.userActivityThrottlerTimeout = null;
        }, KidsConst.USER_ACTIVITY_THROTTLER_TIME);
      }
    },
    inactiveUserAction() {
      this.isInactive = true;
      console.log(`TimerMixin: now=${performance.now()} idle=${this.timers.checked} uptime=${this.timers.start}`); // eslint-disable-line no-console
      return new Promise((resolve) => {
        this.emit('timer-idle', { idle: performance.now()-this.timers.checked, uptime: performance.now()-this.timers.start }); 
        resolve();
      });
    },


    emit(name, e) {
      if (typeof this.emitEvent === 'function') {
        this.emitEvent(name, e );
      }
    },
    getPassive() {
      return this.supportsPassive;
    },

  },

};

export { TimerMixin as default };
