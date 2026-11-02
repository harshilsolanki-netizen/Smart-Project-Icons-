import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'browser.spec.ts',fullyParallel:false,use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://localhost:3000',headless:true,channel:'chrome'},reporter:'list'});
