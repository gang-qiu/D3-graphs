// sample of force graph with lots of customizations and categorizations
// this was pulled from a react codebase. by itself it is nonfunctional
// it is here just as a reference

import {
  create,
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  scaleOrdinal,
  schemeSet1,
  schemeSet2,
  select,
  SimulationLinkDatum,
  SimulationNodeDatum,
  symbol,
  symbolCircle,
  symbolSquare,
  symbolSquare2,
  symbolTriangle,
  SymbolType,
} from 'd3';
import { Entity } from 'models/entity.model';
import {
  Structure,
  StructureNode,
  StructureNodeJsonData,
  StructureTiers,
} from 'models/structure.model';
import { ForceDiagramPreferences } from 'pages/Structure/StructureExperiments/ForceDiagram/ForceDiagramPreferences.form';
import {
  getNodeStructureTier,
  getNodeType,
  ShapeColors,
  Shapes,
  typeToColor,
  typeToShape,
} from 'pages/Structure/variables';

type Props = {
  fullStructure?: Structure;
  prefs: ForceDiagramPreferences;
  width: number;
  height: number;
  radius: number;
};

type NodeCoords = { x: number; y: number };
type FixableNode = { fixed: boolean };

/**
 * create the svg and return as a DOM node
 *
 * References:
 * - general force plot walkthrough: https://www.d3indepth.com/force-layout/
 * - shapes https://www.d3indepth.com/shapes/
 * - arrows to links https://stackoverflow.com/questions/16568313/arrows-on-links-in-d3js-force-layout
 * - sticky nodes https://observablehq.com/@d3/sticky-force-layout
 *
 * TODO:
 * - add y position forces for hierarchy depth?
 * */

