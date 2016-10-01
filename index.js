var table = d3.select('table')

var rows = _.range(0, 5);

var path = [];

var fibs = [1, 1];
for (var i = 0; i < 10; i++) {
  fibs.push(fibs[i] + fibs[i + 1]);
}

var cells = [];
for (var i = 0; i < 6; i++) {
  cells.push([]);
  for(var j = 0; j < 6; j++)
    cells[i].push({
      value: randomFib(),
      loc: [i, j],
      id: Math.floor(Math.random() * 1000000),
      locID: i.toString() + j.toString(),
      clicked: false,
      clickable: true
    })
}

var rowSelction = table.selectAll('tr')
  .data(cells)

  rowSelction.enter()
  .append('tr')


var cellSelection = rowSelction.selectAll('td')
  .data(function(d, i) {
    return d;
  })

cellSelection.enter()
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
    console.log(path)
    if (d.clickable) {
      if (!d.clicked) {
        if(d.value === fibs[path.length]) {
          d3.select(this)
          .style('background', 'mediumturquoise')
          setClickOptions(d)
        }
      } else {
        d3.select(this)
        .style('background', 'darkgrey')
        setClickOptions(d)
      }
    }
  })


var cellColor = cellSelection.selectAll('div')
  .data((d) => d)

cellColor
  .enter()
  .append('div')
  .style('background-image', (d) => `url(${d.value}.png)`)

function success (cells) {
    d3.selectAll('div')
    .data(cells, function(d) {return d.id})
    .style('background-image', (d) => `url(${d.value}g.png)`);

}

function replaceCells () {
  //update data
  var shiftCells = [];

  path.sort((a, b) => {
    return a.loc[0] - b.loc[0];
  }).forEach((item) => {
    if(!_.contains(shiftCells, item.locID)) shiftCells.push(item.locID)
    var row = item.loc[0];
    var col = item.loc[1];
    cells[row][col] = undefined;
    row--;
    while (row >= 0 && cells[row][col] !== undefined) {
      cells[row + 1][col] = cells[row][col];
      cells[row + 1][col].loc = [row + 1, col];
      cells[row + 1][col].locID = (row + 1).toString() + col.toString();
      cells[row][col] = undefined;
      if(!_.contains(shiftCells, row.toString() + col.toString())) shiftCells.push(row.toString() + col.toString());
      row--;
    }
  });


  for (var i = 0; i < cells.length ; i++) {
    for(var j = 0; j < cells[i].length; j++) {
      if (cells[i][j] === undefined) {
        cells[i][j] = {
          value: randomFib(),
          loc: [i, j],
          id: Math.floor(Math.random() * 1000000),
          locID: i.toString() + j.toString(),
          clicked: false,
          clickable: true
        };
      }
    }
  }
  return shiftCells.map((loc) => {
    var arr = loc.split('');
    return cells[arr[0]][arr[1]];
  })
}

function updateBoard (shiftCells) {

  d3.selectAll('div')
  .data(shiftCells, (d) => d.locID)
  .attr('class', 'remove')

  d3.selectAll('div')
  .data(path, (d) => d.id)
  .attr('class', 'remove')

  //.style('background-image', (d) => `url(${d.value}.png)`)


  // d3.selectAll('div')
  // .data(shiftCells, (d) => d.id)
  // .remove()

  //fill empty cells
  console.log(cells)
  //cellSelection.
  // d3.selectAll('tr')
  // .data(cells)
  // .selectAll('td')
  // .data((d) => {
  //   console.log(d)
  //   return d;
  // })
  // .style('background', 'grey')
  // .selectAll('div.remove')
  // .data((d) => d)
  // .style('background-image', null)
  // .style('background-image', function(d) {
  //   console.log(d)
  //   return `url(${d.value}.png)`;
  // })
  //.attr('class', null)


}

function reset () {
  var shiftCells = replaceCells();
  cells.forEach((row) => {
    row.forEach((cell) => {
      cell.clickable = true;
      cell.clicked = false;
    })
  })
  console.log(cells)
  updateBoard(shiftCells);
  path = [];

}

function setClickOptions (item) {
  item.clicked = !item.clicked;
  //if item was turned on, only allow clicking in adjacent squares
  if (item.clicked) {
    path.push(item);
    if (path.length >= 3) {
      success(path);
      setTimeout(reset, 1000)
    }
    restrictToSurrounding(item);
  } else {
  //go back one step in path
    path.pop();
    if (path.length !== 0) {
      restrictToSurrounding(path[path.length - 1])
    } else {
      cells.forEach((row) => {
        row.forEach((cell) => {
          cell.clickable = true;
        })
      })
    }
  }
};

function restrictToSurrounding (item) {
  cells.forEach((row) => {
    row.forEach((cell) => {
      if (cell.loc[0] >= item.loc[0] - 1 && cell.loc[0] <= item.loc[0] + 1 && cell.loc[1] >= item.loc[1] - 1 && cell.loc[1] <= item.loc[1] + 1) {
        cell.clickable = true;
        if (cell.loc[0] + cell.loc[1] === item.loc[0] + item.loc[1] || cell.loc[0] - cell.loc[1] === item.loc[0] - item.loc[1]) {
          cell.clickable = false;
          item.clickable = true;
          if (path.length > 1) {
            path[path.length - 2].clickable = false;
          }
        }
      } else {
        cell.clickable = false;
      }
    })
  })
}


function randomFib () {
  var percent = Math.ceil(Math.random() * 100);
  if (percent < 50) return fibs[1];
  if (percent < 70) return fibs[2];
  if (percent < 85) return fibs[3];
  if (percent < 95) return fibs[4];
  return fibs[5];
}
