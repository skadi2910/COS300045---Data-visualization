// 4.3.2 Create svg object within the new div
const svg = d3
  .select("#d3-practice .responsive-svg-container")
  .append("svg")
  .attr("viewBox", "0 0 1200 1600")
  .style("border", "1px solid black");
// 4.4.1 Use row conversion function, d3.csv(), to give D3 access to data
const basePath = window.location.hostname === 'localhost' 
  ? '.' 
  : '/COS300045---Data-visualization';
console.log('Hostname:', window.location.hostname);
console.log('Full URL:', window.location.href);
d3.csv(`./data/tv_2025_brands.csv`, (d) => {
  // console.log(d);
  return {
    brand: d.Brand_Reg,
    count: +d["Unique count(Model_No)"],
  };
}).then(function (data) {
  // console.log(data.length);
  // console.log(d3.max(data, (d) => d.count));
  // console.log(d3.min(data, (d) => d.count));
  console.log(d3.extent(data, (d) => d.count)); //=> array with min and max

  // Sort descending
  data.sort((a, b) => d3.descending(a.count, b.count));
  console.log(data);
  // 4.5
  createBarChart(data);
});

// 4.5
const createBarChart = (data) => {
  // Chart dimensions and margins
  const margin = { top: 40, right: 40, bottom: 60, left: 100 };
  const width = 1200 - margin.left - margin.right;
  const height = 1600 - margin.top - margin.bottom;

  // Create a group for the chart with margins
  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // 4.6.1
  // Step 1: Linear scale for count data (x-axis)
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .range([0, width]);

  //4.6.2  
  // Step 2: Band scale for categorical data (y-axis)
  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, height])
    .padding(0.2);

  // Create bars and labels
  const barAndLabel = chartGroup
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScale(d.brand)})`);

  // Add bars
  barAndLabel
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", (d) => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // Add value labels on bars
  barAndLabel
    .append("text")
    .attr("x", (d) => xScale(d.count) + 5)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text((d) => d.count)
    .attr("font-size", "12px")
    .attr("fill", "black");

  // Add x-axis
  const xAxis = d3.axisBottom(xScale);
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Add y-axis
  const yAxis = d3.axisLeft(yScale);
  chartGroup.append("g").call(yAxis);

  // Add chart title
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("TV Brands by Model Count");

  // Add x-axis label
  chartGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Number of Models");
};