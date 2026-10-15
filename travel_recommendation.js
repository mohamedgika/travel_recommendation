function searchRecommendation() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const resultsDiv =
        document.getElementById("results");

    resultsDiv.innerHTML = "";

    const destinations = [

        {
            name: "Sydney",
            image:
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8d0b9",
            description:
            "Sydney Opera House and Harbour Bridge."
        },

        {
            name: "Bora Bora",
            image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            description:
            "Beautiful beaches and blue lagoons."
        },

        {
            name: "Kyoto",
            image:
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            description:
            "Historic temples and rich culture."
        }
    ];

    const filtered = destinations.filter(item =>
        item.name.toLowerCase().includes(searchText)
    );

    filtered.forEach(item => {

        resultsDiv.innerHTML += `
            <div class="result-card">
                ${item.image}
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;
    });
}

function clearResults() {

    document.getElementById("searchInput").value = "";

    document.getElementById("results").innerHTML = "";
}