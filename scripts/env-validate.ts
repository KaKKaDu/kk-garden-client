import { loadEnvConfig } from '@next/env';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { clientEnvSchema } from '../env-vars/env.schema';

const validateEnvironment = (): boolean => {
  const spinner: Ora = ora('Validating environment variables...').start();

  try {
    const isDevelopment: boolean = process.argv.includes('--dev');
    loadEnvConfig(process.cwd(), isDevelopment);

    const environmentResult = clientEnvSchema.safeParse(process.env);

    if (!environmentResult.success) {
      throw new Error(environmentResult.error.message);
    }

    spinner.succeed(chalk.green('Environment variables are valid'));
    return true;
  } catch (error: unknown) {
    spinner.fail(chalk.red('Environment validation failed'));
    console.log('\n');
    console.log(error instanceof Error ? error.message : error);
    return false;
  }
};

console.log(chalk.blue.bold('Environment Validation\n'));

const isValid: boolean = validateEnvironment();

if (!isValid) {
  console.log(chalk.red.bold('\nPlease fix the environment variables\n'));
  process.exitCode = 1;
} else {
  console.log(chalk.blue.bold('\nEnvironment is properly configured\n'));
}
