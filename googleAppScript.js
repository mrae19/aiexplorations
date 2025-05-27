// Replace this with your spreadsheet ID
const SPREADSHEET_ID = '1C_wEhPaukSAGM5Ebfhrv7dNzLGqTuQWrQSjG5dYzQ8M';

// Create a folder in Google Drive to store the images
function createOrGetImageFolder() {
  const folderName = 'AI Preset Creator Images';
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Function to save image to Drive and return the URL
function saveImageToDrive(base64Data, filename) {
  try {
    // Remove the data URL prefix if present
    const imageData = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const blob = Utilities.newBlob(Utilities.base64Decode(imageData), 'image/jpeg', filename);
    
    // Get or create the folder
    const folder = createOrGetImageFolder();
    
    // Save the file
    const file = folder.createFile(blob);
    
    // Create a shareable link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (error) {
    Logger.log('Error saving image: ' + error.toString());
    return '';
  }
}

function doPost(e) {
  try {
    // Log the incoming request parameters
    Logger.log('Received POST request');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    // Get the specific spreadsheet and first sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('Successfully opened spreadsheet');
    
    const sheet = spreadsheet.getSheets()[0];  // Gets the first sheet
    Logger.log('Successfully got first sheet');
    
    // If headers don't exist, add them
    if (sheet.getLastRow() === 0) {
      Logger.log('Adding headers');
      sheet.appendRow([
        'Timestamp',
        'Image URL',
        'Original Filename',
        'Prompt',
        'Matched Preset',
        'Preset Score',
        'Generated Filters',
        'Success'
      ]);
    }
    
    // Parse the form data
    Logger.log('Parsing data from e.parameter.data: ' + e.parameter.data);
    const data = JSON.parse(e.parameter.data);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Save image to Drive if present
    let imageUrl = '';
    if (data.imageData) {
      imageUrl = saveImageToDrive(data.imageData, data.originalFileName || 'preset-image.jpg');
      Logger.log('Image saved to Drive: ' + imageUrl);
    }
    
    // Format timestamp
    const timestamp = new Date().toISOString();
    
    // Prepare the row data
    const rowData = [
      timestamp,
      imageUrl,
      data.originalFileName || '',
      data.prompt,
      data.matchedPreset,
      data.presetScore,
      data.generatedFilters,
      data.success
    ];
    Logger.log('Row data prepared: ' + JSON.stringify(rowData));
    
    // Append the row
    sheet.appendRow(rowData);
    Logger.log('Row appended successfully');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data logged successfully',
      'imageUrl': imageUrl
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    Logger.log('Error occurred: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Logging endpoint is active')
  .setMimeType(ContentService.MimeType.TEXT);
}

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput('')
  .setMimeType(ContentService.MimeType.TEXT);
} 