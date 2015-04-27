'use strict';

const level = function(level) {
  return {
    value: level,
    xp: xpFor(level),
    xpForNextLevel: xpFor(level + 1)
  };
};

level.fromXp = function(xp) {
  let l = 0;
  while (true) {
    if (xpFor(l) > xp) {
      return level(l);
    }
    l++;
  }
};

function xpFor(level) {
  return 100 * daysFor(level);
}

function daysFor(level) {
  function d(level) {
    if (level === 0) {
      return 0;
    }

    if (level === 1) {
      return 1;
    }

    if (level === 2) {
      return 2;
    }

    return 1.5 * d(level - 1);
  }

  if (level === 10) {
    return 66;
  }

  if (level > 10) {
    return daysFor(10) + (daysFor(10) - daysFor(9) + 1 * level) * (level - 10);
  }

  return Math.round(d(level));
}

module.exports = level;