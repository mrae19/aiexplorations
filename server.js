const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { format } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Initialize CSV if it doesn't exist
const csvPath = path.join(logsDir, 'prompt_logs.csv');
if (!fs.existsSync(csvPath)) {
    const headers = 'timestamp,prompt,matchedPreset,presetScore,generatedFilters,success\n';
    fs.writeFileSync(csvPath, headers);
}

// Log entry endpoint
app.post('/api/log', (req, res) => {
    try {
        const {
            prompt,
            matchedPreset,
            presetScore,
            generatedFilters,
            success
        } = req.body;

        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        
        // Escape any commas in the text fields
        const escapedPrompt = prompt.replace(/,/g, ';');
        const escapedPreset = matchedPreset ? matchedPreset.replace(/,/g, ';') : '';
        const escapedFilters = generatedFilters ? generatedFilters.replace(/,/g, ';') : '';

        const logEntry = `${timestamp},"${escapedPrompt}","${escapedPreset}",${presetScore},"${escapedFilters}",${success}\n`;

        fs.appendFileSync(csvPath, logEntry);

        res.json({ success: true, message: 'Log entry created' });
    } catch (error) {
        console.error('Error logging entry:', error);
        res.status(500).json({ success: false, message: 'Error creating log entry' });
    }
});

// Get logs endpoint (optional, for debugging)
app.get('/api/logs', (req, res) => {
    try {
        const logs = fs.readFileSync(csvPath, 'utf8');
        res.type('text/csv').send(logs);
    } catch (error) {
        console.error('Error reading logs:', error);
        res.status(500).json({ success: false, message: 'Error reading logs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 