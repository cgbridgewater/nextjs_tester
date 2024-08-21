
// Import the Mailjet package and Keys
import mailjet from 'node-mailjet';

// Initialize Mailjet with your API credentials
// You should replace your_api_key, your_api_secret with your actual Mailjet API key and secret
const mailjetClient = mailjet.connect(process.env.API_KEY, process.env.SECRET_KEY);

// Export the configured client
export default mailjetClient;