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
    return range(1, W + 1).map(x => range(1, H + 1).map(y => ({ x: x, y: y })).filter(p => pred(b[p.y][p.x])));
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
function sliceOn(ts, pred) {
    const bs = ts.map(pred);
    const i = bs.indexOf(true);
    return i === -1 ? [[]] : [ts.slice(0, i), ts.slice(i + 1)];
}
/*
 * fundamental tests
 */
function assertEquals(act, exp, message) {
    if (Array.isArray(act)) {
        act = JSON.stringify(act);
    }
    if (Array.isArray(exp)) {
        exp = JSON.stringify(exp);
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
assertEquals(sliceOn([1, 2, 3, 4, 5], n => n === 3), [[1, 2], [4, 5]], 'sliceOn: must be 2 length arrays.');
assertEquals(sliceOn([1, 2, 3, 4, 5], n => n === 6), [[]], 'sliceOn: must be empty.');
/*
 * procedures
 */
/*
 * 石を初期配置する
 */
function putInitStones(b) {
    b[4][4] = 'W';
    b[4][5] = 'B';
    b[5][4] = 'B';
    b[5][5] = 'W';
}
/*
 * 自分の石を置き、裏返せる石を自分の石にする
 */
function put(b, p, ownStone) {
    if (canPut(b, p, ownStone)) {
        b[p.y][p.x] = ownStone;
        getReversiblePoints(b, p, ownStone).forEach(p => b[p.y][p.x] = ownStone);
        return true;
    }
    else {
        return false;
    }
}
/*
 * 手番を交代するか判定する
 * 全ての石の Point[] を作り、その周囲の Point[] を作り、そこに 1 つでも次の手番で置けるセルがあれば交代する
 */
function getNextPlayer(b, current) {
    return takeAll(b, c => ['B', 'W'].includes(c)).flat()
        .flatMap(getRounds)
        .some(p => canPut(b, p, change(current)))
        ? change(current) : current;
}
/*
 * p に ownStone が置けるか判定する
 * 裏返る石があれば置ける
 */
function canPut(b, p, ownStone) {
    return b[p.y][p.x] !== 'N' ? false : getReversiblePoints(b, p, ownStone).length !== 0;
}
/*
 * p に ownStone を置いた場合に裏返る Point[] を返す
 * 1 方向に直線に伸びる Point[] を作り、自分の石で囲った範囲に限定し、その範囲に相手の石があり空白がなければそこは裏返る
 */
function getReversiblePoints(b, p, ownStone) {
    return directions.flatMap(d => {
        const straightPs = take(b, p, d);
        const surroundPs = sliceOn(straightPs, p => b[p.y][p.x] === ownStone)[0];
        return surroundPs.some(p => b[p.y][p.x] === reverse(ownStone)) && surroundPs.every(p => b[p.y][p.x] !== 'N')
            ? surroundPs : [];
    });
}
