fetch("/create-post") // Replace with the correct endpoint
        .then((response) => response.json())
        .then((authorsData) => {
          var authorSelect = document.getElementById("authorSelect");

          // Dynamically generate options for the select element
          authorsData.forEach(function (author) {
            var option = document.createElement("option");
            option.value = author.id;
            option.text = author.name;
            authorSelect.appendChild(option);
          });
        })
        .catch((error) => console.error("Error fetching authors:", error));
      