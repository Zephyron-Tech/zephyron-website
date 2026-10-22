// Copies text and reports whether it worked. The Clipboard API exists only in a
// secure context (https, localhost); on plain http, as when a phone opens the dev
// server over the LAN, it falls back to selecting a hidden field and the old
// copy command, which iOS Safari still honours inside a tap.
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Denied or unfocused: try the fallback below.
    }
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.readOnly = true;
  // Off screen, and 16px so iOS does not zoom the page to it.
  field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;font-size:16px';
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  field.remove();
  window.getSelection()?.removeAllRanges();
  return ok;
}
