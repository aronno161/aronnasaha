const bcrypt = require('bcryptjs');

// Test password verification
const ADMIN_EMAIL = 'aronnosaha161.dopamine@gmail.com';
const ADMIN_PASSWORD_HASH = '$2a$10$UP/Q6twvkQwZ5xWf0tiJ0.Ofj0KNFTTP9VdGAdyNq2yb/w07NZElW';
const testPassword = '@Ronna$1618151311181514141.dopamine';

console.log('Testing password verification...');
console.log('Email:', ADMIN_EMAIL);
console.log('Test password:', testPassword);
console.log('Stored hash:', ADMIN_PASSWORD_HASH);

const isValid = bcrypt.compareSync(testPassword, ADMIN_PASSWORD_HASH);
console.log('Password valid:', isValid);

// Test JWT
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

try {
  const token = jwt.sign(
    { email: ADMIN_EMAIL, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  console.log('JWT token generated successfully');
  console.log('Token length:', token.length);
} catch (error) {
  console.log('JWT error:', error.message);
}