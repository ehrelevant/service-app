import * as SecureStore from 'expo-secure-store';

import { createAuthClient } from "better-auth/react"
import { expoClient } from '@better-auth/expo/client';
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    expoClient({
      scheme: 'provider-app',
      storagePrefix: 'provider-app',
      storage: SecureStore
    }),
    inferAdditionalFields({
      user: {
        phoneNumber: {
          type: 'string',
          required: true,
          input: true
        },
        middleName: {
          type: 'string',
          required: false,
          input: true
        },
        lastName: {
          type: 'string',
          required: true,
          input: true
        },
      }
    })
  ]
});

