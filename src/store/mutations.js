/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint prefer-const: "off" */


export default {

  hideTitleScreen(state) {
    state.isTitleShowing = false;
  },
  toggleDrawer(state, { show }) {
    state.showDrawer = show === undefined ? !state.showDrawer : show;
  },
  setChild(state, {child}) {
    state.currentTask = child;
  },
  setTurn(state, {turn}) {
    state.turn = turn;
  }
};
