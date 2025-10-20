import { SCREEN_TECH_COLORS, CHART_CONFIG, SORT_ORDER } from './constants.js';

export class HorizontalBarChart {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.data = data;
        this.options = {
            sortOrder: SORT_ORDER.NONE,
            width: options.width || 800,
            height: options.height || 600,
            valueKey: options.valueKey || 'value',
            labelKey: options.labelKey || 'label',
            xAxisLabel: options.xAxisLabel,
            yAxisLabel: options.yAxisLabel,
            ...options
        };
        console.log(`HorizontalBarChart constructor for ${containerId}:`, this.options);
        this.svg = null;
        this.chart = null;
    }

    sortData(order) {
        if (order === SORT_ORDER.ASCENDING) {
            return [...this.data].sort((a, b) => a[this.options.valueKey] - b[this.options.valueKey]);
        } else if (order === SORT_ORDER.DESCENDING) {
            return [...this.data].sort((a, b) => b[this.options.valueKey] - a[this.options.valueKey]);
        }
        return this.data;
    }

    draw() {
        const container = d3.select(`#${this.containerId}`);
        container.html(''); // Clear previous chart

        const sortedData = this.sortData(this.options.sortOrder);
        
        const margin = CHART_CONFIG.margin;
        const width = this.options.width - margin.left - margin.right;
        const height = this.options.height - margin.bottom - margin.top;

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

        // Create scales (swapped for horizontal)
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d[this.options.valueKey])])
            .nice()
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(sortedData.map(d => d[this.options.labelKey]))
            .range([0, height])
            .padding(0.2);

        // Add grid lines
        this.chart.append('g')
            .attr('class', 'grid')
            .selectAll('line')
            .data(xScale.ticks())
            .join('line')
            .attr('x1', d => xScale(d))
            .attr('x2', d => xScale(d))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', CHART_CONFIG.colors.gridLines)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        // Add bars
        this.chart.selectAll('.bar')
            .data(sortedData)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => yScale(d[this.options.labelKey]))
            .attr('height', yScale.bandwidth())
            .attr('width', 0)
            .attr('fill', d => SCREEN_TECH_COLORS[d[this.options.labelKey]] || '#ccc')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2)
            .transition()
            .duration(CHART_CONFIG.animation.duration)
            .attr('width', d => xScale(d[this.options.valueKey]));

        // Add value labels on bars
        this.chart.selectAll('.label')
            .data(sortedData)
            .join('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d[this.options.valueKey]) + 10)
            .attr('y', d => yScale(d[this.options.labelKey]) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(d => d[this.options.valueKey].toLocaleString());

        // Add legend
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.options.width - 150}, 40)`);

        const legendItems = legend.selectAll('.legend-item')
            .data(sortedData)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legendItems.append('rect')
            .attr('width', 14)
            .attr('height', 14)
            .attr('fill', d => SCREEN_TECH_COLORS[d[this.options.labelKey]] || '#ccc')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.legend)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(d => `${d[this.options.labelKey]}: ${d[this.options.valueKey]}`);

        // Add X axis (bottom)
        this.chart.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.axis)
            .attr('fill', CHART_CONFIG.colors.text);

        // Add Y axis (left)
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
            .text(this.options.xAxisLabel || 'Value');

        this.chart.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(this.options.yAxisLabel || 'Category');

        // Style axis lines
        this.svg.selectAll('.domain, .tick line')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2);
    }

    update(sortOrder) {
        this.options.sortOrder = sortOrder;
        this.draw();
    }
}