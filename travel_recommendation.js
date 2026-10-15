const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const resultsContainer = document.getElementById("results");
const resultsStatus = document.getElementById("resultsStatus");

let recommendationsRequest;

function normalize(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

async function loadRecommendations() {
    if (!recommendationsRequest) {
        recommendationsRequest = fetch("travel_recommendation_api.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`The recommendations file could not be loaded (${response.status}).`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || !Array.isArray(data.countries) ||
                    !Array.isArray(data.beaches) || !Array.isArray(data.temples)) {
                    throw new Error("The recommendations file has an unexpected format.");
                }
                return data;
            });
    }
    return recommendationsRequest;
}

function getCategory(query) {
    const words = normalize(query).split(/\s+/);
    if (words.some(word => ["beach", "beaches"].includes(word))) {
        return "beaches";
    }
    if (words.some(word => ["temple", "temples"].includes(word))) {
        return "temples";
    }
    if (words.some(word => ["country", "countries"].includes(word))) {
        return "countries";
    }
    return null;
}

function getRecommendations(data, query) {
    const normalizedQuery = normalize(query);
    const category = getCategory(query);

    if (category === "beaches" || category === "temples") {
        const label = category === "beaches" ? "Beach" : "Temple";
        return data[category].map(item => ({ ...item, category: label }));
    }

    const countries = data.countries.flatMap(country =>
        (country.cities || []).map(city => ({
            ...city,
            category: "Destination",
            country: country.name
        }))
    );

    if (category === "countries" || !normalizedQuery) {
        return countries;
    }

    return countries.filter(item =>
        normalize(`${item.name} ${item.country} ${item.description}`).includes(normalizedQuery)
    );
}

function renderRecommendations(items) {
    resultsContainer.replaceChildren();

    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "result-card";

        const image = document.createElement("img");
        image.src = item.imageUrl;
        image.alt = item.name;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "result-card-content";

        const category = document.createElement("p");
        category.className = "result-category";
        category.textContent = item.country
            ? `Destination · ${item.country}`
            : item.category;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const description = document.createElement("p");
        description.textContent = item.description;

        content.append(category, title, description);
        card.append(image, content);
        resultsContainer.append(card);
    });
}

searchForm.addEventListener("submit", async event => {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
        resultsContainer.replaceChildren();
        resultsStatus.textContent = "Enter a destination or try “beach”, “temple”, or “country”.";
        searchInput.focus();
        return;
    }

    resultsStatus.textContent = "Finding recommendations...";
    try {
        const data = await loadRecommendations();
        const items = getRecommendations(data, query);
        renderRecommendations(items);
        resultsStatus.textContent = items.length
            ? `${items.length} recommendation${items.length === 1 ? "" : "s"} found for “${query}”.`
            : `No recommendations found for “${query}”. Try “beach”, “temple”, or a country name.`;
    } catch (error) {
        console.error("Unable to search travel recommendations:", error);
        recommendationsRequest = undefined;
        resultsContainer.replaceChildren();
        resultsStatus.textContent = error instanceof Error
            ? error.message
            : "Unable to load recommendations. Please try again.";
    }
});

clearButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsContainer.replaceChildren();
    resultsStatus.textContent = "Try “beach”, “temple”, or a country like “Japan”.";
    searchInput.focus();
});
