import { SCREEN_TECH_COLORS, CHART_CONFIG } from './constants.js';
import { addScatterplotTooltip } from './interaction.js';

export class Scatterplot {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.rawData = data;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            filterTech: options.filterTech || 'All',
            xKey: options.xKey || 'star',
            yKey: options.yKey || 'energyConsumption',
            colorKey: options.colorKey || 'screenTech',
            xAxisLabel: options.xAxisLabel || 'Star Rating',
            yAxisLabel: options.yAxisLabel || 'Energy Consumption (kWh/year)',
            ...options
        };
        this.svg = null;
        this.chart = null;
    }

    get filteredData() {
        if (this.options.filterTech === 'All') {
            return this.rawData;
        }
        return this.rawData.filter(d => d[this.options.colorKey] === this.options.filterTech);
    }

    draw() {
        const data = this.filteredData;
        const container = d3.select(`#${this.containerId}`);
        container.html(''); // Clear previous chart

        const margin = CHART_CONFIG.margin;
        const width = this.options.width - margin.left - margin.right;
        const height = this.options.height - margin.top - margin.bottom;

        // Create SVG
        this.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.options.width} ${this.options.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.chart = this.svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[this.options.xKey]) + 1])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[this.options.yKey])])
            .nice()
            .range([height, 0]);

        // Add grid lines
        this.chart.append('g')
            .attr('class', 'grid')
            .selectAll('line.vertical')
            .data(xScale.ticks())
            .join('line')
            .attr('class', 'vertical')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', CHART_CONFIG.colors.gridLines)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        this.chart.append('g')
            .attr('class', 'grid')
            .selectAll('line.horizontal')
            .data(yScale.ticks())
            .join('line')
            .attr('class', 'horizontal')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', CHART_CONFIG.colors.gridLines)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        // Draw points
        this.chart.selectAll('.dot')
            .data(data)
            .join('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d[this.options.xKey]))
            .attr('cy', d => yScale(d[this.options.yKey]))
            .attr('r', 0)
            .attr('fill', d => SCREEN_TECH_COLORS[d[this.options.colorKey]] || '#666')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 1)
            .attr('opacity', 0.7)
            .style('cursor', 'pointer')
            .transition()
            .duration(CHART_CONFIG.animation.duration)
            .attr('r', 5)
            .on('end', () => {
                // Add tooltips after transition completes
                const tooltipFormatter = (d) => {
                    return `
                        <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                            ${d.brand} ${d.model}
                        </div>
                        <div><strong>Screen:</strong> ${d.screenSize}" ${d.screenTech}</div>
                        <div><strong>Energy:</strong> ${d.energyConsumption} kWh/year</div>
                        <div><strong>Star Rating:</strong> ${d.star}</div>
                    `;
                };
                
                addScatterplotTooltip(this.svg, '.dot', tooltipFormatter);
            });

        // Add X axis
        this.chart.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.axis)
            .attr('fill', CHART_CONFIG.colors.text);

        // Add Y axis
        this.chart.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.axis)
            .attr('fill', CHART_CONFIG.colors.text);

        // Add axis labels
        this.chart.append('text')
            .attr('x', width / 2)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(this.options.xAxisLabel);

        this.chart.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(this.options.yAxisLabel);

        // Add legend
        const screenTechs = [...new Set(this.rawData.map(d => d[this.options.colorKey]))];
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.options.width - 150}, 40)`);

        const legendItems = legend.selectAll('.legend-item')
            .data(screenTechs)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legendItems.append('rect')
            .attr('width', 14)
            .attr('height', 14)
            .attr('fill', d => SCREEN_TECH_COLORS[d] || '#666')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.legend)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(d => d);

        // Style axis lines
        this.svg.selectAll('.domain, .tick line')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2);

        // Add tooltips to scatterplot points
        const tooltipFormatter = (d) => {
            return `
                <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                    ${d.brand} ${d.model}
                </div>
                <div><strong>Screen:</strong> ${d.screenSize}" ${d.screenTech}</div>
                <div><strong>Energy:</strong> ${d.energyConsumption} kWh/year</div>
                <div><strong>Star Rating:</strong> ${d.star}</div>
            `;
        };
        
        addScatterplotTooltip(this.svg, '.dot', tooltipFormatter);
    }

    updateFilter(filterTech) {
        this.options.filterTech = filterTech;
        this.draw();
    }
}