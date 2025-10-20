import { SCREEN_TECH_COLORS, CHART_CONFIG, HISTOGRAM_CONFIG } from './constants.js';

export class Histogram {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.rawData = data;
        this.options = {
            width: options.width || 800,
            height: options.height || 600,
            filterTech: options.filterTech || 'All',
            binThresholds: options.binThresholds || HISTOGRAM_CONFIG.energyConsumption.thresholds,
            xKey: options.xKey || 'energyConsumption',
            filterKey: options.filterKey || 'screenTech',
            xAxisLabel: options.xAxisLabel || 'Energy Consumption (kWh/year)',
            yAxisLabel: options.yAxisLabel || 'Frequency',
            ...options
        };
        this.svg = null;
        this.chart = null;
    }

    get filteredData() {
        if (this.options.filterTech === 'All') {
            return this.rawData;
        }
        return this.rawData.filter(d => d[this.options.filterKey] === this.options.filterTech);
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

        // Create bins
        const histogram = d3.bin()
            .value(d => d[this.options.xKey])
            .thresholds(this.options.binThresholds);

        const bins = histogram(data);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(this.options.binThresholds)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)])
            .nice()
            .range([height, 0]);

        // Add grid lines
        this.chart.append('g')
            .attr('class', 'grid')
            .selectAll('line')
            .data(yScale.ticks())
            .join('line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', CHART_CONFIG.colors.gridLines)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        // Draw bars
        this.chart.selectAll('.bar')
            .data(bins)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.x0))
            .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', '#666')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2)
            .transition()
            .duration(CHART_CONFIG.animation.duration)
            .attr('y', d => yScale(d.length))
            .attr('height', d => height - yScale(d.length));

        // Add value labels on bars
        this.chart.selectAll('.label')
            .data(bins.filter(d => d.length > 0))
            .join('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
            .attr('y', d => yScale(d.length) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(d => d.length);

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

        // Style axis lines
        this.svg.selectAll('.domain, .tick line')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2);
    }

    updateFilter(filterTech) {
        this.options.filterTech = filterTech;
        this.draw();
    }

    updateBinWidth(binWidth) {
        const maxValue = d3.max(this.rawData, d => d[this.options.xKey]);
        this.options.binThresholds = d3.range(0, maxValue + binWidth, binWidth);
        this.draw();
    }
}