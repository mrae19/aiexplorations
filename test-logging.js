// Replace this with your deployed web app URL
const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL';

// Test data
const testData = {
    prompt: "TEST - Make it look warm and vintage",
    matchedPreset: "vintage_film",
    presetScore: 4,
    generatedFilters: "sepia(0.4) saturate(0.8)",
    success: true
};

// Make the test request
fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
}); 