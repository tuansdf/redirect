import { validateUrl } from "@/utils/common.util.ts";
import { compressText, decompressText } from "@/utils/crypto.util.ts";
import { createSignal, Match, onCleanup, onMount, Switch } from "solid-js";

export default function App() {
  const [inputUrl, setInputUrl] = createSignal<string>("");
  const [outputUrl, setOutputUrl] = createSignal<string>("");
  const [redirectUrl, setRedirectUrl] = createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [isCopied, setIsCopied] = createSignal<boolean>(false);

  const handleMount = () => {
    try {
      setIsLoading(true);
      const content = window.location.hash;
      const toBeDecoded = content.substring(1);
      if (!content || !toBeDecoded) return;
      const decoded = decodeURIComponent(toBeDecoded);
      if (validateUrl(decoded)) {
        setRedirectUrl(decoded);
        return;
      }
      const decrypted = decompressText(toBeDecoded);
      if (!validateUrl(decrypted)) return;
      setRedirectUrl(decrypted);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    handleMount();
    window.addEventListener("hashchange", handleMount);
  });
  onCleanup(() => {
    window.removeEventListener("hashchange", handleMount);
  });

  const handleSubmit = () => {
    if (!inputUrl() || !validateUrl(inputUrl())) return;
    setOutputUrl(window.location.origin + "#" + compressText(inputUrl()));
  };

  const handleCreateRaw = () => {
    if (!inputUrl() || !validateUrl(inputUrl())) return;
    setOutputUrl(window.location.origin + "#" + encodeURIComponent(inputUrl()));
  };

  const handleCopy = async () => {
    if (!outputUrl()) return;
    await navigator.clipboard.writeText(outputUrl());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRedirect = () => {
    window.location.href = redirectUrl();
  };

  const decodedRedirectUrl = () => decodeURIComponent(redirectUrl());

  const redirectDomain = () => {
    if (!redirectUrl() || !validateUrl(redirectUrl())) return "";
    const url = new URL(redirectUrl());
    return url.host;
  };

  return (
    <>
      <Switch>
        <Match when={isLoading()}>
          <div class="result">Loading...</div>
        </Match>
        <Match when={redirectUrl()}>
          <div class="result">
            <div>You are about to visit the following URL:</div>
            <a href={redirectUrl()}>{decodedRedirectUrl()}</a>
            <button onClick={handleRedirect}>Visit {redirectDomain()}</button>
          </div>
        </Match>
        <Match when={true}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>
              Input URL
              <input class="input" value={inputUrl()} onInput={(e) => setInputUrl(e.currentTarget.value)} />
            </label>
            <label>
              Masked URL
              <input readOnly value={outputUrl()} onInput={(e) => setOutputUrl(e.currentTarget.value)} />
            </label>
            <div class="buttons">
              <button>Create hidden</button>
              <button type="button" onClick={handleCreateRaw}>
                Create raw
              </button>
              <button disabled={isCopied() || !outputUrl()} type="button" onClick={handleCopy}>
                <Switch>
                  <Match when={isCopied()}>
                    <span>Copied</span>
                  </Match>
                  <Match when={!isCopied()}>
                    <span>Copy</span>
                  </Match>
                </Switch>
              </button>
            </div>
          </form>
        </Match>
      </Switch>
    </>
  );
}
