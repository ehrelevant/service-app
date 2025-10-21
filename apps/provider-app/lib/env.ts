import 'dotenv/config';
import { parse, string } from 'valibot';

export const API_URL = parse(string(), process.env.API_URL);