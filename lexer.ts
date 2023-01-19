export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
}

const KEYWORDS: Record<string, TokenType> = {
  "let": TokenType.Let,
}

export interface Token {
  value: string;
  type: TokenType;
}

function token(value: string, type: TokenType): Token {
  return {
    value,
    type,
  }
}

function isSkippable(str: string) {
  return [' ', '\n', '\t'].includes(str)
}

function isAlpha(src: string) {
  return src.toUpperCase() !== src.toLowerCase()
}

function isInt(str: string) {
  const c = str.charCodeAt(0)
  const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]

  return c >= bounds[0] && c <= bounds[1]
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>()

  // Splt on every single character
  const src = sourceCode.split("")

  // Build each token until end of file
  while (src.length > 0) {
    if (src[0] == '(')
      tokens.push(token(src.shift(), TokenType.OpenParen))
    else if (src[0] == ')')
      tokens.push(token(src.shift(), TokenType.CloseParen))
    else if (['+', '-', '*', '/'].includes(src[0]))
      tokens.push(token(src.shift(), TokenType.BinaryOperator))
    else if (src[0] == '=')
      tokens.push(token(src.shift(), TokenType.Equals))
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
        console.log(`Urecognizable character found in source ${src[0]}`)
        Deno.exit(1)
      }
    }
  }

  return tokens
}

const source = await Deno.readTextFile('./text.txt')
for (const token of tokenize(source)) {
  console.log(token)
}