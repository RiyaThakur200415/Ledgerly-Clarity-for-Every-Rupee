import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'ledgerly_secret_key_financial_clarity_2026',
  jwtExpiresIn: '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};
