// Función para obtener datos
async function getData(endpoint) {
    try {
        const response = await fetch(`db.json`);
        const data = await response.json();
        return data[endpoint] || [];
    } catch (error) {
        console.error(`Error getting ${endpoint}:`, error);
        return [];
    }
}

// Función para guardar datos
async function saveData(endpoint, newData) {
    try {
        const response = await fetch(`db.json`);
        const data = await response.json();
        data[endpoint] = newData;
        
        // En un entorno real, aquí harías una petición POST/PUT
        // Por ahora, simularemos guardando en sessionStorage
        sessionStorage.setItem('f1_data', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving ${endpoint}:`, error);
        return false;
    }
}

// Función para obtener datos combinados (DB + cambios temporales)
async function getCombinedData(endpoint) {
    const dbData = await getData(endpoint);
    const sessionData = JSON.parse(sessionStorage.getItem('f1_data'));
    
    if (sessionData && sessionData[endpoint]) {
        return sessionData[endpoint];
    }
    
    return dbData;
}

export { getData, saveData, getCombinedData }; 