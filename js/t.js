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
        csvFile: 'tv_2025_energy_per_inch_by_brands.csv',
        labelKey: 'Brand_Reg',
        valueKey: 'Median(energy_per_inch)',
        defaultType: 'bar',
        allowedTypes: ['bar', 'horizontal-bar'],
        xAxisLabel: 'Brand',
        yAxisLabel: 'Energy per Inch (kWh/year/inch)'
    }
};
