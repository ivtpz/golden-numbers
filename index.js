var table = d3.select('table')

var rows = _.range(0, 5);

var path = [];

var start = false;

var cells = [];
for (var i = 0; i < 6; i++) {
  cells.push([]);
  for(var j = 0; j < 6; j++)
    cells[i].push({
      value: 'one',
      loc: [i, j],
      clicked: false,
      clickable: true
    })
}
console.log(cells)

var rowSelction = table.selectAll('tr')
  .data(rows)
  .enter()
  .append('tr')


var cellSelection = rowSelction.selectAll('td')
  .data(function(d) {
    return cells[d];
  })
  .enter()
  .append('td')
  .style('background', 'grey')
  .on('mouseover', function(d) {
    if(!d.clicked) {
      d3.select(this)
      .style('background', 'darkgrey')
    }
  })
  .on('mouseout', function(d) {
    if(!d.clicked) {
      d3.select(this)
      .style('background', 'grey')
    }
  })
  .on('click', function(d) {
    d.clicked = !d.clicked;
    if (d.clicked) {
      d3.select(this)
      .style('background', 'mediumturquoise')
      setClickOptions(d)
    } else {
      d3.select(this)
      .style('background', 'darkgrey')
      setClickOptions(d)
    }
  })


var cellColor = cellSelection.append('div')
  .style('background-image', 'url(one.png)')

function success () {
  cellColor.style('background-image', 'url(oneg.png)');
}

function reset () {
  cellColor.style('background-image', 'url(one.png)');
}

function setClickOptions (item) {
  if (!start) {
    start = true;
  }
  //if item was turned on, only allow clicking in adjacent squares
  if (item.clicked) {
    path.push(item.loc)
    restrictToSurrounding(item);
  } else {
  //if item was turned off, back up in path, reset clickable
  }
};

function restrictToSurrounding (item) {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.loc[0] >= item.loc[0] - 1 && cell.loc[0] <= item.loc[0] + 1 && cell.loc[1] >= item.loc[1] - 1 && cell.loc[1] <= item.loc[1] + 1) {
        if (cell.loc[0] + cell.loc[1] === item.loc[0] + item.loc[1] || cell.loc[0] - cell.loc[1] === item.loc[0] - item.loc[1]) {
          cell.clickable = false;
          item.clickable = true;
        }
      } else {
        cell.clickable = false;
      }
    })
  })
}
