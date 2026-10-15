let travelData = {};

// Fetch data from JSON file
fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log(data);
    })
    .catch(error => console.error('Error loading data:', error));

// Search recommendations
function searchRecommendation() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    // Beach search
    if (
        keyword === "beach" ||
        keyword === "beaches"
    ) {

        displayResults(travelData.beaches);

    }
    // Temple search
    else if (
        keyword === "temple" ||
        keyword === "temples"
    ) {

        displayResults(travelData.temples);

    }
    // Country search
    else if (
        keyword === "country" ||
        keyword === "countries"
    ) {

        let countryResults = [];

        travelData.countries.forEach(country => {
            countryResults.push(...country.cities);
        });

        displayResults(countryResults);

    } else {

        document.getElementById("results").innerHTML =
            "<h2>No recommendations found.</h2>";
    }
}

// Display results
function displayResults(items) {

    const resultsContainer = document.getElementById("results");

    resultsContainer.innerHTML = "";

    items.forEach(item => {

        resultsContainer.innerHTML += `
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.description}</h3>
        <p>${item.description}</p>
      </div>
    `;
    });
}

// Clear search results
function clearResults() {

    document.getElementById("searchInput").value = "";
    document.getElementById("results").innerHTML = "";
}