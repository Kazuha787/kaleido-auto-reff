import chalk from 'chalk';

export function displayBanner() {
    console.log(chalk.cyan(`
  ▗▖ ▗▖ ▗▄▖ ▗▄▄▄▄▖▗▖ ▗▖▗▖ ▗▖ ▗▄▖ 
  ▐▌▗▞▘▐▌ ▐▌   ▗▞▘▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌
  ▐▛▚▖ ▐▛▀▜▌ ▗▞▘  ▐▌ ▐▌▐▛▀▜▌▐▛▀▜▌
  ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▄▖▝▚▄▞▘▐▌ ▐▌▐▌ ▐▌

       ${chalk.yellow('KALEIDO AUTO REFF - BOT')}                
 📢  ${chalk.blue('Telegram Channel: https://t.me/Offical_Im_kazuha')}
    `));
}