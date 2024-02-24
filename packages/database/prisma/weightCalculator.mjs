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

const calculateAdjustedDistance = (nodeA, nodeB) => {
  const floorA = mapFloorToNumber(nodeA.floor);
  const floorB = mapFloorToNumber(nodeB.floor);

  const baseHorizontalDistance = Math.sqrt(
    Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
      Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
  );

  const floorDifference = Math.abs(floorA - floorB);

  const elevatorWeightPerFloor = 5;
  const stairsWeightPerFloor = 10;
  const baseElevatorWaitTime = 15;

  let weight = baseHorizontalDistance;

  if (floorDifference > 0) {
    if (nodeA.nodeType === "ELEV" && nodeB.nodeType === "ELEV") {
      weight += floorDifference * elevatorWeightPerFloor + baseElevatorWaitTime;
    } else if (nodeA.nodeType === "STAI" && nodeB.nodeType === "STAI") {
      weight += floorDifference * stairsWeightPerFloor;
    }
  }

  return weight;
};

export const calculateEdgeWeights = (nodes, edges) => {
  const nodeMap = new Map();
  nodes.forEach((node) =>
    nodeMap.set(node.nodeID, {
      ...node,
      xcoord: Number(node.xcoord),
      ycoord: Number(node.ycoord),
      floor: node.floor,
      nodeType: node.nodeType,
    })
  );

  return edges.map((edge) => {
    const startNode = nodeMap.get(edge.startNode);
    const endNode = nodeMap.get(edge.endNode);

    if (!startNode || !endNode) {
      throw new Error("Node not found");
    }

    const weight = calculateAdjustedDistance(startNode, endNode);

    return { edgeID: edge.edgeID, weight };
  });
};
