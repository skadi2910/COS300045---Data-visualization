import { dataLoader } from './data_loader.js';
import { SORT_ORDER } from './constants.js';

// Chart configurations
const chartConfigs = {
    chart1: {
        title: 'Available Screen Technology',
        csvFile: './data/tv_2025_available_screen_tech.csv',
        labelKey: 'Screen_Tech',
        valueKey: 'OCCURRENCE_COUNT',
        defaultType: 'pie',
        allowedTypes: ['bar', 'pie'],
        // Custom axis labels
        xAxisLabel: 'Screen Technology Type',
        yAxisLabel: 'Number of TVs'
    },
    chart2: {
        title: 'Energy Consumption by Screen Tech',
        csvFile: './data/tv_2025_energy_consumption_screen_tech.csv',
        labelKey: 'Screen_Tech',
        valueKey: 'Median(Labelled energy consumption (kWh/year))',
        defaultType: 'bar',
        allowedTypes: ['bar', 'horizontal-bar'],
        // Custom axis labels
        xAxisLabel: 'Screen Technology',
        yAxisLabel: 'Energy Consumption (kWh/year)'
    },
    chart3: {
        title: 'Energy Consumption Distribution & Analysis',
        csvFile: './data/Ex6_TVdata.csv',
        defaultType: 'histogram',
        allowedTypes: ['histogram', 'scatterplot'],
        typeConversions: {
            screenSize: d => +d,
            energyConsumption: d => +d,
            star: d => +d
        }
        // Axis labels are already set in histogram.js and scatterplot.js
    },
    chart4: {
        title: 'TV Energy Consumption by Brands',
        csvFile: './data/tv_2025_energy_consumption_brands.csv',
        labelKey: 'Brand_Reg',
        valueKey: 'Median(Labelled energy consumption (kWh/year))',
        defaultType: 'bar',
        allowedTypes: ['bar', 'horizontal-bar'],
        xAxisLabel: 'Brand',
        yAxisLabel: 'Median Energy Consumption (kWh/year)',
        // Additional data for filtering
        filterKey: 'screensize_group',
        defaultFilter: 'Small (<=45 inch)',
        filterOptions: ['Small (<=45 inch)', 'Medium (46-55 inch)', 'Large (56-70 inch)', 'XL (>70 inch)']
    },
    chart5: {
        title: 'Energy Consumption per Inch by Brands',
        csvFile: './data/tv_2025_energy_consumption_per_inch_brands_by_model_counts.csv',
        labelKey: 'Brand_Reg',
        valueKey: 'Median(energy_per_inch)',
        defaultType: 'bar',
        allowedTypes: ['bar', 'horizontal-bar'],
        xAxisLabel: 'Brand',
        yAxisLabel: 'Energy per Inch (kWh/year/inch)'
    }
};


// Track current state for each chart
const chartStates = {
    chart1: { type: 'bar', sortOrder: SORT_ORDER.NONE },
    chart2: { type: 'bar', sortOrder: SORT_ORDER.NONE },
    chart3: { type: 'histogram', sortOrder: SORT_ORDER.NONE },
    chart4: { type: 'bar', sortOrder: SORT_ORDER.NONE },
    chart5: { type: 'bar', sortOrder: SORT_ORDER.NONE }
};

/**
 * Add chart type toggle buttons to toolbar
 */
