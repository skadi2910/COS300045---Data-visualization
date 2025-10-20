// Chart colors and configuration constants

export const SCREEN_TECH_COLORS = {
    'LCD': '#84cc16',
    'LCD (LED)': '#fb923c'  ,
    'LED': '#fb923c',
    'OLED': '#3b82f6',
    'QLED': '#bef264',
    'MicroLED': '#84cc16',
    'Plasma': '#fb923c',
    'CRT': '#f87171'
};

export const CHART_CONFIG = {
    margin: { top: 40, right: 40, bottom: 60, left: 60 },
    colors: {
        primary: '#000',
        secondary: '#fff',
        gridLines: '#e5e5e5',
        text: '#000'
    },
    fonts: {
        family: 'Courier New, monospace',
        size: {
            title: '14px',
            axis: '12px',
            label: '12px',
            legend: '12px'
        }
    },
    animation: {
        duration: 750,
        ease: 'easeInOutCubic'
    }
};

export const SORT_ORDER = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
    NONE: 'none'
};

// Histogram bin configuration
export const HISTOGRAM_CONFIG = {
    energyConsumption: {
        binWidth: 100, // bin width in kWh
        thresholds: d3.range(0, 3000, 100) // generates [0, 100, 200, ..., 2900]
    },
    screenSize: {
        binWidth: 10, // bin width in inches
        thresholds: d3.range(0, 100, 10)
    }
};