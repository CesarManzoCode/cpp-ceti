"use client";

/**
 * Last-resort error boundary. Renders its own <html>/<body> because
 * it can fire before the root layout renders.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-MX">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#14171e",
          color: "#f2f2f0",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 22,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "-0.01em",
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 34,
                height: 26,
                borderRadius: 2,
                background: "#8fa8ee",
                color: "#131a2b",
                fontWeight: 600,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 11,
              }}
            >
              C++
            </span>
            <span>CETI</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Algo salió mal
          </h1>
          <p style={{ color: "#a3a8b4", fontSize: 14, marginBottom: 20 }}>
            Hubo un error inesperado. Intenta recargar la página.
          </p>
          {error?.digest ? (
            <p
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 11,
                color: "#767c8a",
                marginBottom: 20,
              }}
            >
              ref: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              background: "#8fa8ee",
              color: "#131a2b",
              border: 0,
              padding: "10px 18px",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
