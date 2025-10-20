import { CHART_CONFIG } from './constants.js';

/**
 * Tooltip class for chart interactions
 */
export class Tooltip {
    constructor() {
        this.tooltip = null;
        this.create();
    }

    /**
     * Create tooltip element
     */
    create() {
        // Remove existing tooltip if any
        d3.select('#chart-tooltip').remove();

        // Create tooltip div
        this.tooltip = d3.select('body')
            .append('div')
            .attr('id', 'chart-tooltip')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background', '#fff')
            .style('border', '2px solid #000')
            .style('border-radius', '0')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('font-family', CHART_CONFIG.fonts.family)
            .style('font-size', '12px')
            .style('z-index', 1000)
            .style('box-shadow', '4px 4px 0px #000')
            .style('max-width', '200px');
    }

    /**
     * Show tooltip with content
     * @param {Object} data - Data point
     * @param {Object} event - Mouse event
     * @param {Function} formatter - Optional formatter function
     */
    show(data, event, formatter = null) {
        const content = formatter ? formatter(data) : this.defaultFormatter(data);
        
        this.tooltip
            .html(content)
            .style('opacity', 1)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    }

    /**
     * Hide tooltip
     */
    hide() {
        this.tooltip
            .style('opacity', 0);
    }

    /**
     * Default formatter for tooltip content
     * @param {Object} data - Data point
     * @returns {string} HTML content
     */
    defaultFormatter(data) {
        let html = '<div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">';
        
        // Add all properties
        for (const [key, value] of Object.entries(data)) {
            if (key !== 'x0' && key !== 'x1' && key !== 'length') {
                html += `<div style="margin: 3px 0;"><strong>${key}:</strong> ${value}</div>`;
            }
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Update tooltip position
     * @param {Object} event - Mouse event
     */
    updatePosition(event) {
        this.tooltip
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    }
}

/**
 * Add tooltip interaction to scatter plot points
 * @param {Object} svg - D3 selection of SVG element
 * @param {string} selector - CSS selector for elements
 * @param {Function} formatter - Custom formatter function
 */
export function addScatterplotTooltip(svg, selector = '.dot', formatter = null) {
    const tooltip = new Tooltip();

    svg.selectAll(selector)
        .on('mouseover', function(event, d) {
            // Highlight the point
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 8)
                .attr('stroke-width', 3);
            
            // Show tooltip
            tooltip.show(d, event, formatter);
        })
        .on('mousemove', function(event) {
            tooltip.updatePosition(event);
        })
        .on('mouseout', function() {
            // Reset point size
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 5)
                .attr('stroke-width', 1);
            
            // Hide tooltip
            tooltip.hide();
        });
}

/**
 * Add tooltip interaction to bar chart bars
 * @param {Object} svg - D3 selection of SVG element
 * @param {string} selector - CSS selector for elements
 * @param {Function} formatter - Custom formatter function
 */
export function addBarChartTooltip(svg, selector = '.bar', formatter = null) {
    const tooltip = new Tooltip();

    svg.selectAll(selector)
        .on('mouseover', function(event, d) {
            // Highlight the bar
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0.7);
            
            // Show tooltip
            tooltip.show(d, event, formatter);
        })
        .on('mousemove', function(event) {
            tooltip.updatePosition(event);
        })
        .on('mouseout', function() {
            // Reset bar opacity
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 1);
            
            // Hide tooltip
            tooltip.hide();
        });
}

/**
 * Add tooltip interaction to histogram bars
 * @param {Object} svg - D3 selection of SVG element
 * @param {string} selector - CSS selector for elements
 * @param {Function} formatter - Custom formatter function
 */
export function addHistogramTooltip(svg, selector = '.bar', formatter = null) {
    const tooltip = new Tooltip();

    svg.selectAll(selector)
        .on('mouseover', function(event, d) {
            // Highlight the bar
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0.7);
            
            // Show tooltip
            const defaultFormatter = (data) => {
                return `
                    <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                        Bin Range
                    </div>
                    <div><strong>From:</strong> ${data.x0.toFixed(0)} kWh</div>
                    <div><strong>To:</strong> ${data.x1.toFixed(0)} kWh</div>
                    <div style="margin-top: 5px; padding-top: 5px; border-top: 1px solid #000;">
                        <strong>Count:</strong> ${data.length}
                    </div>
                `;
            };
            
            tooltip.show(d, event, formatter || defaultFormatter);
        })
        .on('mousemove', function(event) {
            tooltip.updatePosition(event);
        })
        .on('mouseout', function() {
            // Reset bar opacity
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 1);
            
            // Hide tooltip
            tooltip.hide();
        });
}

/**
 * Add tooltip interaction to pie chart slices
 * @param {Object} svg - D3 selection of SVG element
 * @param {string} selector - CSS selector for elements
 * @param {Function} formatter - Custom formatter function
 */
export function addPieChartTooltip(svg, selector = 'path', formatter = null) {
    const tooltip = new Tooltip();

    svg.selectAll(selector)
        .on('mouseover', function(event, d) {
            // Highlight the slice
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 0.7);
            
            // Show tooltip
            const defaultFormatter = (data) => {
                const total = data.data.value; // Assuming the data structure
                return `
                    <div style="font-weight: bold; margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                        ${data.data.label}
                    </div>
                    <div><strong>Value:</strong> ${data.data.value.toLocaleString()}</div>
                `;
            };
            
            tooltip.show(d, event, formatter || defaultFormatter);
        })
        .on('mousemove', function(event) {
            tooltip.updatePosition(event);
        })
        .on('mouseout', function() {
            // Reset slice opacity
            d3.select(this)
                .transition()
                .duration(200)
                .style('opacity', 1);
            
            // Hide tooltip
            tooltip.hide();
        });
}

// Export singleton instance
export const chartTooltip = new Tooltip();