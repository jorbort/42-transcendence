document.getElementById('connectButton').addEventListener('click', function() {
    fetch('https://api.example.com/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            
            // Handle the data from the API here
        })
        .catch(error => {
        });
});