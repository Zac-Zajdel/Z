import Parser from "./compiler/parser.ts";

repl()

function repl () {
  const parser = new Parser()

  while (true) {
    const input = prompt("> ");

    // Check for leaving prompt
    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    const program = parser.produceAST(input)
    console.log(program)
  }
}