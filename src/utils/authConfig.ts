// authConfig.ts
export const authConfig = {
  issuer: 'https://keepsafeb2c.b2clogin.com/keepsafeb2c.onmicrosoft.com/v2.0/',
  clientId: '2b3f480e-0f2b-4d12-a9f5-094ca6ec78e2',
  redirectUrl: 'keepsafenigeria://auth',
  scopes: [
    'openid',
    'profile',
    'offline_access',
    '2b3f480e-0f2b-4d12-a9f5-094ca6ec78e2',
  ],
  serviceConfiguration: {
    authorizationEndpoint:
      'https://keepsafeb2c.b2clogin.com/keepsafeb2c.onmicrosoft.com/B2C_1_dev/oauth2/v2.0/authorize',
    tokenEndpoint:
      'https://keepsafeb2c.b2clogin.com/keepsafeb2c.onmicrosoft.com/B2C_1_dev/oauth2/v2.0/token',
    revocationEndpoint:
      'https://keepsafeb2c.b2clogin.com/keepsafeb2c.onmicrosoft.com/B2C_1_dev/oauth2/v2.0/logout',
  },
};