function addChartTypeToggles(chartId, toolbarId) {
    const toolbar = document.getElementById(toolbarId);
    const config = chartConfigs[chartId];
    if (!toolbar || !config) return;
    
    const chartTypeContainer = document.createElement('div');
    chartTypeContainer.style.display = 'flex';
    chartTypeContainer.style.gap = '5px';
    chartTypeContainer.style.marginLeft = '10px';
    chartTypeContainer.style.borderLeft = '2px solid var(--color-primary)';
    chartTypeContainer.style.paddingLeft = '10px';
    
    const allowedTypes = config.allowedTypes;
    
    // Bar chart button (vertical)
    if (allowedTypes.includes('bar')) {
        const barBtn = document.createElement('button');
        barBtn.className = 'tool-btn chart-type-btn active';
        barBtn.dataset.chartId = chartId;
        barBtn.dataset.type = 'bar';
        barBtn.textContent = '📊';
        barBtn.title = 'Vertical Bar Chart';
        barBtn.onclick = () => toggleChartType(chartId, 'bar');
        chartTypeContainer.appendChild(barBtn);
    }
    
    // Horizontal bar chart button
    if (allowedTypes.includes('horizontal-bar')) {
        const hBarBtn = document.createElement('button');
        hBarBtn.className = 'tool-btn chart-type-btn';
        hBarBtn.dataset.chartId = chartId;
        hBarBtn.dataset.type = 'horizontal-bar';
        hBarBtn.textContent = '📈';
        hBarBtn.title = 'Horizontal Bar Chart';
        hBarBtn.onclick = () => toggleChartType(chartId, 'horizontal-bar');
        chartTypeContainer.appendChild(hBarBtn);
    }
    
    // Pie chart button
    if (allowedTypes.includes('pie')) {
        const pieBtn = document.createElement('button');
        pieBtn.className = 'tool-btn chart-type-btn';
        pieBtn.dataset.chartId = chartId;
        pieBtn.dataset.type = 'pie';
        pieBtn.textContent = '🥧';
        pieBtn.title = 'Pie Chart';
        pieBtn.onclick = () => toggleChartType(chartId, 'pie');
        chartTypeContainer.appendChild(pieBtn);
    }
    
    // Histogram button
    if (allowedTypes.includes('histogram')) {
        const histBtn = document.createElement('button');
        histBtn.className = 'tool-btn chart-type-btn active';
        histBtn.dataset.chartId = chartId;
        histBtn.dataset.type = 'histogram';
        histBtn.textContent = '📊';
        histBtn.title = 'Histogram';
        histBtn.onclick = () => toggleChartType(chartId, 'histogram');
        chartTypeContainer.appendChild(histBtn);
    }
    
    // Scatterplot button
    if (allowedTypes.includes('scatterplot')) {
        const scatterBtn = document.createElement('button');
        scatterBtn.className = 'tool-btn chart-type-btn';
        scatterBtn.dataset.chartId = chartId;
        scatterBtn.dataset.type = 'scatterplot';
        scatterBtn.textContent = '⚫';
        scatterBtn.title = 'Scatterplot';
        scatterBtn.onclick = () => toggleChartType(chartId, 'scatterplot');
        chartTypeContainer.appendChild(scatterBtn);
    }
    
    toolbar.appendChild(chartTypeContainer);
}

/**
 * Add sort controls
 */
function addSortControls(chartId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const sortContainer = document.createElement('div');
    sortContainer.style.display = 'flex';
    sortContainer.style.gap = '5px';
    sortContainer.style.marginTop = '10px';
    sortContainer.style.alignItems = 'center';
    
    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Sort: ';
    sortLabel.style.fontSize = 'var(--font-size-xs)';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'chart-tabs';
    
    const noneBtn = document.createElement('button');
    noneBtn.className = 'tab-btn sort-btn active';
    noneBtn.dataset.chartId = chartId;
    noneBtn.dataset.sort = 'none';
    noneBtn.textContent = 'None';
    noneBtn.onclick = () => updateSortOrder(chartId, SORT_ORDER.NONE);
    
    const ascBtn = document.createElement('button');
    ascBtn.className = 'tab-btn sort-btn';
    ascBtn.dataset.chartId = chartId;
    ascBtn.dataset.sort = 'asc';
    ascBtn.textContent = 'Ascending';
    ascBtn.onclick = () => updateSortOrder(chartId, SORT_ORDER.ASCENDING);
    
    const descBtn = document.createElement('button');
    descBtn.className = 'tab-btn sort-btn';
    descBtn.dataset.chartId = chartId;
    descBtn.dataset.sort = 'desc';
    descBtn.textContent = 'Descending';
    descBtn.onclick = () => updateSortOrder(chartId, SORT_ORDER.DESCENDING);
    
    tabsContainer.appendChild(noneBtn);
    tabsContainer.appendChild(ascBtn);
    tabsContainer.appendChild(descBtn);
    
    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(tabsContainer);
    container.appendChild(sortContainer);
}

/**
 * Add filter controls for screen sizes (Chart 4)
 */
