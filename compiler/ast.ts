// deno-lint-ignore-file no-empty-interface
export type NodeType = 
  'Program'
  | 'NumericLiteral'
  | 'Identifier'
  | 'BinaryExpr';

// Abstract type
export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: 'Program';
  body: Stmt[];
}

// Abstract type
export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: 'BinaryExpr';
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: 'NumericLiteral';
  value: number;
}