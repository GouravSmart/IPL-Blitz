const liveMatchesDiv = document.getElementById('live-matches');
const apiKey = '06e3520a-abfe-4791-ad4e-f970307e158d'; 

async function fetchLiveData(apiKey) {
    const apiUrl = `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Could not fetch live data from CricketData.org:", error);
        return null;
    }
}
function playSoundAndNavigate(url) {
    const sound = document.getElementById('clickSound');
    sound.play();

    setTimeout(() => {
        window.open(url);
    }, 1000);
}
function displayLiveMatches(matchesData) {
    liveMatchesDiv.innerHTML = ''; // Clear previous data
    if (matchesData && Array.isArray(matchesData.data)) {
        const liveIPLMatches = matchesData.data.filter(match =>
            match.name && match.name.toLowerCase().includes('indian premier league') && match.matchStarted
        );

        if (liveIPLMatches.length > 0) {
            liveIPLMatches.forEach(match => {
                const matchCard = document.createElement('div');
                matchCard.classList.add('match-card');
                matchCard.innerHTML = `
                    <h3>${match['name']}</h3>
                    <p>Status: ${match.status || 'Live'}</p>
                    ${match.score ? match.score.map(score => `<p>${score.team}: <span class="score">${score.r}/${score.w} (${score.o})</span></p>`).join('') : '<p>Score not yet available</p>'}
                    <p>Match ID: ${match.id}</p>
                    <button onclick="fetchDetailedScore('${match.id}')">View Details</button>
                `;
                liveMatchesDiv.appendChild(matchCard);
            });
        } else {
            liveMatchesDiv.innerHTML = '<p>No live IPL matches currently.</p>';
        }
    } else {
        liveMatchesDiv.innerHTML = '<p>Could not load live match data.</p>';
    }
}

async function updateLiveScores() {
    const liveData = await fetchLiveData(apiKey);
    if (liveData) {
        displayLiveMatches(liveData);
    }
}

async function fetchDetailedScore(matchId) {
    console.log(`Fetching details for match ID: ${matchId}`);
    const detailApiUrl = `https://api.cricapi.com/v1/cricketScore?apikey=${apiKey}&unique_id=${matchId}`;
    try {
        const response = await fetch(detailApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const detailData = await response.json();
        console.log("Detailed Score:", detailData);
        // You would then update the UI to show more details
        alert(`Detailed score available in console for match ID: ${matchId}`);
    } catch (error) {
        console.error("Could not fetch detailed score:", error);
    }
}

// Fetch and update scores initially and then periodically
updateLiveScores();
setInterval(updateLiveScores, 30000); // Update every 30 seconds