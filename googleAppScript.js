// Replace this with your spreadsheet ID
const SPREADSHEET_ID = '1C_wEhPaukSAGM5Ebfhrv7dNzLGqTuQWrQSjG5dYzQ8M';

function doPost(e) {
  try {
    // Get the specific spreadsheet and first sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheets()[0];  // Gets the first sheet
    
    // If headers don't exist, add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Prompt',
        'Matched Preset',
        'Preset Score',
        'Generated Filters',
        'Success'
      ]);
    }
    
    // Parse the form data
    const data = JSON.parse(e.parameter.data);
    
    // Format timestamp
    const timestamp = new Date().toISOString();
    
    // Prepare the row data
    const rowData = [
      timestamp,
      data.prompt,
      data.matchedPreset,
      data.presetScore,
      data.generatedFilters,
      data.success
    ];
    
    // Append the row
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data logged successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Logging endpoint is active')
  .setHeader('Access-Control-Allow-Origin', '*');
}

// Handle CORS preflight requests
function doOptions(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
} 