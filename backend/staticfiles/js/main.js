document.getElementById('connectButton').addEventListener('click', function() {
    fetch('https://api.example.com/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Handle the data from the API here
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});