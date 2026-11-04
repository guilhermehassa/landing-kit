import { useEffect, useEffectEvent, useState } from 'react'
import { Button } from '../Button'

export interface ToastProps {
  /**
   * Texto em destaque. Com `null`, o aviso some, mas a região de status continua na
   * página. Mantenha o Toast montado desde o início e troque só a mensagem.
   */
  message: string | null
  /** Complemento, depois da mensagem. */
  detail?: string
  /** Chamada pelo botão Fechar e ao fim do tempo. Quem usa o Toast põe a mensagem em `null`. */
  onClose: () => void
  /** Tempo na tela, em milissegundos. A contagem para enquanto o ponteiro ou o foco estão no aviso. */
  duration?: number
  closeLabel?: string
}

/**
 * Aviso curto que aparece no pé da tela e some sozinho. É anunciado pelo leitor de
 * tela (`role="status"`) sem tirar o foco de onde a pessoa está.
 */
export function Toast({
  message,
  detail,
  onClose,
  duration = 5000,
  closeLabel = 'Fechar',
}: ToastProps) {
  const [paused, setPaused] = useState(false)
  // Com useEffectEvent, o timer chama o onClose mais recente sem que ele entre nas
  // dependências: uma função nova a cada render do pai não recomeça a contagem
  const closeOnTimeout = useEffectEvent(() => onClose())

  useEffect(() => {
    if (!message || paused) return
    const timer = setTimeout(() => closeOnTimeout(), duration)
    return () => clearTimeout(timer)
  }, [message, detail, duration, paused])

  function close() {
    // O botão some junto com o aviso, e o blur de um elemento removido não é garantido
    setPaused(false)
    onClose()
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-10 flex justify-center">
      {/* Pausa com o ponteiro ou o foco aqui: quem chega ao Fechar pelo Tab não vê o
          aviso sumir debaixo do foco */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className={
          message
            ? 'pointer-events-auto flex max-w-text items-center gap-4 rounded-card border border-border bg-surface-raised p-4 shadow-card'
            : undefined
        }
      >
        {/* A região viva fica sempre no DOM e só troca de conteúdo: uma região criada
            junto com a mensagem muitas vezes não é anunciada. O Fechar fica fora dela,
            para não entrar no anúncio */}
        <div role="status">
          {message && (
            <p>
              <strong className="font-semibold">{message}</strong>
              {detail && ` ${detail}`}
            </p>
          )}
        </div>
        {message && (
          <Button variant="secondary" size="sm" onClick={close} className="shrink-0">
            {closeLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
