/*
 * types
 */

const W: number = 8
const H: number = 8

type Point = { x: number, y: number }

type Direction = { x: -1 | 0 | 1, y: -1 | 0 | 1 }

type Player = 'B' | 'W'

type Stone = 'B' | 'W'

type Cell = 'B' | 'W' | 'N' | 'G'    // Black, White, None, Guard

type Row = Cell[]

type Board = Row[]

