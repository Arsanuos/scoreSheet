
var actionsDiv = "<div class=\"text-center\">"+
  "<a class=\"btn btn-success\" id=\"plusOne\" data-toggle=\"tooltip\" title=\"Increase score by 1\" aria-label=\"Delete\">"+
    "<i class=\"fa fa-plus fa-lg\" aria-hidden=\"true\"></i>"+
  "</a>"+
  "<a id=\"edit\" class=\"btn btn-info\" data-toggle=\"tooltip\" title=\"Edit\" aria-label=\"Delete\">"+
    "<i class=\"fa fa-pencil fa-lg\" aria-hidden=\"true\"></i>"+
  "</a>"+
  "<a class=\"btn btn-danger\" id =\"deleteRow\" data-toggle=\"tooltip\" title=\"Delete\" aria-label=\"Delete\">"+
    "<i class=\"fa fa-trash-o fa-lg\" aria-hidden=\"true\"></i>"+
  "</a>"+
"</div>"

function comp(x,y){
  if(y === "")
  {
    return 0;
  }
  x = parseInt(x,10);
  y = parseInt(y,10);
  if(x >= y)
  {
    return 0;
  }else{
    return 1;
  }
}

function putMarks(){
  var markUp = "<i class=\"fa fa-angle-double-up fa-lg green\" aria-hidden=\"true\"></i>";
  var markDown = "<i class=\"fa fa-angle-double-down fa-lg red\" aria-hidden=\"true\"></i>";
  $("table tbody tr").each(function () {

    $(this).children(":eq(1)").text($(this).index() + 1);
    var x = $(this).children(":eq(0)").text() ;
    var y =  $(this).children(":eq(1)").text()
    x = parseInt(x,10);
    y = parseInt(y,10);
    if(x > y){//befor > after  ---decreased
      $(this).children(":eq(2)").html(markUp +" "+ $(this).children(":eq(2)").text());
    }else if( x < y){
        $(this).children(":eq(2)").html(markDown +" "+ $(this).children(":eq(2)").text());
    }else{
      $(this).children(":eq(2)").html($(this).children(":eq(2)").text());
    }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sortTable(n , direction) {
  'use strict'
  $(".status").animate({
    opacity:1
  },300);
  $("table tbody tr").each(function () {
      $(this).children(":eq(0)").text(  parseInt($(this).children(":eq(1)").text() , 10));
  })
  await sleep(2000);

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir =  direction;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        console.log("x"+x.innerHTML);
        console.log("y"+y.innerHTML);
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (comp(x.innerHTML,y.innerHTML) === 1) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
      await sleep(300);
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  $(".status").animate({
    opacity:0
  },100);

  putMarks();

}


$(document).ready(function () {
    'use strict';

    var cnt = 1;
    var cell = null;

    $("table tbody").on("mouseenter", "tr", function() {
      $(this).find("td:nth-child(5)").append(actionsDiv);
      $("#edit").on('click',function () {
        cell = $(this).parent().parent();
        $("#editTeamScore").parent().removeClass("has-error");
        $("#editModal").modal("show");
        $("#editTeamName").val($(this).parent().parent().siblings(":eq(2)").text());
        $("#editTeamScore").val($(this).parent().parent().siblings(":eq(3)").text());
      });


      $("#editModal .modal-footer #submitTeam").on('click',function () {
          if(cell === null)
          {
            return;
          }
          if($.isNumeric($("#editTeamScore").val() ) ){
            cell.siblings(":eq(2)").text($("#editTeamName").val());
            cell.siblings(":eq(3)").text($("#editTeamScore").val());
            $("#editModal").modal("hide");
            sortTable(3,'desc');
            cell = null;
          }else{
            $("#editTeamScore").parent().addClass("has-error");
          }
      })

      $("#plusOne").on("click",function () {
        var row = $(this).parent().parent();
        if(row.siblings(":eq(3)").text() === ""){
          row.siblings(":eq(3)").text(1);
          sortTable(3,"desc");
          return;
        }
        var value = parseInt(row.siblings(":eq(3)").text(), 10);
        row.siblings(":eq(3)").text(value + 1);
        sortTable(3,"desc");
      })

      $("#deleteRow").on('click',function () {
        $(this).parent().parent().parent().remove();
      })
    });

    $("table tbody").on("mouseleave", "tr", function() {
          $(this).find("td:nth-child(5)").empty();
    });

    $("table tbody tr td:nth-child(5) a").click(function (event) {
       event.preventDefault();
    })

    $('[data-toggle="tooltip"]').tooltip();

    $("#addTeam").click(function () {
      $("#addTeamName").val("");
      $("#addTeamScore").val("0");
      $("#addTeamScore").parent().removeClass("has-error");
      $('#addModal').modal('show');
    });

    $('#addModal').on('shown.bs.modal', function () {
      $('#addTeamName').focus();
    })

    $("#deleteAll").click(function () {
        $("table tbody").empty();
        cnt = 1;
    })

    $("#addModal .modal-footer #submitTeam").click(function () {
      if($.isNumeric($("#addTeamScore").val())){

        var row = '  <tr>'+
            '<td>'+cnt+'</td>'+
            '<td>'+cnt+'</td>'+
            '<td>'+$("#addTeamName").val()+'</td>'+
            '<td>'+$("#addTeamScore").val()+'</td>'+
            '<td></td>'+
          '</tr>';
        $("table tbody").append(row);
        cnt++;
        $("#addModal").modal("hide");
      }else{
        $("#addTeamScore").parent().addClass("has-error");
      }
    })



});
