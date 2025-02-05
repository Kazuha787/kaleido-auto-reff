# Kaleido Finance Registration Bot

An automated registration bot for Kaleido Finance with proxy support and anti-detection features.

## Features

- 🤖 Automated registration process
- 🌐 Support for HTTP, SOCKS4, and SOCKS5 proxies
- 🔄 Automatic proxy rotation
- 🛡️ Anti-detection measures
- ⏱️ Random delays between requests
- 📝 Detailed logging of successful registrations
- 💼 Ethereum wallet generation
- 🔑 Support for authenticated proxies

## Requirements

- Node.js 14.x or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Kazuha787/kaleido-auto-reff.git
cd kaleido-auto-reff
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Proxy Setup (Optional)

Create a `proxy.txt` file in the project root directory with your proxies in the following format:

```
http:1.2.3.4:8080
socks4:1.2.3.4:1080
socks5:1.2.3.4:1080
```

For proxies with authentication:
```
http:username:password@1.2.3.4:8080
socks5:username:password@1.2.3.4:1080
```

If no proxy file is found or the file is empty, the bot will use direct connection.

## Usage

1. Start the bot:
```bash
npm start
```

2. Follow the prompts:
   - Enter your referral code
   - Enter the number of accounts to register

3. The bot will start the registration process and show progress in real-time.

## Output

Successful registrations are saved to `successful_registrations.txt` in JSON format with the following information:
- Email address
- Wallet address
- Private key
- Username
- Timestamp

## Anti-Detection Features

- Random user agents
- Rotating accept headers
- Random delays between requests
- Browser-like headers
- DNT (Do Not Track) header
- Cache control headers
- Random email and username generation

## Delay Settings

- 2-5 seconds delay before each request
- 5-10 seconds delay between registrations
- Random variations in delays to avoid patterns

## Security

- Proxy authentication support
- Error handling for failed requests
- Secure wallet generation
- No sensitive data logging except in the registration file

## Disclaimer

This bot is for educational purposes only. Please ensure you comply with the platform's terms of service when using automation tools.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
