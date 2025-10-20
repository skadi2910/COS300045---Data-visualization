import { SCREEN_TECH_COLORS, CHART_CONFIG, SORT_ORDER } from './constants.js';

export class PieChart {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.data = data;
        this.options = {
            sortOrder: SORT_ORDER.NONE,
            width: options.width || 800,
            height: options.height || 600,
            valueKey: options.valueKey || 'value',
            labelKey: options.labelKey || 'label',
            innerRadius: options.innerRadius || 0, // 0 for pie, > 0 for donut
            ...options
        };
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
        
        const width = this.options.width;
        const height = this.options.height;
        const radius = Math.min(width, height) / 2 - 60;

        // Create SVG
        this.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.chart = this.svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Create pie generator
        const pie = d3.pie()
            .value(d => d[this.options.valueKey])
            .sort(null);

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(this.options.innerRadius)
            .outerRadius(radius);

        // Create arc for labels (outside the pie)
        const labelArc = d3.arc()
            .innerRadius(radius + 20)
            .outerRadius(radius + 20);

        // Draw pie slices
        const slices = this.chart.selectAll('.slice')
            .data(pie(sortedData))
            .join('g')
            .attr('class', 'slice');

        slices.append('path')
            .attr('d', arc)
            .attr('fill', d => SCREEN_TECH_COLORS[d.data[this.options.labelKey]] || '#ccc')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2)
            .style('opacity', 0)
            .transition()
            .duration(CHART_CONFIG.animation.duration)
            .style('opacity', 1)
            .attrTween('d', function(d) {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        // Add percentage labels
        slices.append('text')
            .attr('transform', d => {
                const pos = arc.centroid(d);
                return `translate(${pos})`;
            })
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .attr('font-weight', 'bold')
            .style('opacity', 0)
            .transition()
            .delay(CHART_CONFIG.animation.duration)
            .duration(300)
            .style('opacity', 1)
            .textTween(function(d) {
                const total = d3.sum(sortedData, item => item[this.options.valueKey]);
                const percentage = ((d.data[this.options.valueKey] / total) * 100).toFixed(1);
                return function() {
                    return `${percentage}%`;
                };
            }.bind(this));

        // Add legend with both label and value
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 150}, 40)`);

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
            .text(d => `${d[this.options.labelKey]}: ${d[this.options.valueKey].toLocaleString()}`);
    }

    update(sortOrder) {
        this.options.sortOrder = sortOrder;
        this.draw();
    }
}