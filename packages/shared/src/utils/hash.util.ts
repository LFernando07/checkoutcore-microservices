import * as bcrypt from 'bcrypt';

export const compareWithHashString = async (
  plainStr: string,
  hashedStr: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainStr, hashedStr);
  return isMatch;
};

export const hashString = async (str: string): Promise<string> => {
  const saltRounds = 10; // Define the cost factor for hashing

  return await bcrypt.hash(str, saltRounds);
};
