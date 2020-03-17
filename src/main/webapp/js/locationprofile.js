"use strict"

/* globals moment Cookies fetchJson linkRelative apiUrl giveTempError givePermError sleep INT32_MAX */

// Forever runs and updates currentStatus
async function currentStatus(locationId) {
  const makeEntry = (student, bgcolor, fgcolor, faClass, toolTip) =>
    `<tr>
        <td>${linkRelative(student.name, '/studentprofile.html?studentId=' + student.id)}</td>
        <td>${student.id}</td>
        <td title="${toolTip}" style="background-color:${bgcolor};color:${fgcolor}">
            <span class="fa ${faClass}"></span>
        </td>
      </tr>`;

  let apiKey = Cookies.getJSON('apiKey');
  let table = $('#current-status-table');
  for (; ;) {
    let period = Cookies.getJSON('period');

    let time = moment().valueOf();

    //bail if we dont have all of the necessary cookies
    if (apiKey == null || period == null) {
      console.log('lack necessary cookies to calculate current status');
      table.innerHTML = '';
      return;
    }

    try {
      // Clear table
      table.innerHTML = '';
      // Students
      try {
        let students = await fetchJson(`${apiUrl()}/misc/present/?locationId=${locationId}&time=${time}&apiKey=${apiKey.key}`);
        // Clear table
        table[0].innerHTML = '';
        // Students
        if (students.length == 0) {
          table[0].innerHTML = `<b>No Students Currently in Classroom</b>`;
        } else {
          students.forEach(student => table.append(makeEntry(student, '#ccffcc', '#00ff00', 'fa-check', 'You don\'t have a scheduled class at the moment, but this student is signed into your classroom.')));
        }
      } catch (err) {
        console.log(err);
        giveTempError('Failed to correctly fetch student data, try refreshing');
      }
    } catch (err) {
      console.log(err);
      giveTempError('Failed to correctly fetch student data, try refreshing');
    }
    // Wait 5 seconds before updating again
    await sleep(5000);
  }
}


async function loadData() {
  let apiKey = Cookies.getJSON('apiKey');
  if (apiKey == null) {
    console.log('Not signed in');
    return;
  }

  let semester = Cookies.getJSON('semester');
  if (semester == null) {
    console.log('No semester, bailing');
    return;
  }

  let searchParams = new URLSearchParams(window.location.search);

  if (!searchParams.has('locationId')) {
    givePermError('Page loaded with invalid parameters.');
    return;
  }

  var locationId = searchParams.get('locationId');

  try {
    let location = (await fetchJson(`${apiUrl()}/location/?locationId=${locationId}&offset=0&count=1&apiKey=${apiKey.key}`))[0]
    if (location == null) {
      throw new Error('Location Id undefined in database!');
    }
    document.getElementById('location-name').innerHTML = location.name;
  } catch (err) {
    console.log(err);
    givePermError('Page loaded with invalid location id.');
  }


  currentStatus(locationId);

  try {
    // One liner time
    (await fetchJson(`${apiUrl()}/course/?locationId=${locationId}&semesterStartTime=${semester.startTime}&offset=0&count=${INT32_MAX}&apiKey=${apiKey.key}`))
      .sort((a, b) => (a.period > b.period) ? 1 : -1)
      .forEach(course => $('#location-courses').append(`
            <tr>
              <td>${course.period}</td>
              <td>${linkRelative(course.subject, '/courseprofile.html?courseId=' + course.id)}</td>
              <td>${linkRelative(course.teacher.name, '/userprofile.html?userId=' + course.teacher.id)}</td>
            </tr>`));
  } catch (err) {
    console.log(err);
    givePermError('Error fetching courses.');
  }
}

//Bootstrap Popover - Alert Zones/Quick help for Card(s)
$(document).ready(function () {
  $('[data-toggle="popover"]').popover({
    trigger: 'hover'
  });
});

$(document).ready(function () {
  loadData();
})

