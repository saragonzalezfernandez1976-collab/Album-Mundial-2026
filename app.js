// ============================================
// MUNDIAL 2026 - APP LOGIC
// ============================================

// Equipos del Mundial 2026
const TEAMS = [
    { code: 'ARG', name: 'Argentina', flag: '🇦🇷', cards: 20 },
    { code: 'BRA', name: 'Brasil', flag: '🇧🇷', cards: 20 },
    { code: 'MEX', name: 'México', flag: '🇲🇽', cards: 20 },
    { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', cards: 20 },
    { code: 'CAN', name: 'Canadá', flag: '🇨🇦', cards: 20 },
    { code: 'ESP', name: 'España', flag: '🇪🇸', cards: 20 },
    { code: 'GER', name: 'Alemania', flag: '🇩🇪', cards: 20 },
    { code: 'FRA', name: 'Francia', flag: '🇫🇷', cards: 20 },
    { code: 'ENG', name: 'Inglaterra', flag: '🇬🇧', cards: 20 },
    { code: 'ITA', name: 'Italia', flag: '🇮🇹', cards: 20 },
    { code: 'POR', name: 'Portugal', flag: '🇵🇹', cards: 20 },
    { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', cards: 20 },
    { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', cards: 20 },
    { code: 'SWE', name: 'Suecia', flag: '🇸🇪', cards: 20 },
    { code: 'CRO', name: 'Croacia', flag: '🇭🇷', cards: 20 },
    { code: 'UKR', name: 'Ucrania', flag: '🇺🇦', cards: 20 },
    { code: 'POL', name: 'Polonia', flag: '🇵🇱', cards: 20 },
    { code: 'SRB', name: 'Serbia', flag: '🇷🇸', cards: 20 },
    { code: 'GRE', name: 'Grecia', flag: '🇬🇷', cards: 20 },
    { code: 'CZE', name: 'República Checa', flag: '🇨🇿', cards: 20 },
    { code: 'ROU', name: 'Rumania', flag: '🇷🇴', cards: 20 },
    { code: 'SVK', name: 'Eslovaquia', flag: '🇸🇰', cards: 20 },
    { code: 'HUN', name: 'Hungría', flag: '🇭🇺', cards: 20 },
    { code: 'SUI', name: 'Suiza', flag: '🇨🇭', cards: 20 },
    { code: 'AUT', name: 'Austria', flag: '🇦🇹', cards: 20 },
    { code: 'JPN', name: 'Japón', flag: '🇯🇵', cards: 20 },
    { code: 'SKO', name: 'Corea del Sur', flag: '🇰🇷', cards: 20 },
    { code: 'AUS', name: 'Australia', flag: '🇦🇺', cards: 20 },
    { code: 'IRN', name: 'Irán', flag: '🇮🇷', cards: 20 },
    { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', cards: 20 },
    { code: 'TUN', name: 'Túnez', flag: '🇹🇳', cards: 20 },
    { code: 'URY', name: 'Uruguay', flag: '🇺🇾', cards: 20 },
];

// Estado de la aplicación
let appState = {
    cards: {},
    duplicates: {},
    filterStatus: 'all',
    searchTerm: ''
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initializeTeamSelect();
    renderTeams();
    updateStatistics();
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        appState.searchTerm = e.target.value.toLowerCase();
        renderTeams();
    });
});

// ============================================
// STATE MANAGEMENT
// ============================================

function loadState() {
    const saved = localStorage.getItem('mundialState');
    if (saved) {
        appState = JSON.parse(saved);
    } else {
        // Inicializar con datos vacíos
        TEAMS.forEach(team => {
            appState.cards[team.code] = new Array(team.cards).fill(false);
            appState.duplicates[team.code] = 0;
        });
    }
}

function saveState() {
    localStorage.setItem('mundialState', JSON.stringify(appState));
    updateStatistics();
}

// ============================================
// TEAM SELECT INIT
// ============================================

function initializeTeamSelect() {
    const select = document.getElementById('teamSelect');
    TEAMS.forEach(team => {
        const option = document.createElement('option');
        option.value = team.code;
        option.textContent = `${team.flag} ${team.name}`;
        select.appendChild(option);
    });
}

// ============================================
// ADD CARDS
// ============================================

function addCard() {
    const teamCode = document.getElementById('teamSelect').value;
    const cardNumber = parseInt(document.getElementById('cardNumber').value);

    if (!teamCode) {
        alert('Por favor selecciona una selección');
        return;
    }

    if (!cardNumber || cardNumber < 1) {
        alert('Por favor ingresa un número de cromo válido');
        return;
    }

    if (cardNumber > appState.cards[teamCode].length) {
        alert(`Este equipo solo tiene ${appState.cards[teamCode].length} cromos`);
        return;
    }

    appState.cards[teamCode][cardNumber - 1] = true;
    document.getElementById('cardNumber').value = '';
    saveState();
    renderTeams();
}

function addDuplicate() {
    const teamCode = document.getElementById('teamSelect').value;

    if (!teamCode) {
        alert('Por favor selecciona una selección');
        return;
    }

    appState.duplicates[teamCode]++;
    document.getElementById('cardNumber').value = '';
    saveState();
    renderTeams();
}

// ============================================
// RENDER TEAMS
// ============================================

function renderTeams() {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '';

    let filtered = TEAMS.filter(team => {
        const matchesSearch = team.name.toLowerCase().includes(appState.searchTerm);
        const collected = appState.cards[team.code].filter(c => c).length;
        const total = team.cards;

        if (appState.filterStatus === 'complete') {
            return matchesSearch && collected === total;
        } else if (appState.filterStatus === 'incomplete') {
            return matchesSearch && collected < total;
        }
        return matchesSearch;
    });

    filtered.forEach(team => {
        const collected = appState.cards[team.code].filter(c => c).length;
        const total = team.cards;
        const percentage = Math.round((collected / total) * 100);
        const isComplete = collected === total;

        const teamCard = document.createElement('div');
        teamCard.className = `team-card ${isComplete ? 'complete' : ''}`;
        
        teamCard.innerHTML = `
            <div class="team-header">
                <span class="team-name">${team.flag} ${team.name}</span>
            </div>
            
            <div class="team-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">${collected}/${total} cromos - ${percentage}%</div>
            </div>
            
            <div class="cards-info">
                <div class="card-count">
                    <span class="card-count-label">Coleccionados</span>
                    <span class="card-count-value">${collected}</span>
                </div>
                <div class="card-count">
                    <span class="card-count-label">Duplicados</span>
                    <span class="card-count-value">${appState.duplicates[team.code]}</span>
                </div>
                <div class="card-count">
                    <span class="card-count-label">Faltantes</span>
                    <span class="card-count-value">${total - collected}</span>
                </div>
            </div>
            
            <div class="team-actions">
                <button onclick="editTeam('${team.code}')" class="btn-secondary">✏️ Editar</button>
                <button onclick="removeTeam('${team.code}')" class="btn-remove">🗑️</button>
            </div>
        `;
        
        teamsList.appendChild(teamCard);
    });
}

// ============================================
// FILTER
// ============================================

function filterByStatus(status) {
    appState.filterStatus = status;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTeams();
}

// ============================================
// EDIT TEAM
// ============================================

function editTeam(teamCode) {
    const team = TEAMS.find(t => t.code === teamCode);
    const collected = appState.cards[teamCode].filter(c => c).length;
    
    const input = prompt(
        `${team.flag} ${team.name}\n\nCromos coleccionados: ${collected}/${team.cards}\n\nIngresa cuántos cromos tienes (0-${team.cards}):`,
        collected
    );
    
    if (input !== null) {
        const num = parseInt(input);
        if (num >= 0 && num <= team.cards) {
            appState.cards[teamCode] = new Array(team.cards).fill(false);
            for (let i = 0; i < num; i++) {
                appState.cards[teamCode][i] = true;
            }
            saveState();
            renderTeams();
        } else {
            alert(`Por favor ingresa un número entre 0 y ${team.cards}`);
        }
    }
}

// ============================================
// REMOVE TEAM
// ============================================

function removeTeam(teamCode) {
    if (confirm('¿Estás seguro de que deseas borrar todos los cromos de este equipo?')) {
        appState.cards[teamCode] = new Array(appState.cards[teamCode].length).fill(false);
        appState.duplicates[teamCode] = 0;
        saveState();
        renderTeams();
    }
}

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {
    // Total cards
    let totalCards = 0;
    let collectedCards = 0;
    
    TEAMS.forEach(team => {
        totalCards += team.cards;
        collectedCards += appState.cards[team.code].filter(c => c).length;
    });
    
    // Duplicates
    let totalDuplicates = Object.values(appState.duplicates).reduce((a, b) => a + b, 0);
    
    // Progress
    const progress = totalCards > 0 ? Math.round((collectedCards / totalCards) * 100) : 0;
    
    // Update DOM
    document.getElementById('totalCards').textContent = collectedCards;
    document.getElementById('duplicateCards').textContent = totalDuplicates;
    document.getElementById('progress').textContent = progress + '%';
}

// ============================================
// EXPORT / IMPORT
// ============================================

function exportData() {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `album-mundial-2026-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            
            if (!imported.cards || !imported.duplicates) {
                throw new Error('Archivo inválido');
            }
            
            appState = imported;
            saveState();
            renderTeams();
            alert('✅ Datos importados correctamente');
        } catch (error) {
            alert('❌ Error al importar: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
});

// ============================================
// CLEAR ALL
// ============================================

function clearAll() {
    if (confirm('⚠️ ¿Estás seguro de que deseas borrar TODOS los datos? Esta acción no se puede deshacer.')) {
        if (confirm('Esta es la última confirmación. ¿Deseas continuar?')) {
            TEAMS.forEach(team => {
                appState.cards[team.code] = new Array(team.cards).fill(false);
                appState.duplicates[team.code] = 0;
            });
            saveState();
            renderTeams();
            alert('✅ Todos los datos han sido borrados');
        }
    }
}