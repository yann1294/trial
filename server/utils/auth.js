import bcrypt from "bcrypt";

// This is a utility class module which has two functions: 
// 1. for hashing password when the user register 
// 2. for comparing the entered password against the saved hash of the actual password

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

// ??? we should hash the entered password first before comparing...to check  
export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed); // boolean
};
