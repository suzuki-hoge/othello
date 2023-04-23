/*
 * types
 */
const W = 8;
const H = 8;
const directions = [-1, 0, 1].flatMap(x => [-1, 0, 1].map(y => ({ x: x, y: y }))).filter(d => d.x !== 0 || d.y !== 0);
/*
 * fundamental functions
 */
function range(s, e) {
    return [...Array(e - s).keys()].map(n => n + s);
}
function createBoard() {
    const board = range(0, H + 2).map(_ => range(0, W + 2).map(_ => 'G'));
    range(1, H + 1).forEach(y => range(1, W + 1).forEach(x => board[y][x] = 'N'));
    return board;
}
function reverse(s) {
    return s === 'W' ? 'B' : 'W';
}
function change(p) {
    return p === 'W' ? 'B' : 'W';
}
function getRounds(p) {
    return directions.map(d => next(p, d));
}
function takeAll(b, pred) {
    return range(0, W + 2).flatMap(x => range(0, H + 2).map(y => ({ x: x, y: y }))).filter(p => pred(b[p.y][p.x]));
}
function take(b, p, d) {
    const points = [];
    while (b[p.y + d.y][p.x + d.x] !== 'G') {
        p = next(p, d);
        points.push(p);
    }
    return points;
}
function next(p, d) {
    return { x: p.x + d.x, y: p.y + d.y };
}
/*
 * fundamental tests
 */
function assertEquals(exp, act, message) {
    if (Array.isArray(exp)) {
        exp = JSON.stringify(exp);
    }
    if (Array.isArray(act)) {
        act = JSON.stringify(act);
    }
    console.assert(exp === act, `${message}\n  exp: ${exp}\n  act: ${act}\n`);
}
assertEquals(range(0, 3), [0, 1, 2], 'range: end must be exclusive.');
assertEquals(range(2, 5), [2, 3, 4], 'range: start must be inclusive.');
assertEquals(reverse('W'), 'B', 'reverse: white must change to black.');
assertEquals(reverse('B'), 'W', 'reverse: black must change to white.');
assertEquals(change('W'), 'B', 'change: white must change to black.');
assertEquals(change('B'), 'W', 'change: black must change to white.');
const b = createBoard();
assertEquals(getRounds({ x: 3, y: 3 }), [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }], 'rounds: must be 8 points.');
assertEquals(take(b, { x: 3, y: 3 }, { x: -1, y: -1 }), [{ x: 2, y: 2 }, { x: 1, y: 1 }], 'take: must contain the upper left cells.');
assertEquals(take(b, { x: 1, y: 1 }, { x: -1, y: -1 }), [], 'take: must be empty.');
