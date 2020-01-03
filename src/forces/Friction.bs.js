// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as $$Math from "../core/Math.bs.js";
import * as Vector from "../core/Vector.bs.js";
import * as Gravity from "./Gravity.bs.js";

function frictionForceMag(mu, mass) {
  return mu * Gravity.gE * mass;
}

function frictionForceV(mu, mass, velocity) {
  var mag = frictionForceMag(mu, mass);
  var dir = Vector.normf(Vector.multf(velocity, -1));
  return Vector.multf(dir, mag);
}

function getMaxDistanceFriction(mu, initialVelocity) {
  var accelerationF = -1 * mu * Gravity.gE;
  return $$Math.sqf(initialVelocity * 1000) / (-2 * accelerationF);
}

export {
  frictionForceMag ,
  frictionForceV ,
  getMaxDistanceFriction ,
  
}
/* Gravity Not a pure module */