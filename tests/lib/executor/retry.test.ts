import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { fetchWithRetry } from "@/lib/executor/retry";

describe("fetchWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  async function flush(ms: number) {
    // Avanza el reloj y deja correr microtasks pendientes entre intentos.
    await vi.advanceTimersByTimeAsync(ms);
  }

  it("devuelve la primera respuesta cuando es 2xx", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await fetchWithRetry("/x", {}, { label: "t" });
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reintenta hasta 3 veces en 503 y luego devuelve la última", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response("", { status: 503 }));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t" });
    await flush(2_000);
    const res = await promise;

    expect(res.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retorna éxito en cuanto algún intento es 2xx", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 502 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t" });
    await flush(500);
    const res = await promise;

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("NO reintenta en 4xx (cliente)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t" });
    await flush(2_000);
    const res = await promise;

    expect(res.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reintenta en error de red (fetch rechaza)", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("ECONNRESET"))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t" });
    await flush(500);
    const res = await promise;

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("lanza si todos los intentos rechazan", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t" });
    // Capturar el reject antes de avanzar timers para no romper el unhandled.
    const settle = promise.catch((e) => e);
    await flush(2_000);
    const err = await settle;

    expect(err).toBeInstanceOf(Error);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("respeta el número de attempts custom", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchWithRetry("/x", {}, { label: "t", attempts: 5 });
    await flush(10_000);
    await promise;

    expect(fetchMock).toHaveBeenCalledTimes(5);
  });
});
