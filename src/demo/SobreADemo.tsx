import { Modal } from '@/index'

interface SobreADemoProps {
  open: boolean
  onClose: () => void
}

export function SobreADemo({ open, onClose }: SobreADemoProps) {
  return (
    <Modal open={open} onClose={onClose} title="Sobre esta demonstração">
      <p>
        Hora Âmbar é um curso fictício. Esta página existe para mostrar os componentes do
        landing-kit funcionando juntos.
      </p>
      <p>
        O formulário não envia nada. Os dados ficam só na memória do navegador e somem quando você
        recarrega a página.
      </p>
      <p>
        A cada etapa, um evento vai para o <code>dataLayer</code>, sem nome nem e-mail. Você vê cada
        um no painel "Eventos disparados", junto do formulário.
      </p>
      <p>A previsão da luz vem de uma API real e gratuita, a Open-Meteo.</p>
      <p>Pessoas, depoimentos e preços são inventados.</p>
    </Modal>
  )
}
