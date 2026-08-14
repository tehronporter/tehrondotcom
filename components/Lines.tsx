import { Fragment } from "react";

/**
 * Renders an array of strings as hard-broken lines — how the display type is set.
 *
 * The space before each <br> is deliberate: it collapses to nothing at the end
 * of a line, but it's what keeps the words apart wherever a stylesheet drops the
 * break to run the lockup on one line (mobile card titles do exactly that).
 */
export function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              {" "}
              <br />
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