function addScreenSizeFilterControls(chartId, containerId, filterOptions, defaultFilter) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '5px';
    filterContainer.style.marginTop = '10px';
    filterContainer.style.alignItems = 'center';
    
    const filterLabel = document.createElement('span');
    filterLabel.textContent = 'Screen Size: ';
    filterLabel.style.fontSize = 'var(--font-size-xs)';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'chart-tabs';
    
    filterOptions.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn filter-btn' + (size === defaultFilter ? ' active' : '');
        btn.dataset.chartId = chartId;
        btn.dataset.filter = size;
        // Shorter labels for buttons
        const shortLabel = size.replace(' (<=45 inch)', '')
                              .replace(' (46-55 inch)', '')
                              .replace(' (56-70 inch)', '')
                              .replace(' (>70 inch)', '');
        btn.textContent = shortLabel;
        btn.onclick = () => updateFilter(chartId, size);
        tabsContainer.appendChild(btn);
    });
    
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(tabsContainer);
    container.appendChild(filterContainer);
}

/**
 * Add filter controls for histogram/scatterplot
 */
function addFilterControls(chartId, containerId, screenTechOptions) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '5px';
    filterContainer.style.marginTop = '10px';
    filterContainer.style.alignItems = 'center';
    
    const filterLabel = document.createElement('span');
    filterLabel.textContent = 'Filter: ';
    filterLabel.style.fontSize = 'var(--font-size-xs)';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'chart-tabs';
    
    const allBtn = document.createElement('button');
    allBtn.className = 'tab-btn filter-btn active';
    allBtn.dataset.chartId = chartId;
    allBtn.dataset.filter = 'All';
    allBtn.textContent = 'All';
    allBtn.onclick = () => updateFilter(chartId, 'All');
    tabsContainer.appendChild(allBtn);
    
    screenTechOptions.forEach(tech => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn filter-btn';
        btn.dataset.chartId = chartId;
        btn.dataset.filter = tech;
        btn.textContent = tech;
        btn.onclick = () => updateFilter(chartId, tech);
        tabsContainer.appendChild(btn);
    });
    
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(tabsContainer);
    container.appendChild(filterContainer);
}

/**
 * Add bin width controls for histogram
 */
function addBinControls(chartId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const binContainer = document.createElement('div');
    binContainer.style.display = 'flex';
    binContainer.style.gap = '5px';
    binContainer.style.marginTop = '10px';
    binContainer.style.alignItems = 'center';
    binContainer.id = `bin-container-${chartId}`;
    
    const binLabel = document.createElement('span');
    binLabel.textContent = 'Bin Width: ';
    binLabel.style.fontSize = 'var(--font-size-xs)';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'chart-tabs';
    
    const binWidths = [50, 100, 200];
    binWidths.forEach((width, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn bin-btn' + (index === 1 ? ' active' : '');
        btn.dataset.chartId = chartId;
        btn.dataset.binWidth = width;
        btn.textContent = `${width} kWh`;
        btn.onclick = () => updateBinWidth(chartId, width);
        tabsContainer.appendChild(btn);
    });
    
    binContainer.appendChild(binLabel);
    binContainer.appendChild(tabsContainer);
    container.appendChild(binContainer);
}

/**
 * Toggle between chart types
 */
function toggleChartType(chartId, chartType) {
    if (chartType === chartStates[chartId].type) return;
    
    chartStates[chartId].type = chartType;
    
    const currentChart = dataLoader.getChart(chartId);
    if (currentChart) {
        const data = currentChart.rawData || currentChart.data;
        const filterTech = currentChart.options?.filterTech || 'All';
        
        dataLoader.createChart(chartId, data, chartType, { filterTech });
        
        // Show/hide bin controls
        const binContainer = document.getElementById(`bin-container-${chartId}`);
        if (binContainer) {
            binContainer.style.display = chartType === 'histogram' ? 'flex' : 'none';
        }
    } else {
        dataLoader.switchChartType(chartId, chartType);
    }
    
    // Update button states
    document.querySelectorAll(`.chart-type-btn[data-chart-id="${chartId}"]`).forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === chartType) {
            btn.classList.add('active');
        }
    });
}

/**
 * Update sort order
 */
function updateSortOrder(chartId, sortOrder) {
    chartStates[chartId].sortOrder = sortOrder;
    dataLoader.updateSort(chartId, sortOrder);
    
    document.querySelectorAll(`.sort-btn[data-chart-id="${chartId}"]`).forEach(btn => {
        btn.classList.remove('active');
        const btnSortOrder = btn.dataset.sort === 'asc' ? SORT_ORDER.ASCENDING :
                           btn.dataset.sort === 'desc' ? SORT_ORDER.DESCENDING :
                           SORT_ORDER.NONE;
        if (btnSortOrder === sortOrder) {
            btn.classList.add('active');
        }
    });
}

