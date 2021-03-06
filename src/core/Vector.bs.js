// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as $$Math from "./Math.bs.js";
import * as Caml_int32 from "bs-platform/lib/es6/caml_int32.js";

function add(v1, v2) {
  return [
          v1[0] + v2[0] | 0,
          v1[1] + v2[1] | 0
        ];
}

function addf(v1, v2) {
  return [
          v1[0] + v2[0],
          v1[1] + v2[1]
        ];
}

function sub(v1, v2) {
  return [
          v1[0] - v2[0] | 0,
          v1[1] - v2[1] | 0
        ];
}

function subf(v1, v2) {
  return [
          v1[0] - v2[0],
          v1[1] - v2[1]
        ];
}

function mult(v, s) {
  return [
          Math.imul(v[0], s),
          Math.imul(v[1], s)
        ];
}

function multf(v, s) {
  return [
          v[0] * s,
          v[1] * s
        ];
}

function div(v, s) {
  return [
          Caml_int32.div(v[0], s),
          Caml_int32.div(v[1], s)
        ];
}

function divf(v, s) {
  return [
          v[0] / s,
          v[1] / s
        ];
}

function mag(v) {
  var x = v[0];
  var y = v[1];
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function magf(v) {
  return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}

function norm(v) {
  var m = mag(v);
  if (m !== 0) {
    return divf([
                v[0],
                v[1]
              ], m);
  } else {
    return [
            0,
            0
          ];
  }
}

function normf(v) {
  var m = magf(v);
  if (m !== 0) {
    return divf(v, m);
  } else {
    return [
            0,
            0
          ];
  }
}

function lerpfV(acc, target, roundness) {
  var x = $$Math.lerpf(acc[0], target[0], roundness);
  var y = $$Math.lerpf(acc[1], target[1], roundness);
  return [
          x,
          y
        ];
}

function lerpV(acc, target, roundness) {
  var match = lerpfV([
        acc[0],
        acc[1]
      ], [
        target[0],
        target[1]
      ], roundness);
  return [
          match[0] | 0,
          match[1] | 0
        ];
}

export {
  add ,
  addf ,
  sub ,
  subf ,
  mult ,
  multf ,
  div ,
  divf ,
  mag ,
  magf ,
  norm ,
  normf ,
  lerpV ,
  lerpfV ,
  
}
/* No side effect */
