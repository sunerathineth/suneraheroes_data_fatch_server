document.addEventListener('DOMContentLoaded', () => {
    fetch('/api')  // Make sure to call the correct API endpoint on Vercel
        .then(response => response.json())
        .then(data => {
            console.log('Player Data:', data);
            document.getElementById('data-container').innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