/**
 * Update filter
 */
function updateFilter(chartId, filterTech) {
    const chart = dataLoader.getChart(chartId);
    if (chart && chart.updateFilter) {
        chart.updateFilter(filterTech);
        
        document.querySelectorAll(`.filter-btn[data-chart-id="${chartId}"]`).forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterTech) {
                btn.classList.add('active');
            }
        });
    }
}

/**
 * Update bin width
 */
function updateBinWidth(chartId, binWidth) {
    const chart = dataLoader.getChart(chartId);
    if (chart && chart.updateBinWidth) {
        chart.updateBinWidth(binWidth);
        
        document.querySelectorAll(`.bin-btn[data-chart-id="${chartId}"]`).forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.binWidth) === binWidth) {
                btn.classList.add('active');
            }
        });
    }
}

/**
 * Initialize a single chart
 */
async function initChart(chartId) {
    const config = chartConfigs[chartId];
    
    if (!config.csvFile) {
        console.log(`${chartId}: No data file configured (placeholder)`);
        return;
    }
    
    try {
        if (config.defaultType === 'histogram' || config.defaultType === 'scatterplot') {
            // For histogram/scatterplot, load raw data with type conversions
            const data = await dataLoader.initChartFromCSV(
                chartId,
                config.csvFile,
                null,
                null,
                config.defaultType,
                config.typeConversions || {},
                {}
            );
            
            // Add filter and bin controls
            const chart = dataLoader.getChart(chartId);
            if (chart && chart.rawData) {
                const screenTechs = [...new Set(chart.rawData.map(d => d.screenTech))];
                addFilterControls(chartId, `filter-controls-${chartId}`, screenTechs);
                
                if (config.defaultType === 'histogram') {
                    addBinControls(chartId, `bin-controls-${chartId}`);
                }
            }
        } else if (config.filterKey) {
            // For charts with filtering (like chart4), load raw data
            const rawData = await dataLoader.loadCSV(config.csvFile, config.typeConversions || {});
            const transformedData = rawData.map(row => ({
                label: row[config.labelKey],
                value: parseFloat(row[config.valueKey]) || 0,
                [config.filterKey]: row[config.filterKey] // Preserve filter field
            }));
            
            console.log(`Chart4 transformed data:`, transformedData);
            
            dataLoader.createChart(chartId, transformedData, config.defaultType, {
                xAxisLabel: config.xAxisLabel,
                yAxisLabel: config.yAxisLabel,
                filterKey: config.filterKey,
                filterValue: config.defaultFilter,
                labelKey: 'label',
                valueKey: 'value'
            });
            
            // Add filter controls for screen sizes
            if (config.filterOptions) {
                addScreenSizeFilterControls(chartId, `filter-controls-${chartId}`, config.filterOptions, config.defaultFilter);
            }
        } else {
            // For bar/pie charts, load and transform data
            console.log(`Initializing ${chartId} with labels:`, {
                xAxisLabel: config.xAxisLabel,
                yAxisLabel: config.yAxisLabel
            });
            
            await dataLoader.initChartFromCSV(
                chartId,
                config.csvFile,
                config.labelKey,
                config.valueKey,
                config.defaultType,
                {},
                {
                    xAxisLabel: config.xAxisLabel,
                    yAxisLabel: config.yAxisLabel
                }
            );
        }
        
        console.log(`${chartId}: Initialized successfully`);
    } catch (error) {
        console.error(`${chartId}: Error initializing`, error);
    }
}

/**
 * Initialize all charts
 */
async function initDashboard() {
    Object.keys(chartConfigs).forEach(chartId => {
        const toolbarId = `toolbar-${chartId}`;
        const sortControlsId = `sort-controls-${chartId}`;
        
        addChartTypeToggles(chartId, toolbarId);
        
        const config = chartConfigs[chartId];
        if (config.defaultType !== 'histogram' && config.defaultType !== 'scatterplot') {
            addSortControls(chartId, sortControlsId);
        }
    });
    
    for (const chartId of Object.keys(chartConfigs)) {
        await initChart(chartId);
    }
}

/**
 * File upload handler
 */
document.querySelector('.btn').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
            document.querySelector('.file-name').textContent = file.name;
        }
    };
    input.click();
});

/**
 * Initialize dashboard when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

export { toggleChartType, updateSortOrder, updateFilter, updateBinWidth, initChart };