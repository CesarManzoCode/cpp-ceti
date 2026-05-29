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
          background: "#0d1014",
          color: "#e9eaee",
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
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#7185f0",
                color: "#0e1430",
                fontWeight: 700,
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
          <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 20 }}>
            Hubo un error inesperado. Intenta recargar la página.
          </p>
          {error?.digest ? (
            <p
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: 11,
                color: "#6b7280",
                marginBottom: 20,
              }}
            >
              ref: {error.digest}
            </p>
          ) : null}
          <button
            onClick={reset}
            style={{
              background: "#7185f0",
              color: "#0e1430",
              border: 0,
              padding: "10px 18px",
              borderRadius: 10,
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