export default function useForceDiagram({
  fullStructure,
  prefs,
  width,
  height,
  radius,
}: Props) {
  if (!fullStructure) return null;
  const { nodes, links } = fullStructure.relationships ?? {};

  const xPosFromTiers = (data: StructureNode['data']): number => {
    switch (getNodeStructureTier(data)) {
      case StructureTiers.MANAGEMENT:
        return 0;
      case StructureTiers.FUND:
        return width / 4;
      case StructureTiers.HOLDING:
        return (width * 2) / 4;
      default:
        // stakeholder x range can be width/4 +/- 1/8 (slightly wider range)
        return width / 4 + (width / 16 - (Math.random() * width) / 8);
    }
  };

  const yPosFromTiers = (data: StructureNode['data']): number => {
    if (data.type === 'entity') return -height / 4;
    return height / 16; // stakeholders y can start at 0 and naturally be pushed down
  };

  const shapeFromNode = (node: SimulationNodeDatum): SymbolType => {
    switch (typeToShape(getNodeType(node as StructureNode['data']))) {
      case Shapes.CIRCLE:
        return symbolCircle;
      case Shapes.RECTANGLE:
        return symbolSquare;
      case Shapes.TRIANGLE:
        return symbolTriangle;
      default:
        return symbolSquare2;
    }
  };

  const jurisdictionColors = scaleOrdinal()
    .domain(['1', '2', '3', '4', '5', '6'])
    .range(schemeSet1);

  const colorsFromJurisdiction = (node: SimulationNodeDatum): string => {
    if ((node as StructureNode).type === 'entity') {
      const jurisdictionId = (node as Entity).relationships.jurisdiction?.id;
      if (jurisdictionId) return jurisdictionColors(jurisdictionId) as string;
    }

    return ShapeColors.YELLOW;
  };

  const purposeColors = scaleOrdinal()
    .domain(['1', '2', '3', '4', '5', '6'])
    .range(schemeSet2);

  const colorsFromPurpose = (node: SimulationNodeDatum): string => {
    if ((node as StructureNode).type === 'entity') {
      const purposeId = (node as Entity).relationships.purpose?.id;
      if (purposeId) return purposeColors(purposeId) as string;
    }

    return ShapeColors.YELLOW;
  };

  const showLinks =
    prefs.viewStyles.includes('links') ||
    prefs.layout.includes('relationships');

  const d3Links: SimulationLinkDatum<SimulationNodeDatum>[] =
    links?.map((link) => ({
      ...link,
      source: link.relationships.owner.id,
      target: link.relationships.holding.id,
    })) ?? [];

  const d3Nodes: SimulationNodeDatum[] =
    (nodes?.map((node) => ({
      ...node,
    })) as SimulationNodeDatum[]) ?? [];

  // look up nodes for constructing links if linked force is not used
  const d3NodesGrouped = d3Nodes.reduce((group, node) => {
    group[(node as StructureNode).id] = node;
    return group;
  }, {} as Record<string, SimulationNodeDatum>);

  const svg = create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; border: 1px solid black');

  // link arrows
  // https://jenkov.com/tutorials/svg/marker-element.html
  // https://stackoverflow.com/questions/16568313/arrows-on-links-in-d3js-force-layout
  const linkArrowId = 'link-arrow';
  svg
    .append('defs')
    .append('marker')
    .attr('id', linkArrowId)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('marketUnits', 'userSpaceOnUse')
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5');

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2)
    .selectAll()
    .data(d3Links)
    .join('line');

  const node = svg
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2.5)
    .selectAll()
    .data(d3Nodes)
    .join('path')
    .attr(
      'd',
      symbol()
        .type((d) =>
          prefs.viewStyles.includes('shape') ? shapeFromNode(d) : symbolCircle
        )
        .size(2000)
    )
    .attr('fill', (d) => {
      if (prefs.nodeColor === 'entityType') {
        return typeToColor(getNodeType(d as StructureNode['data']));
      }
      if (prefs.nodeColor === 'jurisdiction') {
        return colorsFromJurisdiction(d);
      }

      if (prefs.nodeColor === 'purpose') {
        return colorsFromPurpose(d);
      }

      return 'black';
    });

  const text = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('text-anchor', 'middle')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', '3px')
    .classed('d-none', !prefs.viewStyles.includes('name'))
    .selectAll()
    .data(d3Nodes)
    .join('text')
    .text((d) => (d as StructureNodeJsonData).name ?? '')
    .attr('stroke', 'white')
    .attr('paint-order', 'stroke');

  // labels for structure tier
  const ordinalLabels = [
    ['Management', width / 4],
    ['Fund', width / 2],
    ['Holding', (width * 3) / 4],
    ['Stakeholders', width / 2],
  ];

  svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 20)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .classed('d-none', !prefs.layout.includes('tiers'))
    .selectAll()
    .data(ordinalLabels)
    .join('text')
    .text((d) => d[0])
    .attr('x', (d) => d[1])
    .attr('y', (d) => (String(d[0]) === 'Stakeholders' ? height - 40 : 40));

  function getLinkedNodeCoords(
    data: SimulationNodeDatum | string | number
  ): NodeCoords {
    let d3Node: SimulationNodeDatum;

    if (typeof data === 'string' || typeof data === 'number') {
      d3Node = d3NodesGrouped[data];
    } else {
      d3Node = data;
    }
    return { x: d3Node.x ?? 0, y: d3Node.y ?? 0 };
  }

  function getTargetNodeCircumferencePoint(
    data: SimulationLinkDatum<SimulationNodeDatum>
  ): NodeCoords {
    const tRadius = radius / 2; // nodeWidth is just a custom attribute I calculate during the creation of the nodes depending on the node width
    const target = getLinkedNodeCoords(data.target);
    const source = getLinkedNodeCoords(data.source);

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const gamma = Math.atan2(dy, dx); // Math.atan2 returns the angle in the correct quadrant as opposed to Math.atan
    const x = target.x - Math.cos(gamma) * tRadius;
    const y = target.y - Math.sin(gamma) * tRadius;

    return { x, y };
  }

  function ticked() {
    // coordinates of linked nodes taken from...
    // - link.d.source directly if linkForce is used
    // - d3NodesGrouped otherwise (internal link reference to source/target is unchanged)
    if (showLinks) {
      link
        .attr('x1', (d) => getLinkedNodeCoords(d.source).x)
        .attr('x2', (d) => getTargetNodeCircumferencePoint(d).x)
        .attr('y1', (d) => getLinkedNodeCoords(d.source).y)
        .attr('y2', (d) => getTargetNodeCircumferencePoint(d).y)
        .attr('marker-end', `url(#${linkArrowId})`);
    }

    node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    node.classed('node-fixed', (d) => (d as FixableNode).fixed);
    text.attr('x', (d) => d.x ?? null).attr('y', (d) => d.y ?? null);
  }

  const simulation = forceSimulation(d3Nodes)
    .force(
      'link',
      prefs.layout.includes('relationships')
        ? forceLink(d3Links)
            .id((d) => (d as StructureNode).id)
            .distance(radius * 3)
            .strength(0.1)
        : null
    )
    .force(
      'x',
      forceX()
        .strength(0.05)
        .x((d) =>
          prefs.layout.includes('tiers')
            ? xPosFromTiers(d as StructureNode['data'])
            : 0
        )
    )
    .force(
      'y',
      forceY()
        .strength(0.06)
        .y((d) =>
          prefs.layout.includes('tiers')
            ? yPosFromTiers(d as StructureNode['data'])
            : 0
        )
    )
    .force('collide', forceCollide().radius(radius))
    .force('charge', forceManyBody().strength(-200))
    .force('center', forceCenter(width / 2 - 100, height / 2))
    .on('tick', ticked);

  node
    .call(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      drag()
        .on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) simulation.alphaTarget(0);
          (event.subject as FixableNode).fixed = true;
          // event.subject.fx = null;
          // event.subject.fy = null;
        })
    )
    .on('click', (_, d) => {
      console.log(d);
      d.fx = null;
      d.fy = null;
      (d as FixableNode).fixed = false;
      // select(this).classed('fixed', false);
      simulation.alpha(1).restart();
    });

  select(window).on('resize', () => {
    const svgNode = svg.node();
    if (svgNode) {
      width = svgNode.getBoundingClientRect().width;
      height = svgNode.getBoundingClientRect().height;
    }
  });

  return svg.node();
}
