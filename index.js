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
      id: i.toString() + j.toString(),
      clicked: false,
      clickable: true
    })
}

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


var cellColor = cellSelection
  .append('div')
  .style('background-image', (d) => `url(${d.value}.png)`)

function success (cells) {
    d3.selectAll('div')
    .data(cells, function(d) {return d.id})
    .style('background-image', (d) => `url(${d.value}g.png)`);

}

function replaceCells () {
  //take out success cells
  d3.selectAll('div')
  .data(path, (d) => d.id)
  .remove()
}

function reset () {
  replaceCells();
  path = [];
  cells.forEach((row) => {
    row.forEach((cell) => {
      cell.clickable = true;
      cell.clicked = false;
    })
  })
  cellColor.style('background-image', (d) => `url(${d.value}.png)`);
  cellSelection.style('background', 'grey');
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
