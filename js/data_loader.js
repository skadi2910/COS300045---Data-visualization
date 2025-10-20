import { BarChart } from './bar_chart.js';
import { HorizontalBarChart } from './horizontal_bar_chart.js';
import { PieChart } from './pie_chart.js';
import { Histogram } from './histogram.js';
import { Scatterplot } from './scatterplot.js';
import { SORT_ORDER } from './constants.js';


export class DataLoader {
    constructor() {
        this.charts = {};
        this.currentChartType = 'bar';
        this.currentSortOrder = SORT_ORDER.NONE;
    }

    /**
     * Load CSV data and parse it with type conversion
     * @param {string} filePath - Path to CSV file
     * @param {Object} typeConversions - Optional type conversion functions
     * @returns {Promise<Array>} Parsed data
     */
    async loadCSV(filePath, typeConversions = {}) {
        try {
            const data = await d3.csv(filePath, (d) => {
                const converted = { ...d };
                
                // Apply type conversions
                for (const [key, conversionFn] of Object.entries(typeConversions)) {
                    if (d[key] !== undefined && d[key] !== null && d[key] !== '') {
                        converted[key] = conversionFn(d[key]);
                    }
                }
                
                return converted;
            });
            return data;
        } catch (error) {
            console.error('Error loading CSV:', error);
            throw error;
        }
    }

    /**
     * Transform CSV data for charting
     * @param {Array} rawData - Raw CSV data
     * @param {string} labelKey - Key for labels
     * @param {string} valueKey - Key for values
     * @returns {Array} Transformed data
     */
    transformData(rawData, labelKey, valueKey) {
        return rawData.map(row => ({
            label: row[labelKey],
            value: parseFloat(row[valueKey]) || 0
        }));
    }

    /**
     * Create and draw a chart
     * @param {string} containerId - DOM element ID
     * @param {Array} data - Chart data
     * @param {string} chartType - 'bar', 'horizontal-bar', 'pie', 'donut', 'histogram', or 'scatterplot'
     * @param {Object} options - Additional chart options
     */
    createChart(containerId, data, chartType = 'bar', options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        console.log(`Creating ${chartType} chart in ${containerId} with ${data.length} data points`);
        console.log(`Options received:`, options);

        // Get container dimensions
        const rect = container.getBoundingClientRect();
        const defaultOptions = {
            width: rect.width || 800,
            height: rect.height || 600,
            sortOrder: this.currentSortOrder,
            // Merge all custom options including axis labels
            ...options
        };

        console.log(`Final options being passed to chart:`, defaultOptions);
        console.log(`Container dimensions: ${defaultOptions.width}x${defaultOptions.height}`);

        // Create appropriate chart
        if (chartType === 'bar') {
            this.charts[containerId] = new BarChart(containerId, data, defaultOptions);
        } else if (chartType === 'horizontal-bar') {
            this.charts[containerId] = new HorizontalBarChart(containerId, data, defaultOptions);
        } else if (chartType === 'pie' || chartType === 'donut') {
            const pieOptions = {
                ...defaultOptions,
                innerRadius: chartType === 'donut' ? 80 : 0
            };
            this.charts[containerId] = new PieChart(containerId, data, pieOptions);
        } else if (chartType === 'histogram') {
            this.charts[containerId] = new Histogram(containerId, data, defaultOptions);
        } else if (chartType === 'scatterplot') {
            this.charts[containerId] = new Scatterplot(containerId, data, defaultOptions);
        }

        if (this.charts[containerId]) {
            console.log(`Drawing ${chartType} chart in ${containerId}`);
            this.charts[containerId].draw();
            this.currentChartType = chartType;
        } else {
            console.error(`Failed to create chart instance for ${containerId}`);
        }
    }

    /**
     * Update chart with new sort order
     * @param {string} containerId - DOM element ID
     * @param {string} sortOrder - Sort order from SORT_ORDER enum
     */
    updateSort(containerId, sortOrder) {
        if (this.charts[containerId]) {
            this.currentSortOrder = sortOrder;
            this.charts[containerId].update(sortOrder);
        }
    }

    /**
     * Switch between chart types
     * @param {string} containerId - DOM element ID
     * @param {string} newChartType - New chart type
     */
    switchChartType(containerId, newChartType) {
        const currentChart = this.charts[containerId];
        if (!currentChart) {
            console.error(`No chart found for ${containerId}`);
            return;
        }

        const data = currentChart.rawData || currentChart.data;
        const options = currentChart.options;
        
        this.createChart(containerId, data, newChartType, options);
    }

    /**
     * Initialize chart from CSV file
     * @param {string} containerId - DOM element ID
     * @param {string} filePath - Path to CSV file
     * @param {string} labelKey - Column name for labels (not used for histogram/scatterplot)
     * @param {string} valueKey - Column name for values (not used for histogram/scatterplot)
     * @param {string} chartType - Chart type
     * @param {Object} typeConversions - Type conversion functions for columns
     * @param {Object} options - Additional options
     */
    async initChartFromCSV(containerId, filePath, labelKey, valueKey, chartType = 'bar', typeConversions = {}, options = {}) {
        try {
            console.log(`Loading data for ${containerId} from ${filePath}`);
            const rawData = await this.loadCSV(filePath, typeConversions);
            console.log(`Loaded ${rawData.length} rows for ${containerId}`);
            
            // For histogram and scatterplot, use raw data directly
            if (chartType === 'histogram' || chartType === 'scatterplot') {
                console.log(`Creating ${chartType} for ${containerId}`);
                this.createChart(containerId, rawData, chartType, options);
                return rawData;
            }
            
            // For other charts, transform data
            console.log(`Transforming data for ${containerId}: ${labelKey} -> ${valueKey}`);
            const transformedData = this.transformData(rawData, labelKey, valueKey);
            console.log(`Creating ${chartType} for ${containerId} with ${transformedData.length} items`);
            console.log(`Passing options:`, options);
            this.createChart(containerId, transformedData, chartType, options);
            return transformedData;
        } catch (error) {
            console.error(`Error initializing chart ${containerId}:`, error);
            throw error;
        }
    }

    /**
     * Get chart instance
     * @param {string} containerId - DOM element ID
     * @returns {Object} Chart instance
     */
    getChart(containerId) {
        return this.charts[containerId];
    }

    /**
     * Remove chart
     * @param {string} containerId - DOM element ID
     */
    removeChart(containerId) {
        if (this.charts[containerId]) {
            delete this.charts[containerId];
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
        }
    }
}

// Create global instance
export const dataLoader = new DataLoader();