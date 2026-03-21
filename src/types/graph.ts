/** X/Y position in the virtual canvas coordinate system. */
export interface NodePosition {
  x: number;
  y: number;
  /** Velocity — used during force-layout simulation. */
  vx: number;
  vy: number;
}

/** Map from step id to its computed canvas position. */
export type PositionMap = Record<number, NodePosition>;

/** Pan/zoom state for the SVG canvas. */
export interface GraphTransform {
  x: number;
  y: number;
  k: number;
}

/** A dependency edge represented as a [from, to] tuple. */
export type EdgeTuple = readonly [number, number];
