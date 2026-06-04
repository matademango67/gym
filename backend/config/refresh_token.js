// Import the crypto module from Node.js for cryptographic operations
import crypto from 'crypto'

// Export a function that generates a unique refresh token
export function generateRefreshToken(){
    // Generate 64 random bytes and convert them to a hexadecimal string for use as a token
    return crypto.randomBytes(64).toString('hex')
}

// Export a function that hashes a token for secure storage
export function hashToken(token){
    // Create a SHA256 hash of the token and return it as a hexadecimal string
    return crypto.createHash('sha256').update(token).digest('hex')
}