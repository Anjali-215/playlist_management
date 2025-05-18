
//Search function

function searchTable() {
    var input = document.getElementById("seearch").value.toLowerCase();
    var table = document.getElementById("dataTable");
    var rows = table.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
      var rowData = rows[i].getElementsByTagName("td");
      var found = false;

      for (var j = 0; j < rowData.length; j++) {
        if (rowData[j].innerHTML.toLowerCase().indexOf(input) > -1) {
          found = true;
          break;
        }
      }

      if (found) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }

  //user list

 function userlist() {
      event.preventDefault()
      let data = null
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
          const res = JSON.parse(this.responseText);
          var table = '<table class="userlist">  <tr><th>Name</th><th>Email</th><th>Password</th></tr>', element = "";
          if (res.data.length > 0) {
            for (let index = 0; index < res.data.length; index++) {
              element += '<tr><td>' + res.data[index].username + '</td><td>' + res.data[index].email + '</td><td>' + res.data[index].password + '</td></tr>';
            }
          }
          table += element;
          table += '</table>'
          document.getElementById("userlist").innerHTML = table;
        }
      });
      xhr.open("GET", "http://localhost:4000/view");
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(data);
    }

