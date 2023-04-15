import type { DecodeContinuouslyCallback, Result } from '@zxing/library';
import { BrowserAztecCodeReader } from '@zxing/library';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export type UseZxingProps = {
  onResult: (result: Result) => void;
  paused: boolean;
};

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: 'environment'
  }
};

const DEFAULT_TIME_BETWEEN_SCANS = 300;
const DEFAULT_TIME_BETWEEN_DECODING_ATTEMPTS = 300;

/**
 * Use Zxing Aztec Code Reader
 * @author <https://dev.to/zodiapps/how-to-scan-barcodes-in-your-reactjs-application-2668>
 * @author <https://github.com/adamalfredsson/react-zxing>
 */
export default function useZxing({ onResult, paused }: UseZxingProps) {
  const resultHandlerRef = useRef(onResult);
  const ref = useRef<HTMLVideoElement>(null);

  const decodeCallback = useCallback<DecodeContinuouslyCallback>((result) => {
    if (result) {
      resultHandlerRef.current(result);
    }
  }, []);

  const reader = useMemo(() => {
    const instance = new BrowserAztecCodeReader(DEFAULT_TIME_BETWEEN_SCANS);
    instance.timeBetweenDecodingAttempts = DEFAULT_TIME_BETWEEN_DECODING_ATTEMPTS;
    return instance;
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (paused) {
      return;
    }
    reader.decodeFromConstraints(DEFAULT_CONSTRAINTS, ref.current, decodeCallback);
    return () => {
      reader.reset();
    };
  }, [ref, reader, paused, decodeCallback]);

  return { ref };
}
