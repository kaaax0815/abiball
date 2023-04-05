export function returnBasedOnEnv<T, K>(opts: { prod: T; dev: K }) {
  return process.env.NODE_ENV === 'production' ? opts.prod : opts.dev;
}
