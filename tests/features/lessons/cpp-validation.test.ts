import { describe, expect, it } from "vitest";

import {
  canonicalizeCpp,
  isBlankCorrect,
} from "@/features/lessons/lib/cpp-validation";
import type { FillBlankStepContent } from "@/features/lessons/types";

type Blank = FillBlankStepContent["blanks"][number];

describe("canonicalizeCpp", () => {
  it("iguala variantes de whitespace alrededor de operadores", () => {
    expect(canonicalizeCpp("<<endl")).toBe(canonicalizeCpp("<< endl"));
    expect(canonicalizeCpp("<<  endl")).toBe(canonicalizeCpp("<< endl"));
    expect(canonicalizeCpp("i<=3")).toBe(canonicalizeCpp("i <= 3"));
    expect(canonicalizeCpp("cin>>edad")).toBe(canonicalizeCpp("cin >> edad"));
  });

  it("conserva el espacio obligatorio entre palabras", () => {
    expect(canonicalizeCpp("else  if")).toBe(canonicalizeCpp("else if"));
    expect(canonicalizeCpp("elseif")).not.toBe(canonicalizeCpp("else if"));
    expect(canonicalizeCpp("intx")).not.toBe(canonicalizeCpp("int x"));
  });

  it("NO toca el interior de literales de cadena o caracter", () => {
    expect(canonicalizeCpp('"Hola  mundo"')).toBe('"Hola  mundo"');
    expect(canonicalizeCpp('"%i %i"')).not.toBe(canonicalizeCpp('"%i%i"'));
    expect(canonicalizeCpp("' '")).toBe("' '");
    expect(canonicalizeCpp('<<"\\n"')).toBe(canonicalizeCpp('<< "\\n"'));
  });
});

describe("isBlankCorrect", () => {
  it("acepta variantes de whitespace válidas de C++ (bug del << endl)", () => {
    const blank: Blank = { answer: "<< endl", hint: "" };
    expect(isBlankCorrect(blank, "<< endl", [])).toBe(true);
    expect(isBlankCorrect(blank, "<<endl", [])).toBe(true);
    expect(isBlankCorrect(blank, "  <<   endl ", [])).toBe(true);
    expect(isBlankCorrect(blank, "<< end", [])).toBe(false);
  });

  it('acepta `<<"\\n"` para la respuesta `<< "\\n"`', () => {
    const blank: Blank = { answer: '<< "\\n"', hint: "" };
    expect(isBlankCorrect(blank, '<<"\\n"', [])).toBe(true);
    expect(isBlankCorrect(blank, '<< "\\n"', [])).toBe(true);
    expect(isBlankCorrect(blank, '<< "\\\\n "', [])).toBe(false);
  });

  it("sigue exigiendo el contenido exacto dentro de strings", () => {
    const blank: Blank = { answer: '"%i %i %i"', hint: "" };
    expect(isBlankCorrect(blank, '"%i%i%i"', [])).toBe(false);
    expect(isBlankCorrect(blank, '"%i %i %i"', [])).toBe(true);
  });

  it("respeta pattern cuando existe", () => {
    const blank: Blank = {
      answer: '"%i %i %i"',
      pattern: '"%i ?%i ?%i"',
      hint: "",
    };
    expect(isBlankCorrect(blank, '"%i%i%i"', [])).toBe(true);
    expect(isBlankCorrect(blank, '"%i  %i  %i"', [])).toBe(false);
  });

  it("mantiene la regla de matchBlank sin cambios", () => {
    const blank: Blank = { answer: "", matchBlank: 0, hint: "" };
    expect(isBlankCorrect(blank, "edad", ["edad"])).toBe(true);
    expect(isBlankCorrect(blank, "edad", ["otra"])).toBe(false);
  });
});
