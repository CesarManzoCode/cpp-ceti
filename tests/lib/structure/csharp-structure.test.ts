import { describe, expect, it } from "vitest";

import { checkStructure } from "@/lib/structure";

const check = (contract: unknown, code: string) =>
  checkStructure(contract, code, "csharp");

/**
 * LEARN-01. Cada caso de aceptación del informe: clase/miembro/visibilidad,
 * constructor, relación almacenada vs parámetro, herencia, virtual/override,
 * clase abstracta y static.
 */
describe("contrato estructural de C#", () => {
  it("sin contrato, nada cambia", () => {
    expect(checkStructure(null, "class Foo {}", "csharp").satisfied).toBe(true);
  });

  it("C++ no se ve afectado aunque haya contrato", () => {
    const contract = { classes: [{ name: "Contador" }] };
    expect(checkStructure(contract, "int main(){}", "cpp").satisfied).toBe(true);
  });

  describe("clase, miembro y visibilidad", () => {
    const contract = {
      classes: [
        {
          name: "Contador",
          fields: [{ name: "valor", visibility: "private", type: "int" }],
          methods: [
            { name: "Incrementar", visibility: "public" },
            { name: "Obtener", visibility: "public", returnType: "int" },
          ],
        },
      ],
    };

    it("una solución procedural con la misma salida NO pasa", () => {
      const procedural = `
        using System;
        class Program {
          static void Main() {
            int valor = 0;
            valor++;
            Console.WriteLine(valor);
          }
        }`;
      const result = check(contract, procedural);
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("Falta la clase `Contador`");
    });

    it("la solución de referencia pasa", () => {
      const solution = `
        using System;
        class Contador {
          private int valor;
          public void Incrementar() { valor++; }
          public int Obtener() { return valor; }
        }
        class Program {
          static void Main() {
            Contador c = new Contador();
            c.Incrementar();
            Console.WriteLine(c.Obtener());
          }
        }`;
      expect(check(contract, solution)).toEqual({
        satisfied: true,
        failures: [],
      });
    });

    it("un campo público donde se pidió privado falla con mensaje específico", () => {
      const code = `
        class Contador {
          public int valor;
          public void Incrementar() { valor++; }
          public int Obtener() { return valor; }
        }`;
      const result = check(contract, code);
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("debe ser `private`");
      expect(result.failures[0]).toContain("ahora es `public`");
    });

    it("un campo sin modificador cuenta como privado", () => {
      const code = `
        class Contador {
          int valor;
          public void Incrementar() { valor++; }
          public int Obtener() { return valor; }
        }`;
      expect(check(contract, code).satisfied).toBe(true);
    });

    it("no aprueba por texto dentro de comentarios ni de cadenas", () => {
      const fake = `
        using System;
        // class Contador { private int valor; public void Incrementar() {} }
        class Program {
          static void Main() {
            Console.WriteLine("class Contador { private int valor; }");
          }
        }`;
      expect(check(contract, fake).satisfied).toBe(false);
    });
  });

  describe("constructor", () => {
    const contract = {
      classes: [
        { name: "Cuenta", constructors: [{ paramCount: 2, visibility: "public" }] },
      ],
    };

    it("falta el constructor", () => {
      const result = check(contract, "class Cuenta { public int Saldo; }");
      expect(result.failures[0]).toContain("necesita un constructor");
    });

    it("el número de parámetros importa", () => {
      const result = check(
        contract,
        "class Cuenta { public Cuenta(string titular) { } }",
      );
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("2 parámetros");
    });

    it("un constructor con la firma pedida pasa", () => {
      const code = `
        class Cuenta {
          private string titular;
          private double saldo;
          public Cuenta(string titular, double saldo) {
            this.titular = titular;
            this.saldo = saldo;
          }
        }`;
      expect(check(contract, code).satisfied).toBe(true);
    });
  });

  describe("relación almacenada frente a parámetro", () => {
    const contract = {
      classes: [{ name: "Cotizador", stores: [{ type: "Bicicleta" }] }],
    };

    it("recibirlo por parámetro no basta", () => {
      const code = `
        class Bicicleta { public double Tarifa; }
        class Cotizador {
          public double Cotizar(Bicicleta bici, int horas) { return bici.Tarifa * horas; }
        }`;
      const result = check(contract, code);
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("GUARDAR");
    });

    it("un campo de ese tipo sí lo satisface", () => {
      const code = `
        class Bicicleta { public double Tarifa; }
        class Cotizador {
          private Bicicleta bici;
          public Cotizador(Bicicleta bici) { this.bici = bici; }
        }`;
      expect(check(contract, code).satisfied).toBe(true);
    });

    it("una colección del tipo también cuenta", () => {
      const code = `
        class Bicicleta { }
        class Cotizador { private List<Bicicleta> flota = new List<Bicicleta>(); }`;
      expect(check(contract, code).satisfied).toBe(true);
    });
  });

  describe("herencia, virtual/override, abstract y static", () => {
    it("exige la relación es-un", () => {
      const contract = { classes: [{ name: "Ahorro", extends: "Cuenta" }] };
      expect(check(contract, "class Ahorro { }").failures[0]).toContain(
        "debe heredar de `Cuenta`",
      );
      expect(check(contract, "class Ahorro : Cuenta { }").satisfied).toBe(true);
    });

    it("exige virtual en la base y override en la derivada", () => {
      const contract = {
        classes: [
          { name: "Animal", methods: [{ name: "Hablar", virtual: true }] },
          {
            name: "Perro",
            extends: "Animal",
            methods: [{ name: "Hablar", override: true }],
          },
        ],
      };
      const sinPolimorfismo = `
        class Animal { public void Hablar() { } }
        class Perro : Animal { public void Hablar() { } }`;
      const result = check(contract, sinPolimorfismo);
      expect(result.failures).toHaveLength(2);
      expect(result.failures[0]).toContain("`virtual`");
      expect(result.failures[1]).toContain("`override`");

      const conPolimorfismo = `
        class Animal { public virtual void Hablar() { } }
        class Perro : Animal { public override void Hablar() { } }`;
      expect(check(contract, conPolimorfismo).satisfied).toBe(true);
    });

    it("exige clase abstracta y método abstracto", () => {
      const contract = {
        classes: [
          {
            name: "Figura",
            abstract: true,
            methods: [{ name: "Area", abstract: true, returnType: "double" }],
          },
        ],
      };
      expect(
        check(contract, "class Figura { public double Area() { return 0; } }")
          .satisfied,
      ).toBe(false);
      expect(
        check(
          contract,
          "abstract class Figura { public abstract double Area(); }",
        ).satisfied,
      ).toBe(true);
    });

    it("exige static donde la responsabilidad es de la clase", () => {
      const contract = {
        classes: [
          {
            name: "Reserva",
            fields: [{ name: "total", static: true }],
            methods: [{ name: "Contar", static: true }],
          },
        ],
      };
      const deInstancia = `
        class Reserva {
          private int total;
          public int Contar() { return total; }
        }`;
      expect(check(contract, deInstancia).failures).toHaveLength(2);

      const deClase = `
        class Reserva {
          private static int total;
          public static int Contar() { return total; }
        }`;
      expect(check(contract, deClase).satisfied).toBe(true);
    });

    it("el constructor encadenado con base se detecta", () => {
      const contract = {
        classes: [
          { name: "Ahorro", extends: "Cuenta", constructors: [{ callsBase: true }] },
        ],
      };
      expect(
        check(contract, "class Ahorro : Cuenta { public Ahorro(string t) { } }")
          .failures[0],
      ).toContain("base(...)");
      expect(
        check(
          contract,
          "class Ahorro : Cuenta { public Ahorro(string t) : base(t) { } }",
        ).satisfied,
      ).toBe(true);
    });
  });

  describe("propiedades", () => {
    it("distingue propiedad de campo", () => {
      const contract = {
        classes: [
          {
            name: "Alumno",
            properties: [{ name: "Nombre", visibility: "public", type: "string" }],
          },
        ],
      };
      expect(
        check(contract, "class Alumno { public string Nombre; }").satisfied,
      ).toBe(false);
      expect(
        check(contract, "class Alumno { public string Nombre { get; set; } }")
          .satisfied,
      ).toBe(true);
      expect(
        check(
          contract,
          "class Alumno { private string nombre; public string Nombre => nombre; }",
        ).satisfied,
      ).toBe(true);
    });
  });
});

describe("dependencia: la clase NO debe guardar la referencia", () => {
  const contract = {
    classes: [
      {
        name: "Notificador",
        notStores: [{ type: "Mensaje" }],
        methods: [{ name: "Enviar", paramCount: 1 }],
      },
    ],
  };

  it("guardarla convierte la dependencia en asociación y falla", () => {
    const code = `
      class Mensaje { public string Texto; }
      class Notificador {
        private Mensaje ultimo;
        public void Enviar(Mensaje mensaje) { ultimo = mensaje; }
      }`;
    const result = checkStructure(contract, code, "csharp");
    expect(result.satisfied).toBe(false);
    expect(result.failures[0]).toContain("NO debe guardar");
  });

  it("usarla sólo como parámetro pasa", () => {
    const code = `
      class Mensaje { public string Texto; }
      class Notificador {
        public void Enviar(Mensaje mensaje) { System.Console.WriteLine(mensaje.Texto); }
      }`;
    expect(checkStructure(contract, code, "csharp").satisfied).toBe(true);
  });
});
