export enum TokenType {
  // Literal types
  Number,
  Identifier,

  // Keywords
  Let,

  // Groupings & Operators
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  EOF,
}

const KEYWORDS: Record<string, TokenType> = {
  "let": TokenType.Let,
}

export interface Token {
  value: string;
  type: TokenType;
}

/**
 * Helper function to create shape of token
 */
function token(value: string, type: TokenType): Token {
  return {
    value,
    type,
  }
}

/**
 * Verify character is not something Z does not care about
 * @param str - Character being read from file
 */
function isSkippable(str: string) {
  return [' ', '\n', '\t'].includes(str)
}

/**
 * Verify character is alphabetical
 * @param src Character being read from file
 */
function isAlpha(src: string) {
  return src.toUpperCase() !== src.toLowerCase()
}

/**
 * Verify character is an integer
 * @param str - Character being read from file
 */
function isInt(str: string) {
  const c = str.charCodeAt(0)
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]

  return c >= bounds[0] && c <= bounds[1]
}

/**
 * Reads each character individually and generates lexemes
 * @param sourceCode - Takes text from a file to generate token
 */
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>()

  // Split on every single character
  const src = sourceCode.split("")

  // Build each token until end of file
  while (src.length > 0) {
    if (src[0] == '(')
      tokens.push(token(src.shift() as string, TokenType.OpenParen))
    else if (src[0] == ')')
      tokens.push(token(src.shift() as string, TokenType.CloseParen))
    else if (['+', '-', '*', '/'].includes(src[0]))
      tokens.push(token(src.shift() as string, TokenType.BinaryOperator))
    else if (src[0] == '=')
      tokens.push(token(src.shift() as string, TokenType.Equals))
    else {
      // Build number token      
      if (isInt(src[0])) {
        let number = ''
        while (src.length > 0 && isInt(src[0]))
          number += src.shift()

        tokens.push(token(number, TokenType.Number))
      } else if (isAlpha(src[0])) {
        let identifier = ''
        while (src.length > 0 && isAlpha(src[0]))
          identifier += src.shift()

        // Check for reserved keywords
        const reserved = KEYWORDS[identifier]
        if (reserved === undefined)
          tokens.push(token(identifier, TokenType.Identifier))
        else
          tokens.push(token(identifier, reserved))
      } else if (isSkippable(src[0])) {
        src.shift()
      } else {
        console.log(`Unrecognizable character found in source ${src[0]}`)
        Deno.exit(1)
      }
    }
  }

  tokens.push({ value: 'EndOfFile', type: TokenType.EOF })

  return tokens
}

// Testing - Read file and generate tokens
// const source = await Deno.readTextFile('./text.txt')
// for (const token of tokenize(source)) {
//   console.log(token)
// }