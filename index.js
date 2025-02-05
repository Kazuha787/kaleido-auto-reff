import axios from 'axios';
import fs from 'fs/promises';
import readline from 'readline';
import { Web3 } from 'web3';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import UserAgent from 'user-agents';
import chalk from 'chalk';
import { displayBanner } from './banner.js';

const web3 = new Web3();

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Load proxies from file
async function loadProxies() {
    try {
        const data = await fs.readFile('proxy.txt', 'utf8');
        return data.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'));
    } catch (error) {
        console.log(chalk.yellow('📝 No proxy.txt found or empty file. Using direct connection.'));
        return [];
    }
}

// Parse proxy string and create agent
function createProxyAgent(proxy) {
    try {
        const [protocol, host, port, username, password] = proxy.split(':');
        const proxyUrl = username && password 
            ? `${protocol}://${username}:${password}@${host}:${port}`
            : `${protocol}://${host}:${port}`;

        return protocol.includes('socks') 
            ? new SocksProxyAgent(proxyUrl)
            : new HttpsProxyAgent(proxyUrl);
    } catch (error) {
        console.log(chalk.red(`❌ Invalid proxy format: ${proxy}`));
        return null;
    }
}

// Generate random delay
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Generate random email with improved randomness
function generateRandomEmail() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 5) + 8; // 8-12 characters
    const username = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
}

// Generate random username with improved variety
function generateRandomUsername() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const prefixes = ['0x', 'eth_', 'crypto_', 'defi_', 'web3_', 'nft_', 'meta_'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const length = Math.floor(Math.random() * 5) + 6; // 6-10 characters
    const username = Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    return `${prefix}${username}`;
}

// Generate Ethereum wallet
function generateEthWallet() {
    const account = web3.eth.accounts.create();
    return {
        address: account.address,
        privateKey: account.privateKey
    };
}

// Anti-detection headers generator
function generateHeaders(refCode) {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    const languages = ['en-US,en;q=0.9', 'en-GB,en;q=0.8', 'en-CA,en;q=0.7'];
    const acceptHeaders = [
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    ];

    return {
        'accept': acceptHeaders[Math.floor(Math.random() * acceptHeaders.length)],
        'accept-language': languages[Math.floor(Math.random() * languages.length)],
        'accept-encoding': 'gzip, deflate, br',
        'content-type': 'application/json',
        'origin': 'https://kaleidofinance.xyz',
        'referer': `https://kaleidofinance.xyz/testnet?ref=${refCode}`,
        'user-agent': userAgent.toString(),
        'sec-ch-ua': '"Not A(Brand";v="99", "Chromium";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': userAgent.data.platform,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'dnt': '1',
        'cache-control': 'no-cache',
        'pragma': 'no-cache'
    };
}

// Register single account
async function registerAccount(refCode, proxyList) {
    const url = 'https://kaleidofinance.xyz/api/testnet/register';
    const wallet = generateEthWallet();
    const headers = generateHeaders(refCode);

    let proxyAgent = null;
    if (proxyList.length > 0) {
        const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
        proxyAgent = createProxyAgent(proxy);
        if (!proxyAgent) {
            return false;
        }
        console.log(chalk.cyan(`🌐 Using proxy: ${proxy}`));
    }

    const registrationData = {
        email: generateRandomEmail(),
        walletAddress: wallet.address,
        socialTasks: {
            twitter: true,
            telegram: true,
            discord: true
        },
        agreedToTerms: true,
        referralCode: "",
        referralCount: 0,
        referralBonus: 0,
        xUsername: generateRandomUsername(),
        referredBy: refCode
    };

    try {
        // Random delay before request
        const delay = getRandomDelay(2000, 5000);
        await new Promise(resolve => setTimeout(resolve, delay));

        const axiosConfig = {
            headers,
            ...(proxyAgent && { httpsAgent: proxyAgent })
        };

        const response = await axios.post(url, registrationData, axiosConfig);

        if (response.status === 201) {
            const registrationInfo = {
                email: registrationData.email,
                wallet_address: wallet.address,
                private_key: wallet.privateKey,
                username: registrationData.xUsername,
                timestamp: new Date().toISOString()
            };

            await fs.appendFile(
                'successful_registrations.txt',
                JSON.stringify(registrationInfo) + '\n'
            );

            console.log(chalk.green('\n✅ Successfully registered account:'));
            console.log(chalk.cyan(`📧 Email: ${registrationData.email}`));
            console.log(chalk.cyan(`👛 Wallet: ${wallet.address}`));
            console.log(chalk.cyan(`🔑 Private Key: ${wallet.privateKey}`));
            console.log(chalk.cyan(`📱 Username: ${registrationData.xUsername}`));
            return true;
        } else {
            console.log(chalk.red(`\n❌ Registration failed with status code: ${response.status}`));
            console.log(chalk.red(`Response: ${response.data}`));
            return false;
        }
    } catch (error) {
        console.log(chalk.red(`\n❌ Error during registration: ${error.message}`));
        return false;
    }
}

// Main function
async function main() {
    try {
        // Display banner
        displayBanner();

        // Load proxies
        const proxyList = await loadProxies();
        console.log(chalk.cyan(`📡 Loaded ${proxyList.length} proxies`));

        // Get user input
        let refCode = await question(chalk.green('\n📋 Enter your referral code: '));
        while (!refCode.trim()) {
            console.log(chalk.red('❌ Referral code cannot be empty. Please try again.'));
            refCode = await question(chalk.green('📋 Enter your referral code: '));
        }

        let numAccounts;
        while (true) {
            const input = await question(chalk.green('🔢 Enter number of accounts to register: '));
            numAccounts = parseInt(input);
            if (!isNaN(numAccounts) && numAccounts > 0) break;
            console.log(chalk.red('❌ Please enter a valid number greater than 0.'));
        }

        console.log(chalk.cyan('\n🚀 Starting registration process...'));
        console.log(chalk.cyan(`📊 Target: ${numAccounts} accounts using referral code: ${refCode}`));
        console.log(chalk.cyan('-------------------------------------------'));

        let successful = 0;
        for (let i = 0; i < numAccounts; i++) {
            console.log(chalk.yellow(`\n⏳ Attempting registration ${i + 1}/${numAccounts}`));
            if (await registerAccount(refCode, proxyList)) {
                successful++;
            }
            // Random delay between registrations
            const delay = getRandomDelay(5000, 10000);
            console.log(chalk.yellow(`⏳ Waiting ${delay/1000} seconds before next registration...`));
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.log(chalk.green('\n=== Registration Summary ==='));
        console.log(chalk.cyan('-------------------------------------------'));
        console.log(chalk.green(`✅ Successfully registered: ${successful}/${numAccounts} accounts`));
        console.log(chalk.cyan(`📁 Details saved to: successful_registrations.txt`));
        console.log(chalk.cyan('-------------------------------------------'));

    } catch (error) {
        console.log(chalk.red(`\n❌ An unexpected error occurred: ${error.message}`));
    } finally {
        console.log(chalk.green('\n✨ Thank you for using the registration bot!'));
        rl.close();
    }
}

// Start the program
main();