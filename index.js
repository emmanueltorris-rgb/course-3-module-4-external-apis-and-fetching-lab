const stateInput = document.querySelector('#state-input');
const searchBtn = document.querySelector('#fetch-alerts');
const alertsDisplay = document.querySelector('#alerts-display');
const errorMessage = document.querySelector('#error-message');

// 2. Add the Event Listener
searchBtn.addEventListener('click', () => {
    const state = stateInput.value.toUpperCase().trim();

    if (!state) {
        displayError("Please enter a state abbreviation.");
        return;
    }

    fetchWeatherAlerts(state);
    stateInput.value = '';
});

async function fetchWeatherAlerts(state) {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    alertsDisplay.innerHTML = '';

    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${state}`);
        
        if (!response.ok) {
            throw new Error('Invalid state code or network error');
        }

        const data = await response.json();
        const alerts = data.features;
        
        const summary = document.createElement('h2');
        summary.textContent = `${data.title}: ${alerts.length}`;
        alertsDisplay.appendChild(summary);

        const list = document.createElement('ul');
        alerts.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = alert.properties.headline;
            list.appendChild(li);
        });
        alertsDisplay.appendChild(list);

    } catch (error) {
        displayError(error.message);
    }
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    alertsDisplay.innerHTML = '';
}