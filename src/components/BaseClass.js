import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'
import { line } from 'd3-shape'
import { schemeTableau10 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3-scale';
import { drag } from 'd3-drag';

export default class Chart {
    constructor({data, width, height, selector, type, dimensions, target, dynamic}) {

        this.data = data;
        this.width = width;
        this.height = height;
        this.selector = selector;
        this.type = type;
        this.dimensions = dimensions;
        this.target = target;
        this.dynamic = dynamic;

        //Store the interal structure of the chart
        this.axis = null;
        this.items = null;

        this.initElements()
        if (this.target!==null)
            this.createLegend()
    }

    draw(){
    }

    initElements(){

        const margin = {top: 30, right: 10, bottom: 10, left: 10};
        this.width = this.width - margin.left - margin.right;
        this.height = this.height - margin.top - margin.bottom;

        const markerBoxWidth = 10,
            markerBoxHeight = 10,
            refX = markerBoxWidth / 2,
            refY = markerBoxHeight / 2,
            arrowPoints = [[0, 0], [0, 10], [10, 5]];

        this.svg = select(this.selector).append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .call(zoom().on("start zoom end", event => {
                this.svg.attr("transform", event.transform)
            }))
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        this.svg
            .append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
            .attr('refX', refX)
            .attr('refY', refY)
            .attr('markerWidth', markerBoxWidth)
            .attr('markerHeight', markerBoxHeight)
            .attr('orient', 'auto-start-reverse')
            .append('path')
            .attr('d', line()(arrowPoints))
            .attr('stroke', 'black');
    
        this.values_target = [... new Set(this.data.map(d => d[this.target]))]

        if (this.target==null)
        this.colorScale = scaleOrdinal()
            .domain(this.values_target).range(["black"])
        else
            this.colorScale = scaleOrdinal(schemeTableau10)
            .domain(this.values_target)
    
    }

    createLegend(){
        
        const size = 10


        const fdrag = drag().on("drag", (event) => {
            container.attr("transform",`translate(${event.x}, ${event.y})`)
        })
        

        const container = this.svg.append("g")
            .attr("class", "legend")
            .style("position","absolute")
            .attr("transform",`translate(${10}, ${30})`)
            .style("left", 10)
            .style("top", 10)
            .call(fdrag)    

        container.selectAll("mydots")
            .data(this.values_target)
            .enter()
            .append("rect")
                .attr("x", 100)
                .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => this.colorScale(d))

        // Add one dot in the legend for each name.
        container.selectAll("mylabels")
            .data(this.values_target)
            .enter()
            .append("text")
                .attr("x", 100 + size*1.2)
                .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", d => this.colorScale(d))
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
    }

    initBrush(scale){

        const selections = new Map();
    
        this.brushed = (event, key) => {
        
            event.sourceEvent.stopPropagation()

            let selection = event.selection

            if (selection === null) selections.delete(key);
            else selections.set(key, selection.map(l => scale[key].invert(l)))

            this.items.each(function(d) {
                const active = Array.from(selections).every(([key, [min, max]]) => d[key] >= min && d[key] <= max);
                select(this).style("display", active ? null : "none");
            
            })
        }
    }

    setOpacity(value){
        this.items.attr("opacity", value)
    }

    getAxis(){
        return this.axis
    }

    getItems(){
        return this.items
    }

    colorize(value){
        if (value)
            this.items.style("stroke", d => this.colorScale(d[this.target]))
        else
            this.items.style("stroke", "black")

        select(".legend").style("display", value?null:"none")
    }
};
