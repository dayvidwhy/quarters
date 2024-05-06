import bcrypt from "bcrypt";

/**
 * Takes in a password, returns a hashed password.
 * @param password Users password.
 * @returns {String} Hashed password.
 */
export const hash = async (password: string): Promise<string> => {
    let salt;
    try {
        salt = await bcrypt.genSalt(10);
    } catch (error) {
        throw new Error("Internal server error.");
    }
    let hash;
    try {
        hash = await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Internal server error.");
    }

    return hash;
};

/**
 * Compare users input with stored hash.
 * @param password User supplied password.
 * @param hash Hashed password stored.
 * @returns {Boolean} True if password matches hash, false otherwise.
 */
export const compare = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
