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
 * Extracts the elevator shaft identifier from a node ID.
 * @param {string} nodeId The node ID of an elevator.
 * @returns {string} The extracted elevator shaft identifier.
 */
const extractElevatorShaftId = (nodeId) => {
    const match = nodeId.match(/^[A-Z]+/);
    return match ? match[0] : '';
};

/**
 * Adjusts the distance calculation for elevators and stairs based on floor changes,
 * including a penalty for switching elevators.
 *
 * @param {Nodes} nodeA
 * @param {Nodes} nodeB
 * @returns {number} The adjusted weight for the edge.
 */
const calculateAdjustedDistance = (nodeA, nodeB) => {
    const floorA = mapFloorToNumber(nodeA.floor);
    const floorB = mapFloorToNumber(nodeB.floor);
    const elevatorWeightPerFloor = 10000;
    const stairsWeightPerFloor = 15000;
    const elevatorSwitchPenalty = 50000; // Example penalty value

    if (nodeA.nodeType === "ELEV" && nodeB.nodeType === "ELEV") {
        const floorDifference = Math.abs(floorA - floorB);
        let weight = floorDifference * elevatorWeightPerFloor;
        
        const elevatorShaftIdA = extractElevatorShaftId(nodeA.nodeID);
        const elevatorShaftIdB = extractElevatorShaftId(nodeB.nodeID);

        
        if (elevatorShaftIdA !== elevatorShaftIdB) {
            weight += elevatorSwitchPenalty;
        }

        return weight;
    } else if (nodeA.nodeType === "STAI" && nodeB.nodeType === "STAI") {
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

    const elevatorEdgePenalty = 100000;

    const edgeWeights = edges.map((edge) => {
        const startNode = nodeMap.get(edge.startNode);
        const endNode = nodeMap.get(edge.endNode);

        if (!startNode || !endNode) {
            throw new Error("Node not found");
        }

        
        let weight = calculateAdjustedDistance(startNode, endNode);
        if (endNode.nodeType === "ELEV") {
            weight += elevatorEdgePenalty;
        }

        return { edgeID: edge.edgeID, weight };
    });

    return edgeWeights;
};
