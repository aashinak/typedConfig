// typedConfig.ts
import dotenv from 'dotenv';

dotenv.config();

class TypedConfig {
  private config: Record<string, any>;

  constructor(schema: Record<string, string>) {
    this.config = {};
    this.loadConfig(schema);
  }

  private loadConfig(schema: Record<string, string>) {
    for (const [key, type] of Object.entries(schema)) {
      const value = process.env[key];
      
      if (!value) throw new Error(`Missing environment variable: ${key}`);
      
      this.config[key] = this.castType(key, value, type);
    }
  }

  private castType(key: string, value: string, type: string) {
    switch (type) {
      case 'string':
        return value;
      case 'number':
        const num = Number(value);
        if (isNaN(num)) throw new Error(`Environment variable ${key} should be a number`);
        return num;
      case 'boolean':
        return value === 'true';
      default:
        throw new Error(`Invalid type for environment variable ${key}`);
    }
  }

  get<T>(key: string): T {
    if (!(key in this.config)) throw new Error(`Unknown config key: ${key}`);
    return this.config[key] as T;
  }
}



export default TypedConfig;
