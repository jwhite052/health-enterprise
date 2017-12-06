/*
* Locations List
*/

(function() {
  var json = (function() {
    var json = null;
    $.ajax({
      'async': false,
      'global': false,
      'url': "/locationsdata.json",
      'dataType': "json",
      'success': function (data) {
        json = data;
      }
    });
    return json;
  })();

  var jsonObj = json;

  var locationsListUI = $('.jh-locations-list');

  for (var key in jsonObj) {
    var obj = jsonObj[key];
    console.log(obj);
    for (var i = 0; i < obj.length; i++) {
      console.log(obj[i].phone);
      var category = obj[i].type;
      var categoryStr;
      if (category === 'hospital') {
        categoryStr = 'Hospital';
      } else if (category === 'outpatient') {
        categoryStr = 'Outpatient';
      } else if (category === 'urgent') {
        categoryStr = 'Urgent Care';
      } else {
        categoryStr = '';
      }
      var phone = obj[i].phone;
      var hours = obj[i].hours;
      var bodyEl = $('<div>', {
        class: 'jh-location-card__body'
      });
      bodyEl.append($('<p class="jh-location-card__address address">' + obj[i].address + '</p>'));
      if (phone) {
        phone = phone.replace(/: /gi, ': <br>');
        bodyEl.append($('<p class="jh-location-card__phone">' + phone + '</p>'));
      }
      if (hours) {
        bodyEl.append($('<p class="jh-location-card__hours">' + hours + '</p>'));
      }

      // create new list item element
      var newListItem = $('<li>',{
        class: 'jh-locations-list__item',
        html: $('<div>', {
          class: 'jh-location-card',
          html: $('<div>', {
            class: 'jh-location-card__inner',
            html: $('<div>', {
              class: 'jh-location-card__image'
            }).add('<div>', {
              class: 'jh-location-card__category category',
              attr: {
                'data-category': category
              },
              html: categoryStr
            }).add($('<div>', {
              class: 'jh-location-card__title name',
              html: $('<h4>' + obj[i].name + '</h4>')
            })).add(bodyEl)
          })
        })
      });
      locationsListUI.append(newListItem);
    }
  }
})();

/*
* Locations List - Filters
*/

(function() {
  var locationsList = new List('locations-list', {
    valueNames: [
      'name',
      'address',
      { attr: 'data-category', name: 'category' }
    ],
    page: 8,
    pagination: true
  });

  $('#filter-all').on('click', function() {
    locationsList.filter(); // clears filters
  });
  $('#filter-hospital').on('click', function() {
    filterCategory('hospital');
  });
  $('#filter-urgentcare').on('click', function() {
    filterCategory('urgent');
  });
  $('#filter-outpatient').on('click', function() {
    filterCategory('outpatient');
  });

  function filterCategory(category) {
    locationsList.filter(function(item) {
    if (item.values().category.toLowerCase() === category) {
       return true;
    } else {
       return false;
    }
    }); // Only items with id > 1 are shown in list
  }
  //ocationsList.filter(); // Remove all filters

  function initLocations() {
    // filterCategory('hospital');
    // $('#filter-hospitals').addClass('is-active');
  }

  initLocations();
})();
