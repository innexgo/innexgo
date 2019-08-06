function currentStatus() {
  var apiKey = Cookies.getJSON('apiKey');
  var course = Cookies.getJSON('course');
  var period = Cookies.getJSON('period');

  var table = document.getElementById('current-status-table');

  //bail if we dont have all of the necessary cookies
  if(apiKey == null || course == null || period == null) {
    console.log('lack necessary cookies to calculate current status');
    table.innerHTML='';
    return;
  }

  // get students
  var url = thisUrl() + '/getCurrentStatus/' +
    '?courseId=' + course.id +
    '&periodId=' + period.id +
    '&apiKey=' + apiKey.key;
  request(url,
    function(xhr) {
      var statuses = JSON.parse(xhr.responseText);

      //blank table
      table.innerHTML='';

      for(var i = 0; i < statuses.length; i++) {
        var status = statuses[i].status;
        var student = statuses[i].student;
        var text = '<span class="fa fa-times"></span>';
        var bgcolor = '#ffcccc';
        var fgcolor = '#ff0000';
        // if we can find it
        if(status == 'present') {
          text =  '<span class="fa fa-check"></span>'
          bgcolor = '#ccffcc';
          fgcolor = '#00ff00';
        } else if (status == 'tardy') {
          text =  '<span class="fa fa-check"></span>'
          bgcolor = '#ffffcc';
          fgcolor = '#ffff00';
        } else if (status == 'absent') {
          text =  '<span class="fa fa-times"></span>'
          bgcolor = '#ffcccc';
          fgcolor = '#ff0000';
        }

        table.insertRow(0).innerHTML=
          ('<tr>' +
            '<td>' + student.name + '</td>' +
            '<td>' + student.id + '</td>' +
            '<td style="background-color:'+bgcolor+';color:'+fgcolor+'">' + text + '</td>' +
            '</tr>');
      }
    },
    //failure
    function(xhr) {
      return;
    }
  );
}

$(document).ready(function() {
  currentStatus();
  setInterval(currentStatus, 5000);
})

