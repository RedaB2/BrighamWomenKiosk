/**
 * @typedef {import('database').Edges} Edges
 * @typedef {import('database').Nodes} Nodes
 */

/**
 * Maps floor labels to numerical values for distance calculations.
 * @param {string} floorLabel
 * @returns {number}
 */
const mapFloorToNumber = (floorLabel) => {
  const mappings = {
    L1: -1,
    L2: -2,
    1: 1,
    2: 2,
    3: 3,
  };
  return mappings[floorLabel] || 0;
};

/**
 * Adjusts the distance calculation for elevators and stairs based on floor changes.
 *
 * @param {Nodes} nodeA
 * @param {Nodes} nodeB
 * @returns {number} The adjusted weight for the edge.
 */
const calculateAdjustedDistance = (nodeA, nodeB) => {
  const floorA = mapFloorToNumber(nodeA.floor);
  const floorB = mapFloorToNumber(nodeB.floor);
  const elevatorWeightPerFloor = 5;
  const stairsWeightPerFloor = 2;

  if (nodeA.nodeType === "ELEV" && nodeB.nodeType === "ELEV") {
    // ADD ELEV WEIGHT
    const floorDifference = Math.abs(floorA - floorB);
    return floorDifference * elevatorWeightPerFloor;
  } else if (nodeA.nodeType === "STAI" && nodeB.nodeType === "STAI") {
    // ADD STAI WEIGHT
    const floorDifference = Math.abs(floorA - floorB);
    return floorDifference * stairsWeightPerFloor;
  } else {
    return Math.sqrt(
      Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
        Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
    );
  }
};

/**
 * Updates the calculateEdgeWeights function to use the new distance calculation, considering node types.
 */
export const calculateEdgeWeights = (nodes, edges) => {
  const nodeMap = new Map();
  nodes.forEach((node) =>
    nodeMap.set(node.nodeID, {
      ...node,
      xcoord: Number(node.xcoord),
      ycoord: Number(node.ycoord),
      floor: mapFloorToNumber(node.floor),
      nodeType: node.nodeType,
    })
  );

  const edgeWeights = edges.map((edge) => {
    const startNode = nodeMap.get(edge.startNode);
    const endNode = nodeMap.get(edge.endNode);

    if (!startNode || !endNode) {
      throw new Error("Node not found");
    }

    const weight = calculateAdjustedDistance(startNode, endNode);
    return { edgeID: edge.edgeID, weight };
  });

  return edgeWeights;
};
