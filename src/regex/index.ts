export const INTEGER = /^\D$/;
export const email = {
  regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const password = {
  regex: /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?~`]).{8,}$/,
};
export const validCharacter = {
  regex: /^[A-Za-z\s,.'-]+$/,
};
export const onlyCharacters = {
  regex: /^\d*$/,
};
export const numberOnly = {
  regex: /^\d$/,
};
/**
 * City name validation regex
 * Ensures city name starts with a letter (A-Z or a-z)
 * Allows letters, spaces, and hyphens (single quote) after the first character
 */
export const cityName = {
  regex: /^[A-Za-z][A-Za-z-' ]*$/,
};
// eslint-disable-next-line import/no-anonymous-default-export
