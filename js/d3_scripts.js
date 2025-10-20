// 4.2.2 Apply style to html element using D3
d3.select("#svg-practice-2 h1").style("color", "red");
// 4.2.3 Append an element using D3
d3.select("#svg-practice-2 div")
  .append("p")
  .text(
    "Purchasing a low energy consumption TV will help with your energy bills!"
  );
// 4.2.4 Append a svg using D3
d3.select("#svg-practice-2 div svg")
  .append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 100)
  .attr("height", 30)
  .style("fill", "green");



