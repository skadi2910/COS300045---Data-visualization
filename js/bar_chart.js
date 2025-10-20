import { SCREEN_TECH_COLORS, BRAND_COLORS, CHART_CONFIG, SORT_ORDER } from './constants.js';

export class BarChart {
    constructor(containerId, data, options = {}) {
        this.containerId = containerId;
        this.rawData = data; // Store raw data for filtering
        this.data = data;
        this.options = {
            sortOrder: SORT_ORDER.NONE,
            width: options.width || 800,
            height: options.height || 600,
            valueKey: options.valueKey || 'value',
            labelKey: options.labelKey || 'label',
            xAxisLabel: options.xAxisLabel,
            yAxisLabel: options.yAxisLabel,
            filterKey: options.filterKey,
            filterValue: options.filterValue || 'All',
            ...options
        };
        console.log(`BarChart constructor for ${containerId}:`, this.options);
        this.svg = null;
        this.chart = null;
    }

    get filteredData() {
        if (!this.options.filterKey || !this.options.filterValue) {
            return this.data;
        }
        console.log(`Filtering by ${this.options.filterKey} = ${this.options.filterValue}`);
        const filtered = this.data.filter(d => d[this.options.filterKey] === this.options.filterValue);
        console.log(`Filtered data:`, filtered);
        return filtered;
    }

    sortData(order) {
        const dataToSort = this.filteredData;
        if (order === SORT_ORDER.ASCENDING) {
            return [...dataToSort].sort((a, b) => a[this.options.valueKey] - b[this.options.valueKey]);
        } else if (order === SORT_ORDER.DESCENDING) {
            return [...dataToSort].sort((a, b) => b[this.options.valueKey] - a[this.options.valueKey]);
        }
        return dataToSort;
    }

    draw() {
        const container = d3.select(`#${this.containerId}`);
        container.html(''); // Clear previous chart

        const sortedData = this.sortData(this.options.sortOrder);
        const displayData = this.filteredData;
        
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

        // Create scales
        const xScale = d3.scaleBand()
            .domain(sortedData.map(d => d[this.options.labelKey]))
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d[this.options.valueKey])])
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

        // Add bars
        this.chart.selectAll('.bar')
            .data(sortedData)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d[this.options.labelKey]))
            .attr('width', xScale.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', d => {
                // Check if we should use brand colors or screen tech colors
                const colorMap = BRAND_COLORS[d[this.options.labelKey]] ? BRAND_COLORS : SCREEN_TECH_COLORS;
                return colorMap[d[this.options.labelKey]] || '#666';
            })
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2)
            .transition()
            .duration(CHART_CONFIG.animation.duration)
            .attr('y', d => yScale(d[this.options.valueKey]))
            .attr('height', d => height - yScale(d[this.options.valueKey]));

        // Add value labels on bars
        this.chart.selectAll('.label')
            .data(sortedData)
            .join('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d[this.options.labelKey]) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d[this.options.valueKey]) - 5)
            .attr('text-anchor', 'middle')
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
            .attr('fill', d => {
                const colorMap = BRAND_COLORS[d[this.options.labelKey]] ? BRAND_COLORS : SCREEN_TECH_COLORS;
                return colorMap[d[this.options.labelKey]] || '#666';
            })
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.legend)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(d => `${d[this.options.labelKey]}: ${d[this.options.valueKey]}`);

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
            .text(this.options.xAxisLabel || 'Category');

        this.chart.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .attr('font-family', CHART_CONFIG.fonts.family)
            .attr('font-size', CHART_CONFIG.fonts.size.label)
            .attr('fill', CHART_CONFIG.colors.text)
            .text(this.options.yAxisLabel || 'Value');

        // Style axis lines
        this.svg.selectAll('.domain, .tick line')
            .attr('stroke', CHART_CONFIG.colors.primary)
            .attr('stroke-width', 2);
    }

    update(sortOrder) {
        this.options.sortOrder = sortOrder;
        this.draw();
    }

    updateFilter(filterValue) {
        this.options.filterValue = filterValue;
        this.draw();
    }
}