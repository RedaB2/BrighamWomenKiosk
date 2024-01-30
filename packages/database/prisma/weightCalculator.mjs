/**
 * @typedef {import('database').Edges} Edges
 * @typedef {import('database').Nodes} Nodes
 */

/**
 * @typedef EdgeWeight
 * @property {string} Edges.edgeID
 * @property {number} weight
 */

/**
 * Assumes that the nodes' coordinates are in the same plane (in this case, the same floor).
 *
 * @param {Nodes} nodeA
 * @param {Nodes} nodeB
 * @returns {number} The Euclidean distance between two nodes
 */
const calculateDistance = (nodeA, nodeB) => {
  return Math.sqrt(
    Math.pow(nodeA.xcoord - nodeB.xcoord, 2) +
      Math.pow(nodeA.ycoord - nodeB.ycoord, 2)
  );
};

/**
 * Calculates the weight (the length) of each edge.
 *
 * @param {Nodes[]} nodes
 * @param {Edges[]} edges
 * @returns {EdgeWeight[]}
 */
export const calculateEdgeWeights = (nodes, edges) => {
  /** @type {Map<string, Nodes>} */
  const nodeMap = new Map();
  nodes.forEach((node) => nodeMap.set(node.nodeID, node));

  /** @type {EdgeWeight[]} */
  const edgeWeights = edges.map((edge) => {
    const startNode = nodeMap.get(edge.startNode);
    const endNode = nodeMap.get(edge.endNode);

    if (!startNode || !endNode) {
      throw new Error("Node not found");
    }

    const weight = calculateDistance(startNode, endNode);
    return { edgeID: edge.edgeID, weight };
  });

  return edgeWeights;
};
