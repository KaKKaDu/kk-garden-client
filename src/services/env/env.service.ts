import { handleError, type SuccessDataAny } from '@kk-garden/shared/errors';
import { clientEnvSchema, type ClientEnvVariable } from '../../../env-vars/env.schema';

export type EnvValueData = {
  value: string | null;
};

export type EnvValueResult = SuccessDataAny<EnvValueData>;

export type EnvVariableFormatter = (value: string | null) => string | null;

const clientEnvValues: Record<ClientEnvVariable, string | undefined> = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};
const parsedClientEnv = clientEnvSchema.safeParse(clientEnvValues);

export class EnvService {
  public getRawEnvValue(variable: ClientEnvVariable): EnvValueResult {
    try {
      if (!parsedClientEnv.success) {
        throw new Error(parsedClientEnv.error.message);
      }

      return { success: true, data: { value: parsedClientEnv.data[variable] ?? null } };
    } catch (error: unknown) {
      return handleError(error);
    }
  }

  public getFormattedEnvValue(
    variable: ClientEnvVariable,
    formatter: EnvVariableFormatter,
  ): EnvValueResult {
    try {
      const rawValueResult: EnvValueResult = this.getRawEnvValue(variable);

      if (!rawValueResult.success) {
        throw new Error(rawValueResult.errors[0]?.message ?? 'Environment value lookup failed.');
      }

      if (rawValueResult.data === undefined) {
        throw new Error('Environment value lookup returned no data.');
      }

      return { success: true, data: { value: formatter(rawValueResult.data.value) } };
    } catch (error: unknown) {
      return handleError(error);
    }
  }
}
