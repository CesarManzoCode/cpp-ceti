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

  describe("accessors de propiedad (private set)", () => {
    const contract = {
      classes: [
        {
          name: "Pedido",
          properties: [
            { name: "Folio", visibility: "public", type: "int", setVisibility: "private" },
          ],
        },
      ],
    };

    it("`{ get; set; }` público NO satisface un `private set` exigido", () => {
      const result = check(
        contract,
        "class Pedido { public int Folio { get; set; } }",
      );
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("`set`");
      expect(result.failures[0]).toContain("`private`");
      expect(result.failures[0]).toContain("ahora es `public`");
    });

    it("una propiedad sin setter (sólo get) tampoco satisface `private set`", () => {
      const soloLectura = `
        class Pedido {
          private int folio;
          public int Folio { get { return folio; } }
        }`;
      const result = check(contract, soloLectura);
      expect(result.satisfied).toBe(false);
      expect(result.failures[0]).toContain("no tiene setter");
    });

    it("un cuerpo de expresión (`=>`) tampoco tiene setter", () => {
      const expresion = `
        class Pedido {
          private int folio;
          public int Folio => folio;
        }`;
      expect(check(contract, expresion).satisfied).toBe(false);
    });

    it("`{ get; private set; }` sí satisface el requisito", () => {
      const code = "class Pedido { public int Folio { get; private set; } }";
      expect(check(contract, code)).toEqual({ satisfied: true, failures: [] });
    });

    it("el orden `{ private set; get; }` también cuenta", () => {
      const code = "class Pedido { public int Folio { private set; get; } }";
      expect(check(contract, code).satisfied).toBe(true);
    });

    it("contratos previos sin setVisibility no se ven afectados", () => {
      const contratoViejo = {
        classes: [
          { name: "Pedido", properties: [{ name: "Folio", visibility: "public" }] },
        ],
      };
      expect(
        checkStructure(
          contratoViejo,
          "class Pedido { public int Folio { get; set; } }",
          "csharp",
        ).satisfied,
      ).toBe(true);
    });
  });

  describe("genéricos", () => {
    it("exige aridad de tipo en la clase", () => {
      const contract = { classes: [{ name: "Caja", generic: { arity: 1 } }] };
      expect(check(contract, "class Caja { private object valor; }").failures[0]).toContain(
        "genérica",
      );
      expect(check(contract, "class Caja<T> { private T valor; }").satisfied).toBe(
        true,
      );
    });

    it("una sobrecarga no-genérica por tipo no basta", () => {
      const contract = { classes: [{ name: "Caja", generic: { arity: 1 } }] };
      const sobrecargada = `
        class Caja {
          private int valorInt;
          private string valorStr;
        }`;
      expect(check(contract, sobrecargada).satisfied).toBe(false);
    });

    it("exige la restricción `where T : Entidad`", () => {
      const contract = {
        classes: [
          {
            name: "Repositorio",
            generic: { arity: 1, constraints: [{ param: "T", types: ["Entidad"] }] },
          },
        ],
      };
      const sinRestriccion = "class Repositorio<T> { }";
      expect(check(contract, sinRestriccion).failures[0]).toContain(
        "where T : Entidad",
      );

      const conRestriccion = "class Repositorio<T> where T : Entidad { }";
      expect(check(contract, conRestriccion).satisfied).toBe(true);

      const conOtraRestriccion = "class Repositorio<T> where T : IComparable<T> { }";
      expect(check(contract, conOtraRestriccion).satisfied).toBe(false);
    });

    it("método genérico propio: `Primero<T>` no se puede reemplazar por sobrecargas", () => {
      const contract = {
        classes: [
          {
            name: "Program",
            methods: [{ name: "Primero", generic: { arity: 1 } }],
          },
        ],
      };
      const conSobrecargas = `
        class Program {
          static string Primero(System.Collections.Generic.List<string> d) { return d[0]; }
          static int Primero(System.Collections.Generic.List<int> d) { return d[0]; }
        }`;
      expect(check(contract, conSobrecargas).satisfied).toBe(false);

      const generico = `
        class Program {
          static T Primero<T>(System.Collections.Generic.List<T> datos) { return datos[0]; }
        }`;
      expect(check(contract, generico).satisfied).toBe(true);
    });
  });

  describe("requiresConstructs: exige el uso real de un constructo", () => {
    it("exige Thread/Join dentro de la clase indicada", () => {
      const contract = {
        classes: [{ name: "Program", requiresConstructs: ["Thread", "Join"] }],
      };
      const sinHilos = `
        class Program {
          static void Main() { System.Console.WriteLine(42); }
        }`;
      const result = check(contract, sinHilos);
      expect(result.satisfied).toBe(false);
      expect(result.failures.some((f) => f.includes("Thread"))).toBe(true);
      expect(result.failures.some((f) => f.includes("Join"))).toBe(true);

      const conHilos = `
        class Program {
          static void Main() {
            System.Threading.Thread t = new System.Threading.Thread(() => {});
            t.Start();
            t.Join();
          }
        }`;
      expect(check(contract, conHilos).satisfied).toBe(true);
    });

    it("el candado debe pertenecer a la clase de dominio, no a Program", () => {
      const contract = {
        classes: [
          { name: "Inventario", requiresConstructs: ["lock"] },
          { name: "Program", requiresConstructs: ["Thread", "Join"] },
        ],
      };
      const candadoEnProgram = `
        class Inventario {
          private int stock;
          public void Ajustar(int c) { stock += c; }
        }
        class Program {
          static readonly object candado = new object();
          static Inventario inv = new Inventario();
          static void Worker() { lock (candado) { inv.Ajustar(1); } }
          static void Main() {
            System.Threading.Thread t = new System.Threading.Thread(Worker);
            t.Start();
            t.Join();
          }
        }`;
      const result = check(contract, candadoEnProgram);
      expect(result.satisfied).toBe(false);
      expect(result.failures.some((f) => f.includes("Inventario") && f.includes("lock"))).toBe(
        true,
      );

      const candadoEnInventario = `
        class Inventario {
          private int stock;
          private readonly object candado = new object();
          public void Ajustar(int c) { lock (candado) { stock += c; } }
        }
        class Program {
          static Inventario inv = new Inventario();
          static void Main() {
            System.Threading.Thread t = new System.Threading.Thread(() => inv.Ajustar(1));
            t.Start();
            t.Join();
          }
        }`;
      expect(check(contract, candadoEnInventario).satisfied).toBe(true);
    });

    it("no aprueba por la palabra dentro de un comentario o string", () => {
      const contract = { classes: [{ name: "Program", requiresConstructs: ["lock"] }] };
      const falso = `
        class Program {
          // usa lock aquí
          static void Main() { System.Console.WriteLine("lock"); }
        }`;
      expect(check(contract, falso).satisfied).toBe(false);
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
