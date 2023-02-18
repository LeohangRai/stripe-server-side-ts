import { number, object, string } from 'zod';
import { findUserByEmail } from '../services/user.service';

export const createUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' })
      .min(8, 'Username must have at least 8 characters')
      .max(20, 'Username should not exceed 20 characters')
      .regex(/^[a-z][a-z0-9_]{7,19}$/, 'Invalid username'),

    email: string({
      required_error: 'Email is required'
    })
      .email()
      .refine(isUniqueEmail, { message: 'Email must be unique' }),

    age: number({
      invalid_type_error: 'Age must be a number'
    }).optional()
  })
});

async function isUniqueEmail(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  console.log('user:', user);

  return user == null;
}
