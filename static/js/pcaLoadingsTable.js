function drawPcaTable(loadings){

  title = document.getElementById("table-title");
  title.setAttribute('style','font-size: 30px; color: black; text-align:center; text-decoration: underline; font-family: Courier New;');
  title.innerHTML = "PCA LOADINGS TABLE";
  document.getElementById("table-div").setAttribute('style','background-color:#cadfeb')


  var table = document.createElement("table");
  table.id = "pcaLoad";
  table.setAttribute('style','margin-left: auto; margin-right: auto; border: 1px solid black;');
  // table.class = "table table-bordered table-dark"
  // table.setAttribute("id","pcaLoadings")

var input = JSON.parse(loadings);
  var col = [];
       for (var i = 0; i < input.length; i++) {
           for (var key in input[i]) {
             console.log("key ",key);
               if (col.indexOf(key) === -1) {
                   col.push(key);
               }
           }
       }

       console.log("columns ",col);

  var tr = table.insertRow(-1);

  for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");
      th.innerHTML = col[i];
      th.setAttribute('style','text-align:center; border: 1px solid black;');
      tr.appendChild(th);
  }


 tableinfo = document.getElementById("table-info")
 tableinfo.innerHTML="The intrinsic dimensionality index selected is " + (Number(col.length)-1) ;
 tableinfo.setAttribute('style','text-align:center');


  var attributes = [];
  for (var i = 0; i < input.length; i++) {

      tr = table.insertRow(-1);

      for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = input[i][col[j]];
          tabCell.setAttribute('style','text-align:center; border: 1px solid black;');

          if(j == 0){
            console.log("Attribute ", input[i][col[j]]);
            attributes.push(input[i][col[j]]);
          }
      }
  }

  console.log("Attributes maybe ", attributes);

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById("pcaTable");
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
  // table.setAttributes( 'style','border: 1px solid black;')



drawScatterplotMatrix(attributes);

}
