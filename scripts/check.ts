import { execSync } from 'node:child_process';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';

const runCheck = (command: string, label: string): boolean => {
  const spinner: Ora = ora(label).start();

  try {
    execSync(command, { stdio: 'inherit' });
    spinner.succeed(chalk.green(`${label} passed`));
    return true;
  } catch (error: unknown) {
    spinner.fail(chalk.red(`${label} failed`));
    console.error(error instanceof Error ? error.message : error);
    return false;
  }
};

console.log(chalk.blue.bold('Code checks\n'));

const lintSucceeded: boolean = runCheck('npm run lint', 'ESLint');
const typescriptSucceeded: boolean = runCheck('npm run typescript', 'TypeScript');

if (!lintSucceeded || !typescriptSucceeded) {
  process.exitCode = 1;
} else {
  console.log(chalk.blue.bold('\nAll checks passed\n'));
}
