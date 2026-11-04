/** Classes do controle, iguais para `<input>` e `<select>`. */
export const controlStyles = [
  'min-h-11 w-full rounded-control border border-border-control bg-surface-raised px-3 py-2',
  // 16 px: abaixo disso, o navegador do iPhone dá zoom ao focar o campo
  'text-base text-text',
  // A borda de erro sai do próprio aria-invalid: o que se vê e o que o leitor de tela
  // anuncia não têm como divergir. O ring engrossa a borda sem mudar a altura do campo
  'aria-[invalid=true]:border-danger aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-danger',
  'disabled:opacity-50',
].join(' ')
