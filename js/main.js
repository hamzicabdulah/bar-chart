function draw(dataset) {
  const width = 1000, height = 580, margin = 50;

  d3.select('body')
    .append('h1')
    .text('Gross Domestic Product');

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const data = dataset.data;

  const xExtent = d3.extent(data, (d) => d[0]);

  const xScale = d3.scaleTime()
    .domain([new Date(xExtent[0]), new Date(xExtent[1])])
    .range([margin, width-(margin/2)]);

  const xAxis = d3.axisBottom(xScale);

  svg.append('g')
    .attr('transform', 'translate(' + 0 + ', ' + (height-margin) + ')')
    .call(xAxis);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height-margin, margin]);

  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('transform', 'translate('+ margin + ', 0)')
    .call(yAxis);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return '<h3>$' + d[1].toFixed(2) + ' Billion </h3><p>' + new Date(d[0]).getFullYear() + ' — ' + months[new Date(d[0]).getMonth()] + '</p>';
    });
  svg.call(tip);

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(new Date(d[0])))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', width/data.length)
    .attr('height', (d) => height - yScale(d[1]) - margin)
    .attr('fill', '#990000')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  svg.append('text')
    .text('Gross Domestic Product, USA')
    .attr('x', -(height/2 + margin*2))
    .attr('y', 70)
    .attr('transform', 'rotate(-90)');

  d3.select('body')
    .append('p')
    .attr('class', 'footer')
    .text(`Units: Billions of Dollars Seasonal Adjustment: Seasonally Adjusted Annual Rate Notes:
      A Guide to the National Income and Product Accounts of the United States (NIPA)
      - (http://www.bea.gov/national/pdf/nipaguid.pdf)`);
}

const data = d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', draw);
