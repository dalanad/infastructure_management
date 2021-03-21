import { createCipheriv, createDecipheriv, randomFill, scryptSync } from 'crypto';

const algorithm = 'aes-192-cbc';
const password = '9bejJHkZScfVPVhT7n5XzWxTqh9Bcj';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).    
const key = scryptSync(password, 'salt', 24);

export function encrypt(sourceData: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Then, we'll generate a random initialization vector
        randomFill(new Uint8Array(16), (err, iv) => {
            if (err) reject(err);
            const cipher = createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(sourceData, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            console.log(encrypted)
            resolve(encrypted);
        });
    });
}

export function decrypt(encrypted: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            // The IV is usually passed along with the ciphertext.
            const iv = Buffer.alloc(16, 0); // Initialization vector.
            const decipher = createDecipheriv(algorithm, key, iv);
            // Encrypted using same algorithm, key and iv.
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            resolve(decrypted);
        }
        catch {
            reject(new Error("INVALID"))
        }
    });
}

export function hash(s: string) {
    const salt = "30759e08a8edb63bd63d3f04158d01f3"
    return scryptSync(password, salt, 32).toString("hex");
}

export * from './collapseRange';
export * from './parseCookies';

