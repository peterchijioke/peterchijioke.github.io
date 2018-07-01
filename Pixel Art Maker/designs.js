// Select color input
let color = $("#colorPicker");
// Select size input
const pixelcanvas = document.getElementById('pixelCanvas');
let temph = $("#inputHeight");
let tempw = $("#inputWeight");

//An event listener that comes into action when Submit button is clicked .
$('#submit').on('click',function(exp) {
    exp.preventDefault();
    GridMaker();
});
// When size is submitted by the user, call GridMaker()

function GridMaker() {
  pixelcanvas.innerHTML = '';
  let height = temph.val();
  let width = tempw.val();

  //A function which fills color in the cell that was clicked and changes the color.
  let addEvent = function(cell) {
      cell.addEventListener('click', function() {
          cell.style.backgroundColor = color.val();
      });
  }


  //An event listener such that whenever any cell is clicked it calls addEvent function and changes it's color.
  for (let i = 0; i < height; i++) {
      let row = c.insertRow(i);
      for (let j = 0; j < width; j++) {
          let cell = row.insertCell(j);
          cell.addEventListener('click', addEvent(cell));
      }
  }


}
