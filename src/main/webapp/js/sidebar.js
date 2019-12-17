function displayInfo() {
  let period = Cookies.getJSON('period');
  if(period == null) {
    return;
  }

  let courses = Cookies.getJSON('courses');
  if(courses == null) {
    return;
  }

  let course = courses.filter(c => c.period == period.number)[0];


  document.getElementById('info-time').innerHTML = moment().format('dddd (MM/DD/YYYY)');
  document.getElementById('info-period').innerHTML = period.type;

  if(course != null) {
    document.getElementById('info-location').innerHTML =
      linkRelative(course.location.name, '/locationprofile.html?locationId=' + course.location.id);
  } else {
    document.getElementById('info-location').innerHTML = '';
  }
}

$(document).ready(function () {
  let apiKey = Cookies.getJSON('apiKey');
  let prefs = Cookies.getJSON('prefs');

  // Set name
  document.getElementById('info-name').innerHTML = linkRelative(apiKey.user.name, '/userprofile.html?userId=' + apiKey.user.id);

  // Set links in the document dependent on user permissions
  if (apiKey.user.ring == 0) {
    document.getElementById('my-overview').href = '/adminoverview.html';
  } else {
    document.getElementById('my-overview').href = '/overview.html';
  }

  // Add sidebar tags
  let sidebarItems = $('.sidebar-item').addClass('list-group-item');
  sidebarItems.not('.sidebar-info-list').addClass('list-group-item-action');

  // Now setup color
  let sidebar = prefs.sidebarStyle;
  let color = prefs.colorScheme;

  // Post image on top
  let brandImage = document.createElement('img');
  brandImage.src = '/img/innexgo_logo.png';
  $('.navbar-palette').addClass('text-light').addClass('bg-dark');

  displayInfo();

  var period = Cookies.getJSON('period');
  setInterval(displayInfo, 10000);
})
