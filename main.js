// Get the div where GIF results will be displayed
let results = document.getElementById("results");

// Get the search form
let form = document.getElementById("searchForm");


// Listen for the form submit event
form.addEventListener("submit", function (e) {

    // Prevent the page from refreshing when the form is submitted
    e.preventDefault();

    // Get the value the user typed in the input field
    let keyword = document.getElementById("searchInput").value;

    // Check if the input is empty
    if (keyword === "") {
        alert("Please enter a search keyword");
        return; // stop the function if no keyword
    }

    // Show loading message while API request is running
    results.innerHTML = "Loading...";

    // Fetch GIF data from the Giphy API
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=KDniZyn4wQ27v2gRtdkSUp0bj7b4Zn79&q=${keyword}&limit=12`)

        // Convert the API response to JSON format
        .then(function (response) {
            return response.json();
        })

        // Work with the data returned from the API
        .then(function (data) {

            // Clear the loading message
            results.innerHTML = "";

            // Loop through each GIF returned by the API
            data.data.forEach(function (gif) {

                // Create a new image element
                let img = document.createElement("img");

                // Set the image source to the GIF URL from the API
                img.src = gif.images.fixed_height.url;

                // Add the image to the results div
                results.appendChild(img);
            });

        })

        // Handle errors if the API request fails
        .catch(function (error) {

            // Show error message to the user
            results.innerHTML = "Something went wrong.";

            // Log the error in the console for debugging
            console.log("Error:", error);
        });

});