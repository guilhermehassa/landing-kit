import { useState } from 'react'
import { Toast } from '@/index'
import type { Plano } from '@/demo/planos'
import { Beneficios } from '@/demo/sections/Beneficios'
import { Cabecalho } from '@/demo/sections/Cabecalho'
import { ChamadaFinal } from '@/demo/sections/ChamadaFinal'
import { Depoimentos } from '@/demo/sections/Depoimentos'
import { Hero } from '@/demo/sections/Hero'
import { Inscricao } from '@/demo/sections/Inscricao'
import { Perguntas } from '@/demo/sections/Perguntas'
import { Planos } from '@/demo/sections/Planos'
import { Programa } from '@/demo/sections/Programa'
import { Rodape } from '@/demo/sections/Rodape'
import { SobreADemo } from '@/demo/SobreADemo'

// A landing do Hora Âmbar, montada com a API pública da biblioteca (@/index)
export function App() {
  // Bloco 5: o plano escolhido passa para a store do Zustand (escolherPlano), e este
  // estado fica só com o aviso
  const [planoEscolhido, setPlanoEscolhido] = useState<Plano | null>(null)
  const [sobreAberto, setSobreAberto] = useState(false)

  return (
    <>
      <Cabecalho />
      <main id="conteudo">
        <Hero />
        <Beneficios />
        {/* Bloco 6: "Onde está a luz hoje?" (#luz-hoje) entra aqui */}
        <Programa />
        <Depoimentos />
        <Planos onEscolher={setPlanoEscolhido} />
        <Inscricao />
        <Perguntas />
        <ChamadaFinal />
      </main>
      <Rodape onAbrirSobre={() => setSobreAberto(true)} />

      <SobreADemo open={sobreAberto} onClose={() => setSobreAberto(false)} />
      {/* Montado desde o início, mesmo vazio: a região de status precisa existir antes da mensagem */}
      <Toast
        message={planoEscolhido && `Plano ${planoEscolhido.nome} escolhido.`}
        detail="Falta só a inscrição."
        onClose={() => setPlanoEscolhido(null)}
      />
    </>
  )
}
